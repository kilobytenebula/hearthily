import React from 'react'
import Header from '../usercomponents/Header/Header'
import Sidebar from '../usercomponents/SideBar/Sidebar'
import LocalStore from '../Store/LocalStore'
import { Navigate, Outlet, useNavigate } from 'react-router-dom'
import NavBAr from '../components/navBar';

export default function Main() {
    const isAuthenticated = () => {
        const tokenData = LocalStore.getToken()
        return tokenData && tokenData.token
    }
    if (!isAuthenticated()) return <Navigate to={'/login'} />
    return (
        <>
            <NavBAr />

            <Outlet />
        </>
    )
}
