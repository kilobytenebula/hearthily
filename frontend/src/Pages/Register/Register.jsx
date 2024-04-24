import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useFormik } from 'formik';
import AuthYup from '../../Validation/Auth/AuthYup';
import AuthService from '../../Services/Auth/AuthService';
import ResponseHandler from '../../Utils/Constants/ResponseHandler';
import Toaster from '../../Utils/Constants/Toaster';

export default function Register() {
    const [loading, setLoading] = useState(false)
    const initValues = {
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    }
    const navigate = useNavigate();
    const { values, handleChange, handleSubmit, errors, touched } = useFormik({
        initialValues: initValues,
        validationSchema: AuthYup.registerSchema,
        onSubmit: async (values) => {
            setLoading(true)
            Toaster.loadingToast("Creating User .......")
            try {
                const result = await AuthService.authRegister(values)
                if (result.data.code === 201) {
                    Toaster.justToast('success', result.data.data.message, () => {
                        Toaster.dismissLoadingToast()
                        navigate('/login')
                    })
                }
            } catch (error) {
                ResponseHandler.handleResponse(error)
                console.log('Error', error.response.data.data.message);
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
                            <div className="card mb-0 shadow-lg " style={{ backgroundColor: '#1F1D2B' }}>
                                <div className="card-body">
                                    <NavLink to={'/register'} className="text-nowrap logo-img text-center d-block py-3 pb-5 w-100">
                                        <h1 className='text-white m-0 fw-bolder'>Sign Up</h1>
                                    </NavLink>
                                    <form className='needs-validation' noValidate onSubmit={handleSubmit}>
                                        <div className="mb-3">
                                            <label htmlFor="exampleInputtext1" className="form-label text-white">Name</label>
                                            <input
                                                value={values.username}
                                                onChange={handleChange}
                                                type="text"
                                                name="username"
                                                className={`form-control ${(errors.username && touched.username) ? 'is-invalid' : ''}`}
                                                id="exampleInputtext1"
                                                aria-describedby="textHelp"
                                                required />
                                            <div className="invalid-feedback">
                                                {errors.username}
                                            </div>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="exampleInputEmail1" className="form-label text-white">Email Address</label>
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
                                        <div className="mb-3">
                                            <label htmlFor="exampleInputPassword1" className="form-label text-white">Password</label>
                                            <input
                                                value={values.password}
                                                onChange={handleChange}
                                                type="password"
                                                name='password'
                                                className={`form-control ${(errors.password && touched.password) ? 'is-invalid' : ''}`}
                                                id="exampleInputPassword1"
                                                required />
                                            <div className="invalid-feedback">
                                                {errors.password}
                                            </div>
                                        </div>
                                        <div className="mb-5">
                                            <label htmlFor="exampleInputConfirmPassword1" className="form-label text-white">Confirm Password</label>
                                            <input
                                                value={values.confirmPassword}
                                                onChange={handleChange}
                                                name='confirmPassword'
                                                type="password"
                                                className={`form-control ${(errors.confirmPassword && touched.confirmPassword) ? 'is-invalid' : ''}`}
                                                id="exampleInputConfirmPassword1"
                                                required />
                                            <div className="invalid-feedback">
                                                {errors.confirmPassword}
                                            </div>
                                        </div>
                                        <button type='submit' disabled={loading} className="btn btn-warning w-100 py-8 fs-4 mb-4 rounded-2">Sign Up</button>
                                        <div className="d-flex align-items-center justify-content-center">
                                            <p className="fs-4 mb-0 fw-bold text-white-50">Already have an Account?</p>
                                            <NavLink className="text-warning fw-bold ms-2" to={'/login'}>Sign In</NavLink>
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
