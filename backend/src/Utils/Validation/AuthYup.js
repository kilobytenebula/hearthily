const yup = require('yup');

class AuthYup {
    registerSchema = yup.object({
        name: yup.string().required(),
        password: yup.string().min(8).required(),
        email: yup.string().email().required(),
    })
    loginSchema = yup.object({
        password: yup.string().required(),
        email: yup.string().required()
    })
    forgotPassword = yup.object({
        newPassword: yup.string().min(8).required(),
        nic: yup.string().required()
    })
}

module.exports = new AuthYup();