const mongoose = require('mongoose');
//const { Decimal128 } = require('mongodb');

const Schema = mongoose.Schema;

const orderSchema = new Schema({
    customer_id : {
        type: String,
        required: true
    },
    base_name : {
        type : String,
        required: true
    },
    portion_name : [{
            type : String,
            required: true
     }],
    portion_size : {
        type : String,
        required: true
    },
    qty : {
        type : Number,
        required: true
    },
    date : {
        type : Date,
        required: true
    },
    total_amount : {
        type : Number,
        required: true
    },
    status : {
        type : String,
        required: true
    }
    
})

const Order = mongoose.model("Order",orderSchema);

module.exports = Order;
