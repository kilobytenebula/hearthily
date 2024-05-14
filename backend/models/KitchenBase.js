const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const kitchenBaseSchema = new Schema({
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
    category: {
        type: String,
        required: true,
    },
    m_type: {
        type: String,
        required: true,
    },
    reg_price: {
        type: Number,
        required: true,
    },
    full_price: {
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

const KitchenBase = mongoose.model('KitchenBase', kitchenBaseSchema);

module.exports = KitchenBase;
