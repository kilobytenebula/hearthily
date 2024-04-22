import { errorHandler } from "../utils/error.js";
import bcryptjs from 'bcryptjs';
import User from '../models/user.model.js'


export const test = (req, res) => {
    res.json({
        message: 'API is working',
    });
};




//Update user
export const updateUser = async (req, res, next) => {
    // Check if the user making the request is updating their own account
    if (req.user.id !== req.params.id) {
        return next(errorHandler(401, "You can update only your account!"));
    }

    try {
        // If a new password is provided, hash it before updating
        if (req.body.password) {
            req.body.password = bcryptjs.hashSync(req.body.password, 10)
        }


        // Update user information in the database
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            {
                $set: {
                    username: req.body.username,
                    email: req.body.email,
                    password: req.body.password,
                    profilePicture: req.body.profilePicture,
                }
            },

            { new: true }  // Return the updated document
        );


        // Exclude the password from the response
        const { password, ...rest } = updatedUser._doc;
        res.status(200).json(rest);


    } catch (error) {
        next(error);  // Middleware to handle errors
    }
}




//delete user account
export const deleteUser = async (req, res, next) => {
    // Check if the user making the request is deleting their own account
    if (req.user.id !== req.params.id) {
        return next(errorHandler(200, "You can delete only your account!"));
    }

    try {
        // Delete user from the database
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json("User has been deleted...");
    } catch (error) {
        next(error);
    }
}
// Assuming User model is imported and defined

export const deleteUserById = async (req, res) => {
    const { id } = req.params; // Assuming ID is in URL parameters
    try {
        const userExist = await User.findById(id); // Find user by ID
        // If user doesn't exist, return 404
        if (!userExist) {
            return res.status(404).json({ message: 'User not found' });
        }
        // If user exists, delete user by ID
        await User.deleteOne({ _id: id }); // Using _id to match MongoDB ID
        // Return success message
        return res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        // Handle server errors
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}





export const getUsers = async (req, res, next) => {
    if (!req.user.isAdmin) {
        return next(errorHandler(403, 'You are not allowed to see all users'));
    }
    try {
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 9;
        const sortDirection = req.query.sort === 'asc' ? 1 : -1;

        const users = await User.find()
            .sort({ createdAt: sortDirection })
            .skip(startIndex)
            .limit(limit);

        const usersWithoutPassword = users.map((user) => {
            const { password, ...rest } = user._doc; /////
            return rest;
        });

        const totalUsers = await User.countDocuments();

        const now = new Date();

        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate()
        );
        const lastMonthUsers = await User.countDocuments({
            createdAt: { $gte: oneMonthAgo },
        });

        res.status(200).json({
            users: usersWithoutPassword,
            totalUsers,
            lastMonthUsers,
          });

    } catch (error) {
        next(error);
    }
}

