const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const kitchenBaseSchema = new Schema({
    id: {
        type: Number,
        required: false,
    },
    name: {
        type: String,
        required: false,
    },
    category: {
        type: String,
        required: false,
    },
    m_type: {
        type: String,
        required: false,
    },
    reg_price: {
        type: Number,
        required: false,
    },
    full_price: {
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

const KitchenBase = mongoose.model('KitchenBase', kitchenBaseSchema);

module.exports = KitchenBase;
