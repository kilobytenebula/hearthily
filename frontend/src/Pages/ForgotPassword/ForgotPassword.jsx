import { useFormik } from 'formik'
import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import AuthYup from '../../Validation/Auth/AuthYup'
import AuthService from '../../Services/Auth/AuthService'
import Toaster from '../../Utils/Constants/Toaster'
import bg from "../../images/backgrounds/bglogs.jpeg"

export default function ForgotPassword() {
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const initValues = {
        nic: '',
        password: '',
        confirmPassword: '',
    }
    const { values, handleChange, handleSubmit, errors, touched } = useFormik({
        initialValues: initValues,
        validationSchema: AuthYup.forgotPassword,
        onSubmit: async (values) => {
            setLoading(true)
            Toaster.loadingToast("Validating Nic .......")
            try {
                const result = await AuthService.forgotPassword(values)
                console.log(result.data.code)
                if (result.data.code === 200) {
                    Toaster.justToast('success', 'password reset success', () => {
                        navigate('/login')
                    })
                }
            } catch (error) {
                if (error.response.data.code === 404) {
                    Toaster.justToast('error', 'not found nic', () => {
                    })
                }
                if (error.response.data.code === 500) {
                    Toaster.justToast('error', 'server error', () => {
                    })
                }
                console.error(error.response.data.code)
            } finally {
                setLoading(false)
                Toaster.dismissLoadingToast()
            }
        }
    })

    return (
        <>
            <div className="position-relative overflow-hidden bg-white min-vh-100 d-flex align-items-center justify-content-center" style={{ backgroundImage: `url(${bg})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}>
                <div className="d-flex align-items-center justify-content-center w-100">
                    <div className="row justify-content-center w-100">
                        <div className="col-md-8 col-lg-6 col-xxl-3">
                            <div className="card mb-0 shadow-sm border">
                                <div className="card-body">
                                    <NavLink to={'/login'} className="text-nowrap logo-img text-center d-block py-3 pb-5 w-100">
                                        {/* <img src={logo} width={180} alt="loogo" className='rounded'/> */}
                                        <h1 className='m-0 fw-bolder'>Reset Password</h1>
                                    </NavLink>
                                    <form className='needs-validation' noValidate onSubmit={handleSubmit}>
                                        <div className="mb-3">
                                            <label htmlFor="exampleInputEmail1" className="form-label">Nic</label>
                                            <input
                                                value={values.nic}
                                                onChange={handleChange}
                                                type="text"
                                                name='nic'
                                                className={`form-control ${(errors.nic && touched.nic) ? 'is-invalid' : ''}`}
                                                id="exampleInputEmail1"
                                                aria-describedby="emailHelp"
                                                required />
                                            <div className="invalid-feedback">
                                                {errors.nic}
                                            </div>
                                        </div>
                                        <div className="mb-2">
                                            <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
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
                                        <div className="mb-5">
                                            <label htmlFor="exampleInputConfirmPassword1" className="form-label">Confirm Password</label>
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
                                        <button type='submit' disabled={loading} className="btn btn-primary w-100 py-8 fs-4 mb-4 rounded-2">Reset Password</button>
                                        <div className="d-flex align-items-center justify-content-center">
                                            <p className="fs-4 mb-0 fw-bold">Sign In?</p>
                                            <NavLink to={'/login'} className="text-primary fw-bold ms-2">Go Back</NavLink>
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
