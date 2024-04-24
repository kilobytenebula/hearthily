//Initialize feedback model
const mongoose = require('mongoose');

//create a schema
const Schema = mongoose.Schema;

//create a feedback schema
const feedbackSchema = new Schema({
    orderId: {
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
