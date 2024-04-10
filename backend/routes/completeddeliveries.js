//Initialializing express router
const router = require('express').Router();
const CompletedDelivery = require('../models/CompletedDelivery');

//CRUD starts here
//1. Create Route
router.route('/add').post((req, res) => {
    // Get data from the request body
    const { deliveryId, userId } = req.body;
    console.log(req.body);
    // Create a new Completed Delivery object
    const newCompletedDelivery = new CompletedDelivery ({
        deliveryId,
        userId,
        date: new Date()
    });

    // Save the new Delivery object to the database
    newCompletedDelivery.save()
        .then(CompletedDelivery => res.status(200).send({ status: "Delivery added", delivery: CompletedDelivery }))
        .catch(err => res.status(400).json('Error: ' + err));
});

//2a. Read Route
router.route('/').get((req, res) => CompletedDelivery.find()
    .then(completedDeliveries => res.json(completedDeliveries))
    .catch(err => console.log(err))
);

//2b. Read Specific Route
router.route('/:id').get(async (req, res) => {
    let CompletedDeliveryId = req.params.id;

    const response = await CompletedDelivery.findById(CompletedDeliveryId)
        .then(response => res.status(200).send({ status: "Delivery fetched", delivery: response }))
        .catch(err => res.status(400).json('Error: ' + err));
});


//3. Update Route
router.route('/:id').put(async (req, res) => {
    let CompletedDeliveryId = req.params.id;
    const { deliveryId, userId } = req.body;

    const updateCompletedDelivery = {
        deliveryId,
        userId
    }

    await CompletedDelivery.findByIdAndUpdate(CompletedDeliveryId, updateCompletedDelivery)
        .then(() => res.status(200).send({ status: "Delivery updated"}))
        .catch(err => res.status(500).send({ status: "Error with updating data", error: err.message }));
});

//4. Delete Route
router.route('/:id').delete(async (req, res) => {
    let CompletedDeliveryId = req.params.id;
    await CompletedDelivery.findByIdAndDelete(CompletedDeliveryId)
        .then(() => res.status(200).send({ status: "Delivery deleted" }))
        .catch(err => res.status(500).send({ status: "Error with deleting delivery", error: err.message }));
});
//CRUD ends here

//export the router
module.exports = router;
