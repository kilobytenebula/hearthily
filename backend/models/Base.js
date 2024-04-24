const mongoose = require('mongoose');
//const { Decimal128 } = require('mongodb');

const Schema = mongoose.Schema;

const baseSchema = new Schema({
    image_url: {
        type : String,
        required: true
    },
    base_name : {
        type : String,
        required: true
    },
    base_type : {
        type : String,
        required: true
    },
    category : {
        type : String,
        require: true
    },
    reg_price : {
        type : Number,
        required: true
    },
    full_price : {
        type : Number,
        required: true
    },
    
})

const Base = mongoose.model("Base",baseSchema);

module.exports = Base; 