const mongoose = require('mongoose');

const urlPic = [
    "https://avatars.githubusercontent.com/u/54225118?v=4",
    "https://avatars.githubusercontent.com/u/22358125?v=4",
    "https://avatars.githubusercontent.com/u/98579886?v=4",
    "https://avatars.githubusercontent.com/u/17646305?v=4"
]
const getRandomDefaultpic = () => {
    const randomIndex = Math.floor(Math.random() * urlPic.length);
    return urlPic[randomIndex];
}
const roleType = ['kitchen', 'delivery_driver', 'user', 'system_admin'];
const genderType = ['male', 'female']
const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        fname: {
            type: String,
            required: false
        },
        lname: {
            type: String,
            required: false
        },
        address: {
            type: String
        },
        age: {
            type: Number,
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true,
            minlength: 8
        },
        nic: {
            type: String,
        },
        photoUrl: {
            type: String,
            default: getRandomDefaultpic
        },
        role: {
            type: String,
            enum: roleType,
            default: 'user',
            lowercase: true,
        },
        gender: {
            type: String,
            lowercase: true,
            enum: genderType,
            default: 'male'
        },
        resetPasswordToken: String,
        resetPasswordExpire: Date,
    },
    {
        versionKey: '__v',
        timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
    }
);

const User = mongoose.model('User', userSchema);
module.exports = User;