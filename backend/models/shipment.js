const mongoose = require('mongoose');

const Schema = mongoose.Schema;

//properties of database schema
const shipmentSchema = new Schema({
    supplier_name: {
        type : String,
        required: true
    },
    catogory: {
        type : String,
        required: true
    },
    email:{
        type : String,
        required: true,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        ]
    },
    order_list:{
        type : String,
        required: true
    },
    ship_date:{
        type: Date,
        required: true
    },
    status: {
        type : String,
        required: true,
    }
})

//create database in mangoDB
const Shipment = mongoose.model("Shipment",shipmentSchema);

//export the modul
module.exports = Shipment;