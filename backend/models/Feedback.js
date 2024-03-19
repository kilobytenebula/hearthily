//Initialize the feedback model
const mongoose = require('mongoose');

//create a schema
const Schema = mongoose.Schema;

//create a feedback schema
const feedbackSchema = new Schema({
    customerId: {
        type: String,
        required: false
    },
    deliveryId: {
        type: String,
        required: false
    },
    driverId: {
        type: String,
        required: false
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