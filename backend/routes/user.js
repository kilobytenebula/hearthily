import express from 'express'
import bcrypt from 'bcrypt'
const router = express.Router();
import { User } from '../models/user.js'
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'
import validateScehma from '../middleware/Schema/validateScehma.js';
import AuthYup from '../utils/Validtion/AuthYup.js';
import validateToken from '../middleware/validateToken.js';

router.post('/signup', validateScehma(AuthYup.register), async (req, res) => {
    try {
        const { firstname, lastname, email, phonenumber, address, password, role } = req.body;
        // Check if user already exists with role
        const user = await User.findOne({ email, role });
        if (user) return res.status(400).json({ message: "User already exists" });
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 12);
        // Create a new user instance
        const newUser = new User({
            firstname,
            lastname,
            email,
            phonenumber,
            address,
            password: hashedPassword,
            role
        });
        // Save the new user to the database
        await newUser.save();
        return res.status(201).json({ status: true, message: "User created successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

router.post('/login', validateScehma(AuthYup.login), async (req, res) => {
    const { email, password, role } = req.body;
    try {
        const user = await User.findOne({ email, role });
        if (!user) return res.status(404).json({ status: false, message: "User does not exist" });

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(401).json({ status: false, message: "Invalid credentials" });

        const token = jwt.sign({ id: user._id }, process.env.KEY, { expiresIn: "1h" });
        return res
            .cookie("token", token, { httpOnly: true, maxAge: 360000 })
            .status(200)
            .json({ status: true, message: "Login successful" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: false, message: "Internal server error" });
    }
});

router.put('/updateUser', validateToken ,validateScehma(AuthYup.updateUser), async (req, res) => {
    const { password, address, phonenumber, email, lastname, firstname, role } = req.body;
    try {
        const userExist = await User.findOne({ email, role });
        if (!userExist) return res.status(404).json({ error: "No user found" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await User.updateOne(
            { email, role },
            { $set: { lastname, firstname, address, phonenumber, password: hashedPassword } }
        );

        if (result.modifiedCount === 0) {
            return res.status(403).json({ error: "Failed to update user" });
        }
        return res.status(200).json({ message: "User updated successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
});

router.delete('/deleteUser', validateToken ,validateScehma(AuthYup.deleteUser), async (req, res) => {
    const { email, role } = req.body;
    try {
        const userExist = await User.findOne({ email, role });
        if (!userExist) return res.status(404).json({ error: "No user found" });

        const result = await User.deleteOne({ email, role });
        if (result.deletedCount === 0) return res.status(403).json({ error: "Failed to delete user" });

        return res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
});

router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ status: false, message: "User does not exist" });
        }

        const token = jwt.sign({ id: user._id }, process.env.KEY, {
            expiresIn: "5m",
        });

        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'ashan445537@gmail.com',
                pass: 'znwt mtid hoil wejn',
            }
        });

        const encodedToken = encodeURIComponent(token).replace(/\./g, "%2E");
        var mailOptions = {
            from: 'ashan445537@gmail.com',
            to: `${email}, ashanmadhuwantha7@gmail.com`,
            subject: 'Rest Password',
            text: `http://localhost:3000/resetPassword/${encodedToken}`,
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                return res.json({ status: false, message: "Error sending email" });
            } else {
                return res.json({ status: true, message: "Password reset link has been sent to your email" });
            }
        });

    } catch (err) {
        console.log(err)
    }
})

router.get('/resetPassword/:token', (req, res) => {
    const token = req.params.token;
    res.send(`Reset password page for token: ${token}`);
});
//getAllUsers
router.get('/getAllUsers', validateToken ,async (req, res) => {
    try {
        const users = await User.find({});
        if (!users || users.length === 0) {
            return res.status(404).json({ error: "No users found" });
        }
        return res.status(200).json({ users });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
});
//getUser
router.post("/get-user", validateToken ,validateScehma(AuthYup.getUser), async (req, res) => {
    try {
        const { email, role } = req.body;
        const user = await User.findOne({ email, role });
        if (!user) {
            return res.status(404).json({ error: "No user found" });
        }
        return res.status(200).json({ user });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
});



export { router as UserRouter }
