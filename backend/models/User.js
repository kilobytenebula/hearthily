const mongoose = require('mongoose');

const roleType = ['user', 'systemAdmin', 'kitchen', 'deliveryDriver']
const UserSchema = new mongoose.Schema(
    {
        firstname: { type: String, required: true },
        lastname: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        phonenumber: { type: String, required: true, unique: true },
        address: { type: String, required: true },
        password: { type: String, required: true },
        role: {
            type: String,
            enum: roleType,
            default: 'user'
        },
    },
    {
        versionKey: '__v',
        timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
    }
);

const User = mongoose.model('User', UserSchema);

module.exports = User;
