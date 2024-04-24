const mongoose = require('mongoose');
//const { Decimal128 } = require('mongodb');

const Schema = mongoose.Schema;

const portionSchema = new Schema({
    image_url : {
        type : String,
        required: true
    },
    portion_name : {
        type : String,
        required: true
    },
    portion_type : {
        type : String,
        required: true
    },
    price : {
        type : Number,
        required: true
    },
    
})

const Portion = mongoose.model("Portion",portionSchema);

module.exports = Portion;