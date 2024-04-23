const User = require("../Modal/User.js");
const response = require("../Utils/ResponseHandler/ResponseHandler.js");
const ResTypes = require("../Utils/ResponseHandler/ResTypes.js");
const bcrypt = require("bcryptjs");
const generateToken = require("../Utils/Token/generateToken.js");
const EmailSender = require("../Utils/EmailSender/EmailSender.js");
const passwordReset = require("../Utils/EmailSender/RePasswordTemp.js");

class AuthController {

    //create SignUp
    signUp = async (req, res) => {
        const { name, email, password } = req.body;
        try {
            const existing = await User.findOne({ email })
            if (existing) return response(res, 403, ResTypes.errors.user_exists)

            const hashedPassword = await bcrypt.hash(password, 10);

            const user = new User({ name, email, password: hashedPassword })
            const createdUser = await user.save()
            if (createdUser) return response(res, 201, ResTypes.successMessages.user_created)
        } catch (error) {
            return response(res, 500, error)
        }
    }
    //create SignIn
    signIn = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email })
        if (!user) {
            return response(res, 404, ResTypes.errors.no_user);
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return response(res, 403, ResTypes.errors.invalid_password)
        }
        const token = generateToken(user);
        return response(res, 201, { id: user._id, email, token, role: user.role, ...ResTypes.successMessages.login_successful });
    } catch (error) {
        console.error(error)
        return response(res, 500, error)
    }
}
    // Forgot Password
    forgotPassword = async (req, res) => {
        const { nic, newPassword } = req.body;
        try {
            const user = await User.findOne({ nic });
            if (!user) {
                return response(res, 404, { message: "password reseted" });
            }
            // Generate new hashed password
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            // Update user's password
            user.password = hashedPassword;
            await user.save();
            return response(res, 200, { message: "password reseted" });
        } catch (error) {
            console.error(error);
            return response(res, 500, error);
        }
    }
    // create reset-password with email
    resetPassword = async (req, res) => {
        const { email } = req.body;
        if (!email) return response(res, 404, { message: "Email not provided" })
        try {
            const user = await User.findOne({ email });
            if (!user) return response(res, 404, { message: "User not found" });

            const token = Math.random().toString(36).slice(-8);
            const expireDate = Date.now() + 360000;
            EmailSender.sendVerificationEmail(user, token, passwordReset(token), "Password Reset", async () => {
                const result = await User.updateOne(
                    { email },
                    { $set: { resetPasswordToken: token, resetPasswordExpire: expireDate } }
                );
                if (!result) return res.status(200).json({ message: "Failed to update user", code: 404 });
            }, res);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Internal server error", code: 500 });
        }
    };

    // verify reset-password with token
    verifyResetPassword = async (req, res) => {
        const { token } = req.params;
        const { password } = req.body;

        if (!password) return response(res, 404, { message: "Password not provided" });
        // if (!password) return res.status(200).json({ message: "Password not provided", code: "403" });

        try {
            if (!token) return response(res, 404, { message:  "Token not provided" });
            // if (!token) return res.status(200).json({ message: "Token not provided", code: "403" });

            const user = await User.findOne({ resetPasswordToken: token });
            if (!user) return response(res, 404, { message:  "Invalid token"});
            // if (!user) return res.status(200).json({ message: "Invalid token", code: "403" });

            const tokenExpire = await User.findOne({ resetPasswordExpire: { $gt: Date.now() } });
            if (!tokenExpire) return response(res, 404, { message:  "Token expired"});
            // if (!tokenExpire) return res.status(200).json({ message: "Token expired", code: "403" });

            const hashedPassword = await bcrypt.hash(password, 10);
            const result = await User.updateOne(
                { resetPasswordToken: token },
                { $set: { resetPasswordToken: "", resetPasswordExpire: "", password: hashedPassword } }
            );

            if (result.modifiedCount === 0) return response(res, 403, { message: "Failed operation" });
            return response(res, 200, { message: "Password reset successfully" });
        } catch (error) {
            return response(res, 500, { message: "Internal server error"});
        }
    };


}

module.exports = new AuthController();