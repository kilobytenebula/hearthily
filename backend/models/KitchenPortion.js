const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Define the schema for KitchenPortion
const KitchenPortionSchema = new Schema({
    id: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    p_type: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    available: {
        type: Boolean,
        default: true,
    },
});

// Create and export the model
const KitchenPortion = mongoose.model("KitchenPortion", KitchenPortionSchema);
module.exports = KitchenPortion;
