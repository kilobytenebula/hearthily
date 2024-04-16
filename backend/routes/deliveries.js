//Initialializing express router
const router = require('express').Router();
let Delivery = require('../models/Delivery');

//CRUD starts here
//1. Create Route
router.route('/add').post((req, res) => {
    // Get data from the request body
    const { orderId, userId, isPaid } = req.body;
    const deliveryStatus = "of-delivery";
    let paymentMethod = "";

    if (isPaid) {
        paymentMethod = 'Paid';
    } else {
        paymentMethod = 'COD';
    }

    // Create a new Delivery object
    const newDelivery = new Delivery({
        orderId,
        userId,
        isPaid,
        paymentMethod,
        deliveryStatus,
        date: new Date()
    });

    // Save the new Delivery object to the database
    newDelivery.save()
        .then(delivery => res.status(200).send({ status: "Delivery added", delivery: delivery }))
        .catch(err => res.status(400).json('Error: ' + err));
});

//2a. Read Route
router.route('/').get((req, res) => Delivery.find()
    .then(deliveries => res.json(deliveries))
    .catch(err => console.log(err))
);

//2b. Read Specific Route
router.route('/:id').get(async (req, res) => {
    let deliveryId = req.params.id;

    const delivery = await Delivery.findById(deliveryId)
        .then(delivery => res.status(200).send({ status: "Delivery fetched", delivery: delivery }))
        .catch(err => res.status(400).json('Error: ' + err));
});


//3. Update Route
router.route('/:id').put(async (req, res) => {
    let deliveryId = req.params.id;
    const { driverId, deliveryStatus } = req.body;

    const updateDelivery = {
        driverId,
        deliveryStatus
    }

    await Delivery.findByIdAndUpdate(deliveryId, updateDelivery)
        .then(() => res.status(200).send({ status: "Delivery updated"}))
        .catch(err => res.status(500).send({ status: "Error with updating data", error: err.message }));
});

//4. Delete Route
router.route('/:id').delete(async (req, res) => {
    let deliveryId = req.params.id;
    await Delivery.findByIdAndDelete(deliveryId)
        .then(() => res.status(200).send({ status: "Delivery deleted" }))
        .catch(err => res.status(500).send({ status: "Error with deleting delivery", error: err.message }));
});
//CRUD ends here

//export the router
module.exports = router;
