import { useState } from 'react'
import './App.css'
import Main from './Pages/Main'
import { ToastContainer } from 'react-toastify'
import Login from './Pages/Login/Login'
import Register from './Pages/Register/Register'
import { Route, Routes } from 'react-router-dom'
import UserStack from './Pages/UserStack/UserStack'
import NotFound from './Pages/NotFound/NotFound'
import NotAuthorized from './Pages/NotAuthorized/NotAuthorized'
import EmpProfile from './Pages/UserStack/EmpProfile/EmpProfile'
import Home from './Pages/UserStack/Home/Home'
import ForgotPassword from './Pages/ForgotPassword/ForgotPassword'
import ChangePassword from './Pages/ForgotPassword/ChangePassword'
import ResetByEmail from './Pages/ForgotPassword/ResetByEmail'

function App() {
  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/forgotPassword' element={<ForgotPassword />} />
        <Route path='/changePassword' element={<ChangePassword />} />
        <Route path='/resetPassword' element={<ResetByEmail />} />
        <Route path='/main' element={<Main />} >
          <Route index element={ <UserStack />} />
          <Route path='user' element={<UserStack />} >
            <Route index element={<Home/>}/>
            <Route path='home' element={<Home/>}/>
            <Route path='empEdit' element={<EmpProfile/>}/>
          </Route>
        </Route>
        <Route path='/notallowed' element={<NotAuthorized />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App
