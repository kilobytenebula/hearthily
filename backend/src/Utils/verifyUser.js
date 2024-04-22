import  jwt  from "jsonwebtoken";
import { errorHandler } from "./error.js";


export const verifyToken = (req, res, next) => {
    // Extract the token from the request's cookie
    const token = req.cookies.access_token;

    // Check if the token is missing
    if(!token) return next(errorHandler(401,"You are not authenticated!"));

    // Verify the token using the secret key
    jwt.verify(token,process.env.JWT_SECRET, (err, user) => {
        if (err) return next(errorHandler(403,"Token is not valid!"));   // Check if there's an error during verification

        req.user = user;
        next();
    });
}