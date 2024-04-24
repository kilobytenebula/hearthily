// Initialize the driver model
const mongoose = require('mongoose');

// Create a schema
const Schema = mongoose.Schema;

// Create a driver schema
const driverSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    deliveryCount: {
        type: Number,
        required: true,
        default: 0
    },
    avgRating: {
        type: Number,
        required: true,
        default: 0.0
    },
    isAvailable: {
        type: Boolean,
        required: true,
        default: true
    },
});

// Create a model
const Driver = mongoose.model('Driver', driverSchema);

// Export the model
module.exports = Driver;