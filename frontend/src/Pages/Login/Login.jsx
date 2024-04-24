import React, { useState } from 'react'
import { NavLink, useNavigate, Navigate, Link } from 'react-router-dom'
import AuthService from '../../Services/Auth/AuthService'
import Toaster from '../../Utils/Constants/Toaster'
import { useFormik } from 'formik'
import AuthYup from '../../Validation/Auth/AuthYup'
import LocalStore from '../../Store/LocalStore'
import { useAuth } from '../../Services/Auth/AuthContext'

export default function Login() {
    const [loading, setLoading] = useState(false)
    const { login } = useAuth();
    const navigate = useNavigate()
    const initValues = {
        email: '',
        password: '',
    }
    const { values, handleChange, handleSubmit, errors, touched } = useFormik({
        initialValues: initValues,
        validationSchema: AuthYup.loginSchema,
        onSubmit: async (values) => {
            setLoading(true)
            Toaster.loadingToast("Validating User .......")
            try {
                const result = await AuthService.authLogin(values)
                if (result.data.code === 201) {
                    const { token, email, role, id } = result.data.data;
                    LocalStore.storeToken({ token, role, email, id });
                    login(role, id);
                    Toaster.justToast('success', result.data.data.message, () => {
                        Toaster.dismissLoadingToast()
                        navigate('/order')
                    })
                }
            } catch (error) {
                alert(error.response.data.data.message)
            } finally {
                setLoading(false)
                Toaster.dismissLoadingToast()
            }
        }
    })

    return (
        <>
            <div className="position-relative overflow-hidden min-vh-100 d-flex align-items-center justify-content-center">
                <div className="d-flex align-items-center justify-content-center w-100">
                    <div className="row justify-content-center w-100">
                        <div className="col-md-8 col-lg-6 col-xxl-3">
                            <div className="card mb-0 shadow-lg" style={{ backgroundColor: '#1F1D2B' }}>
                                <div className="card-body">
                                    <NavLink to={'/login'} className="text-nowrap logo-img text-center d-block py-3 pb-5 w-100">
                                        <h1 className='m-0 fw-bolder text-white'>Login</h1>
                                    </NavLink>
                                    <form className='needs-validation' noValidate onSubmit={handleSubmit}>
                                        <div className="mb-3">
                                            <label htmlFor="exampleInputEmail1" className="form-label text-white">Email</label>
                                            <input
                                                value={values.email}
                                                onChange={handleChange}
                                                type="email"
                                                name='email'
                                                className={`form-control ${(errors.email && touched.email) ? 'is-invalid' : ''}`}
                                                id="exampleInputEmail1"
                                                aria-describedby="emailHelp"
                                                required />
                                            <div className="invalid-feedback">
                                                {errors.email}
                                            </div>
                                        </div>
                                        <div className="mb-0">
                                            <label htmlFor="exampleInputPassword1" className="form-label text-white">Password</label>
                                            <input
                                                value={values.password}
                                                onChange={handleChange}
                                                name='password'
                                                type="password"
                                                className={`form-control ${(errors.password && touched.password) ? 'is-invalid' : ''}`}
                                                id="exampleInputPassword1"
                                                required />
                                            <div className="invalid-feedback">
                                                {errors.password}
                                            </div>
                                        </div>
                                        <div className='w-100 d-flex justify-content-end'>
                                            <Link to={'/resetPassword'} className='text-warning'>Reset Password</Link>
                                        </div>
                                        <button type='submit' disabled={loading} className="mt-4 btn text-white fw-bolder w-100 py-8 fs-4 mb-4 rounded-2" style={{backgroundColor:"#f18638"}}>Sign In</button>
                                        <div className="d-flex align-items-center justify-content-center">
                                            <p className="fs-4 mb-0 fw-bold text-white-50">New User?</p>
                                            <NavLink to={'/register'} className="text-warning fw-bold ms-2">Create an account</NavLink>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>


    )
}
