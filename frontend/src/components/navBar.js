import React from 'react';
import '../css/navbar.css';
import { Link } from 'react-router-dom';
import { useAuth } from '../Services/Auth/AuthContext';
const home = require('../icons/home.png');
const jobHistory = require('../icons/history.png');
const delivery = require('../icons/delivery.png');
const drivers = require('../icons/driver.png');
const orderHistory = require('../icons/orderHistory.png');
const paymentHistory = require('../icons/paymentHistory.png')
const settings = require('../icons/settings.png')
const logout = require('../icons/logout.png')
const logo = require('../icons/logo.png')
const paymentReports = require('../icons/reports.png')
const refund = require('../icons/refund.png')

const NavBar = () => {
  const { userRole } = useAuth();
  return (
    <div>
      {(userRole === 'admin' || userRole === 'user' || userRole === 'driver') && 
    <div class="navBar fixed-top">
        <div className='logoContainer'><img src={logo} alt="Logo" class="logo"></img></div>
        
        <div class="navBarItems">
            <ul>
                {userRole !== 'admin' && <li><Link to="/order"><div className='navItem '><img src={home} alt="Home" title='Home' /></div></Link></li>}
                {userRole === 'user' && <li><Link to="/order-history"><div className='navItem'><img src={orderHistory} alt="Order History" title='Order History' /></div></Link></li>}
                {userRole === 'user' && <li><Link to="/payments"><div className='navItem'><img src={paymentHistory} alt="Payment History" title='Payment History' /></div></Link></li>}
                {userRole === 'admin' && <li><Link to="/refunds"><div className='navItem'><img src={refund} alt="Refunds" title="Refunds"></img></div></Link></li>}
                {userRole === 'admin' && <li><Link to="/admin-panel-order-history"><div className='navItem'><img src={orderHistory} alt="Order History" title='Order History' /></div></Link></li>}
                {userRole === 'admin' && <li><Link to="/paymentReports"><div className='navItem'><img src={paymentReports} alt="Payment Reports" title="Payment Reports"></img></div></Link></li>}
                {/* {userRole === 'admin' && <li><Link to="/job-summary"><div className='navItem'><img src={delivery} alt="Job Summary" title='Job Summary' /></div></Link></li>} */}
                {userRole === 'admin' && <li><Link to="/drivers"><div className='navItem'><img src={drivers} alt="Driver Perfomance" title='Driver Perfomance' /></div></Link></li>}
                {userRole === 'driver' && <li><Link to="/delivery"><div className='navItem'><img src={delivery} alt="Available Jobs" title='Available Jobs' /></div></Link></li>}
                {userRole === 'driver' && <li><Link to="/job-history"><div className='navItem'><img src={jobHistory} alt="Job History" title='Job History' /></div></Link></li>}
            </ul>
            <ul>
                <li><div className='navItem'><img src={settings} alt="Payment History" title='Settings' /></div></li>
                <li><div className='navItem'><img src={logout} alt="logout" title='Logout' /></div></li>
            </ul>
        </div>
    </div>
}
    </div>
  );
};

export default NavBar;