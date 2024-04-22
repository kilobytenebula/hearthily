import * as yup from 'yup'

class AuthYup {
    registerSchema = yup.object({
        username: yup.string().required(),
        password: yup.string().min(8).required(),
        email: yup.string().email().required(),
        confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match').required(), // New field and validation
    })
    loginSchema = yup.object({
        password: yup.string().required(),
        email: yup.string().required(),
    })
    forgotPassword = yup.object({
        nic: yup.string().required(),
        password: yup.string().min(8).required(),
        confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match').required(), // New field and validation
    })
    changePassword = yup.object({
        token: yup.string().required(),
        password: yup.string().min(8).required()
    })
    resetByEmailPassword = yup.object({
        email: yup.string().email().required(),
    })
}


export default AuthYup = new AuthYup();