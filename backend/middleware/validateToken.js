import jwt from "jsonwebtoken";
import { User } from "../models/user.js";

const validateToken = async (req, res, next) => {
    const token = req.cookies.token; // Extract token from cookie
    if (!token) return res.status(401).json({ error: "Missing token" });
    try {
        const decoded = jwt.verify(token, process.env.KEY);
        const user = await User.findOne({ _id: decoded.id });
        if (!user) return res.status(401).json({ error: "User not found" });
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ error: error.message });
    }
};

export default validateToken;
