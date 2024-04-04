const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const deliverySchema = new Schema({
    orderId: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    isPaid: {
        type: Boolean,
        required: true,
    },
    deliveryStatus: {
        type: String,
        required: true
    },
    paymentMethod: {
        type: String,
        required: true
    },
});

const Delivery = mongoose.model('Delivery', deliverySchema);

module.exports = Delivery;
