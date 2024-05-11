// Initialize the emp model
const mongoose = require('mongoose');

// Create a schema
const Schema = mongoose.Schema;

const EmployeeSchema = new mongoose.Schema({
    empNumber: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    age: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    jobRole: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    }
});

const Employee = mongoose.model("Employee", EmployeeSchema);
module.exports =  Employee;
