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
    address:{
        type: String,
        required: true
    },
    phoneNumber:{
        type:Number,
        required: true

    },
    
    paymentSlip:{
        data: String,
    },
    isSuccess:{
        type: String,
        default: 'pending'
    }
})
const payment = mongoose.model("orderPayments",paymentSchema);

module.exports = payment;
