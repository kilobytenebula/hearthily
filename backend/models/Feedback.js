//Initialize the feedback model
const mongoose = require('mongoose');

//create a schema
const Schema = mongoose.Schema;

//create a feedback schema
const feedbackSchema = new Schema({
    customerId: {
        type: String,
        required: true
    },
    deliveryId: {
        type: String,
        required: true
    },
    driverId: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    comment: {
        type: String,
        required: true
    }
});

//create a model
const Feedback = mongoose.model('Feedback', feedbackSchema);

//export the model
module.exports = Feedback;