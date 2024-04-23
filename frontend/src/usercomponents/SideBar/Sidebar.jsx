import React from 'react'
import { NavLink, Navigate, useLocation, useNavigate } from 'react-router-dom'
import Authenticate from '../../Store/Authenticate'
import Toaster from '../../Utils/Constants/Toaster'

export default function Sidebar() {
    const location = useLocation()
    const userHome = location.pathname === '/main/home'

    const navigate = useNavigate()

    if (userHome) return <Navigate to={'/main/user/home'} />

    return (
        <aside className="left-sidebar shadow-sm border-0">
            {/* Sidebar scroll*/}
            <div>
                <div className="brand-logo d-flex align-items-center justify-content-between">
                    <NavLink to={'/main'} className="text-nowrap logo-img">
                        {/* <img src={logo} className='rounded img-fluid' alt='logo' width={180} /> */}
                        <h1 className='text-white fw-bolder'>Hearthly</h1>
                    </NavLink>
                    <div className="close-btn d-xl-none d-block sidebartoggler cursor-pointer" id="sidebarCollapse">
                        <i className="ti ti-x fs-8" />
                    </div>
                </div>
                {/* Sidebar navigation*/}
                <nav className="sidebar-nav scroll-sidebar" data-simplebar>
                    <ul id="sidebarnav" className="h-100 my-0 overflow-hidden">
                        <li className="nav-small-cap">
                            <i className="ti ti-dots nav-small-cap-icon fs-4" />
                            <span className="hide-menu text-white">Home</span>
                        </li>
                        <li className="sidebar-item">
                            <NavLink to={'/main/user/home'} className="sidebar-link " aria-expanded="false" end={true}>
                                <span>
                                    <i className="ti ti-home text-white" />
                                </span>
                                <span className="hide-menu text-white">Home</span>
                            </NavLink>
                        </li>
                        <li className="nav-small-cap">
                            <i className="ti ti-dots nav-small-cap-icon fs-4" />
                            <span className="hide-menu text-white">AUTH</span>
                        </li>
                        <li className="sidebar-item">
                            <NavLink to={'/main/user/empEdit'} className="sidebar-link" aria-expanded="false">
                                <span>
                                    <i className="ti ti-user text-white" />
                                </span>
                                <span className="hide-menu text-white">User Profile</span>
                            </NavLink>
                        </li>
                        <li className="sidebar-item">
                            <button type='button' onClick={() => {
                                Toaster.justToast('info', "   Logging You Out ......", () => {
                                    Authenticate.logoutUser();
                                    navigate('/login')
                                })
                            }} className="sidebar-link bg-transparent border-0" aria-expanded="false">
                                <span>
                                    <i className="ti ti-login text-white" />
                                </span>
                                <span className="hide-menu text-white">Logout</span>
                            </button>
                        </li>
                    </ul>
                </nav>
                {/* End Sidebar navigation */}
            </div>
        </aside>

    )
}
