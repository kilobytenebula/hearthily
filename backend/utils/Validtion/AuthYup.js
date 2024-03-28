import yup from 'yup';

class AuthYup {
    login = yup.object({
        password: yup.string().min(8).required(),
        email: yup.string().email().required(),
        role: yup.string().oneOf(['user', 'systemAdmin', 'kitchen', 'deliveryDriver']).required(),
    })
    updatePassword = yup.object({
        role: yup.string().oneOf(['user', 'systemAdmin', 'kitchen', 'deliveryDriver']).required(),
        name: yup.string().required(),
        password: yup.string().min(8).required(),
        email: yup.string().email().required(),
    });

    updateUser = yup.object({
        role: yup.string().oneOf(['user', 'systemAdmin', 'kitchen', 'deliveryDriver']).required(),
        email: yup.string().email().required(),
        password: yup.string().min(8).required(),
        firstname: yup.string().required(),
        lastname: yup.string().required(),
        phonenumber: yup.string().required(),
        address: yup.string().required(),
    })

    deleteUser = yup.object({
        role: yup.string().oneOf(['user', 'systemAdmin', 'kitchen', 'deliveryDriver']).required(),
        email: yup.string().email().required(),
    });

    getUser = yup.object({
        role: yup.string().oneOf(['user', 'systemAdmin', 'kitchen', 'deliveryDriver']).required(),
        email: yup.string().email().required(),
    });

    register = yup.object({
        firstname: yup.string().required(),
        lastname: yup.string().required(),
        email: yup.string().email().required(),
        phonenumber: yup.string().required(),
        address: yup.string().required(),
        password: yup.string().min(8).required(),
        confirmpassword: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match').required(),
        role: yup.string().oneOf(['user', 'systemAdmin', 'kitchen', 'deliveryDriver']).required(),
    });
}

export default AuthYup = new AuthYup();
