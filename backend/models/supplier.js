const mongoose = require('mongoose');

const Schema = mongoose.Schema;

//properties of database schema
const supplierSchema = new Schema({
    supplier_name: {
        type : String,
        required: true
    },
    catogory: {
        type : String,
        required: true
    },
    address: {
        type : String,
        required: true
    },
    email: {
        type : String,
        required: true,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        ]
    },
    phone_n: {
        type: String,
        required: true,
        match: [
            /^(0)?\d{10}$/
        ]
    },
    reg_date:{
        type: Date,
        required: true
    }
})

//create database in mangoDB
const Supplier = mongoose.model("Supplier",supplierSchema);

//export the modul
module.exports = Supplier;
