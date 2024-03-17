// Initialize the driver model
const mongoose = require('mongoose');

//create a schema
const Schema = mongoose.Schema;

//create a driver schema
const driverSchema = new Schema({
    employeeId: {
        type: String,
        required: true
    },
    isAvailable: {
        type: Boolean,
        required: true
    },
    isTopRated: {
        type: Boolean,
        required: true
    }
});

//create a model
const Driver = mongoose.model('Driver', driverSchema);

//export the model
module.exports = Driver;
