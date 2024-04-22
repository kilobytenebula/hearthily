import { useFormik } from 'formik'
import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import AuthService from '../../Services/Auth/AuthService'
import Toaster from '../../Utils/Constants/Toaster'
import AuthYup from '../../Validation/Auth/AuthYup'

export default function ResetByEmail() {
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const initValues = {
        email: ''
    }
    const { values, handleChange, handleSubmit, errors, touched } = useFormik({
        initialValues: initValues,
        validationSchema: AuthYup.resetByEmailPassword,
        onSubmit: async (values) => {
            setLoading(true)
            Toaster.loadingToast("Validating Email .......")
            try {
                const result = await AuthService.resetPassword(values)
                console.log(result.data.code)
                if (result.data.code === 200) {
                    Toaster.justToast('success', result.data.data.message, () => {
                        navigate('/changePassword')
                    })
                }
            } catch (error) {
                console.log(error)
                if (error.response.data.code === 404) {
                    Toaster.justToast('error',error.response.data.data.message , () => {
                    })
                }
                if (error.response.data.code === 500) {
                    Toaster.justToast('error', error.response.data.data.message, () => {
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
            <div className="position-relative overflow-hidden min-vh-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: '#1F1D2B' }}>
                <div className="d-flex align-items-center justify-content-center w-100">
                    <div className="row justify-content-center w-100">
                        <div className="col-md-8 col-lg-6 col-xxl-3">
                            <div className="card mb-0 shadow-lg" style={{ backgroundColor: '#1F1D2B' }}>
                                <div className="card-body">
                                    <NavLink to={'/login'} className="text-nowrap logo-img text-center d-block py-3 pb-5 w-100">
                                        {/* <img src={logo} width={180} alt="loogo" className='rounded'/> */}
                                        <h1 className='m-0 fw-bolder text-white'>Reset Password</h1>
                                    </NavLink>
                                    <form className='needs-validation' noValidate onSubmit={handleSubmit}>
                                        <div className="mb-2">
                                            <label htmlFor="exampleInputemail" className="form-label text-white">Email</label>
                                            <input
                                                value={values.email}
                                                onChange={handleChange}
                                                name='email'
                                                type="email"
                                                className={`form-control ${(errors.email && touched.email) ? 'is-invalid' : ''}`}
                                                id="exampleInputemail"
                                                required />
                                            <div className="invalid-feedback">
                                                {errors.email}
                                            </div>
                                        </div>
                                        <button type='submit' disabled={loading} className="btn btn-warning w-100 py-8 fs-4 mb-4 rounded-2">Reset Password</button>
                                        <div className="d-flex align-items-center justify-content-center">
                                            <p className="fs-4 mb-0 fw-bold text-white-50">Sign In?</p>
                                            <NavLink to={'/login'} className="text-warning fw-bold ms-2">Go Back</NavLink>
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
