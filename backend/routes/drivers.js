//Intializing the express router
const router = require('express').Router();
const Driver = require('../models/Driver');
const Delivery = require('../models/Delivery');
const Feedback = require('../models/Feedback');


//CRUD starts here
//1. Create Route
router.route('/add').post((req, res) => {
    //get data from the request body
    const { userId, deliveryCount, avgRating, isAvailable } = req.body;

    //create a new driver object
    const newDriver = new Driver({
        userId,
        deliveryCount,
        avgRating,
        isAvailable
    });

    //save the new driver object to the database
    const driver = newDriver.save()
        .then(driver => res.status(200).send({ status: "Driver added", driver: driver }))
        .catch(err => res.status(400).json('Error: ' + err));
});

//2a. Fetch all drives
router.route('/').get(async (req, res) => {
    try {
        // Find all drivers
        const drivers = await Driver.find();

        // Iterate through each driver
        for (const driver of drivers) {
            // Find completed deliveries for the driver
            const completedDeliveries = await Delivery.find({ driverId: driver.userId, deliveryStatus: "completed" });

            // Get the number of completed deliveries
            const deliveryCount = completedDeliveries.length;

            // If there are no completed deliveries, set average rating to 0
            let averageRating = 0;

            if (deliveryCount > 0) {
                // Extract order IDs from completed deliveries
                const orderIds = completedDeliveries.map(delivery => delivery.orderId);

                // Find feedback for the extracted order IDs
                const feedback = await Feedback.find({ orderId: { $in: orderIds } });

                // Calculate average rating for the driver
                let totalRating = 0;
                if (feedback.length > 0) {
                    totalRating = feedback.reduce((acc, curr) => acc + curr.rating, 0);
                }
                averageRating = feedback.length > 0 ? totalRating / feedback.length : 0;
            }

            // Check if average rating or delivery count has changed
            if (driver.avgRating !== averageRating || driver.deliveryCount !== deliveryCount) {
                // Update the driver document with new values
                driver.avgRating = averageRating.toPrecision(2);
                driver.deliveryCount = deliveryCount;

                // Save the updated driver document back to the database
                await driver.save();
            }
        }

        // Return the list of drivers with updated values
        const updatedDrivers = await Driver.find();
        const driverList = updatedDrivers.map(driver => ({
            _id: driver._id,
            userId: driver.userId,
            deliveryCount: driver.deliveryCount,
            averageRating: driver.avgRating,
            isAvailable: driver.isAvailable
        }));

        res.status(200).json({ status: "Driver list fetched", drivers: driverList });

    } catch (error) {
        console.error('Error fetching driver list:', error);
        res.status(500).json({ status: "Error fetching driver list", error: error.message });
    }
});


// 2b. Fetch a specific driver
router.route('/:id').get(async (req, res) => {
    let driverId = req.params.id;

    const driver = await Driver.findById(driverId)
        .then(driver => res.status(200).send({ status: "Driver fetched", driver: driver }))
        .catch(err => res.status(400).json('Error: ' + err));
});


//3. Update Route
router.route('/:id').put(async (req, res) => {
    let driverId = req.params.id;
    const { isAvailable } = req.body;

    const updateDriver = {
        isAvailable
    }

    await Driver.findByIdAndUpdate(driverId, updateDriver)
        .then(() => res.status(200).send({ status: "Driver updated"}))
        .catch(err => res.status(500).send({ status: "Error with updating data", error: err.message }));
});

//4. Delete Route
router.route('/:id').delete(async (req, res) => {
    let driverId = req.params.id;
    await Driver.findByIdAndDelete(driverId)
        .then(() => res.status(200).send({ status: "Driver deleted" }))
        .catch(err => res.status(500).send({ status: "Error with deleting driver", error: err.message }));
});
//CRUD ends here

//export the router
module.exports = router;

