const mongoose = require("mongoose");

const Schema = mongoose.Schema;


const paymentSchema = new Schema({

    orderId:{
        type: Schema.Types.ObjectId,
        ref: 'Order',
        required: true
        
    },
    customerId:{
        type: Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    date:{
        type: Date,
        required: true,

    },
    paymentMethod:{

        type: String,
        required: true
    },
    // paymentSlip:{
        // type: Image,
        

    // },
    isSuccess:{
        type: Boolean,
        required: true
    }



})
const payment = mongoose.model("orderPayments",paymentSchema);

module.exports = payment;
