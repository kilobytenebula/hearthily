const Jwt = require('jsonwebtoken');

const generateToken = (user) => {
    return Jwt.sign(
        { id: user.id, role: user.role},
        process.env.SECRET,
        { expiresIn:process.env.TOKEN_EXPIRE}
    )
}

module.exports = generateToken;