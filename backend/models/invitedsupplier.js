const mongoose = require('mongoose');

const Schema = mongoose.Schema;

//properties of database schema
const inviterSchema = new Schema({
    inviter_name: {
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
    int_date:{
        type: Date,
        required: true
    },
    status: {
        type: String,
        required: true,
    }

})

//create database in mangoDB
const Inviter = mongoose.model("InvitedSupplier",inviterSchema);

//export the modul
module.exports = Inviter;