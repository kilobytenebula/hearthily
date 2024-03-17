//Intializing the express router
const router = require('express').Router();
let Driver = require('../models/Driver');


//CRUD starts here
//1. Create Route
router.route('/add').post((req, res) => {
    //get data from the request body
    const employeeId = req.body.employeeId;
    const isAvailable = req.body.isAvailable;
    const isTopRated = req.body.isTopRated;

    //create a new driver object
    const newDriver = new Driver({
        employeeId,
        isAvailable,
        isTopRated
    });

    //save the new driver object to the database
    const driver = newDriver.save()
        .then(driver => res.status(200).send({ status: "Driver added", driver: driver }))
        .catch(err => res.status(400).json('Error: ' + err));
});

//2a. Read Route
router.route('/').get((req, res) => Driver.find()
    .then(drivers => res.json(drivers))
    .catch(err => console.log(err))
);

//2b. Read Specific Route
router.route('/:id').get(async (req, res) => {
    let driverId = req.params.id;

    const driver = await Driver.findById(driverId)
        .then(driver => res.status(200).send({ status: "Driver fetched", driver: driver }))
        .catch(err => res.status(400).json('Error: ' + err));
});


//3. Update Route
router.route('/:id').put(async (req, res) => {
    let driverId = req.params.id;
    const { employeeId, isAvailable, isTopRated } = req.body;

    const updateDriver = {
        employeeId,
        isAvailable,
        isTopRated
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

