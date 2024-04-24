const Jwt = require("jsonwebtoken");
const User = require("../Modal/User.js");
const response = require("../Utils/ResponseHandler/ResponseHandler.js");
const ResTypes = require("../Utils/ResponseHandler/ResTypes.js");

const validateToken = (req,res,next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return response(res,401,ResTypes.errors.missing_token)
    }
    const token = authHeader.split(" ")[1];
    Jwt.verify(token, process.env.SECRET, async (err, decode) => {
        if (err) {
            return response(res,401,err)
        }
        const user = await User.findOne({ _id: decode.id })
        if (!user) {
            return response(res,401,ResTypes.errors.no_user)
        }
        req.user = user
        next();
    })
}

module.exports = validateToken;