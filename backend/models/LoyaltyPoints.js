const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const loyaltySchema = new Schema({

    customerId:{
        type: Schema.Types.ObjectId,
        ref: 'OrderPayments',
        required: true
    },
    points: {
        type : Number,
        required: true
    },

})
const loyalty = mongoose.model("loyalty",loyaltySchema);

module.exports = loyalty;
