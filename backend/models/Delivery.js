const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const deliverySchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    orderId: {
        type: String,
        required: true
    },
    driverId: {
        type: String,
        required: false,
        default: null
    },
    paymentMethod: {
        type: String,
        required: true
    },
    deliveryStatus: {
        type: String,
        required: true,
        default: 'of-delivery'
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const Delivery = mongoose.model('Delivery', deliverySchema);

module.exports = Delivery;
