const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Define the schema for KitchenPortion
const KitchenPortionSchema = new Schema({
    id: {
        type: Number,
        required: false,
    },
    name: {
        type: String,
        required: false,
    },
    p_type: {
        type: String,
        required: false,
    },
    price: {
        type: Number,
        required: false,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    available: {
        type: Boolean,
        default: false,
    },
});

// Create and export the model
const KitchenPortion = mongoose.model("KitchenPortion", KitchenPortionSchema);
module.exports = KitchenPortion;
