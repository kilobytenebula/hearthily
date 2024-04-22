//Initializing the express router
const router = require('express').Router();

//import the feedback model
let Feedback = require('../models/Feedback');

//CRUD starts here
//1. Create Route
router.route('/add').post((req, res) => {
    //get data from the request body
    const orderId = req.body.orderId;
    const rating = req.body.rating;
    const comment = req.body.comment;

    //create a new feedback object
    const newFeedback = new Feedback({
        orderId,
        rating,
        comment
    });

    //save the new feedback object to the database
    newFeedback.save()
        .then(feedback => res.status(200).send({ status: "Feedback added", feedback: feedback }))
        .catch(err => res.status(400).json('Error: ' + err));
});

//2a. Read Route
router.route('/').get((req, res) => Feedback.find()
    .then(feedbacks => res.json(feedbacks))
    .catch(err => console.log(err))
);

//2b. Read Specific Route
router.route('/:id').get(async (req, res) => {
    let orderId = req.params.id;

    const feedback = await Feedback.findOne({ orderId: orderId })
        .then(feedback => res.status(200).send({ status: "Feedback fetched", feedback: feedback }))
        .catch(err => res.status(400).json('Error: ' + err));
});

//3. Update Route
router.route('/:id').put(async (req, res) => {
    let feedbackId = req.params.id;
    const { orderId, rating, comment } = req.body;

    const updateFeedback = {
        orderId,
        rating,
        comment
    }

    await Feedback.findByIdAndUpdate(feedbackId, updateFeedback)
        .then(() => res.status(200).send({ status: "Feedback updated", feedback: updateFeedback }))
        .catch(err => res.status(500).send({ status: "Error with updating data", error: err.message }));
});

//4. Delete Route
router.route('/:id').delete(async (req, res) => {
    let feedbackId = req.params.id;
    await Feedback.findByIdAndDelete(feedbackId)
        .then(() => res.status(200).send({ status: "Feedback deleted" }))
        .catch(err => res.status(500).send({ status: "Error with deleting feedback", error: err.message }));
});
//CRUD ends here

//export the router
module.exports = router;
