const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CompletedDeliverySchema = new Schema({
    deliveryId: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const CompletedDelivery = mongoose.model('CompletedDelivery', CompletedDeliverySchema);

module.exports = CompletedDelivery;
