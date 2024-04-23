import React from 'react';
import '../css/navbar.css';
import { Link } from 'react-router-dom';
const home = require('../icons/home.png');
const orderHistory = require('../icons/orderHistory.png');
const paymentHistory = require('../icons/paymentHistory.png')
const settings = require('../icons/settings.png')
const logout = require('../icons/logout.png')
const logo = require('../icons/logo.png')
const paymentReports = require('../icons/reports.png')
const refund = require('../icons/refund.png')




const navBar = () => {
  return (
    <div class="navBar fixed-top">
        <div className='logoContainer'><img src={logo} alt="Logo" class="logo"></img></div>
        
        <div class="navBarItems">
            <ul>
                <li><Link to="/"><div className='navItem '><img src={home} alt="Home" title='Home' /></div></Link></li>
                <li><div className='navItem'><img src={orderHistory} alt="Order History" title='Order History' /></div></li>
                <li><Link to="/payments"><div className='navItem'><img src={paymentHistory} alt="Payment History" title='Payment History' /></div></Link></li>
                <li><Link to="/paymentReports"><div className='navItem'><img src={paymentReports} alt="Payment Reports" title="Payment Reports"></img></div></Link></li>
                <li><Link to="/refunds"><div className='navItem'><img src={refund} alt="Refunds" title="Refunds"></img></div></Link></li>
            </ul>
            <ul>
                <li><div className='navItem'><img src={settings} alt="Payment History" title='Settings' /></div></li>
                <li><div className='navItem'><img src={logout} alt="logout" title='Logout' /></div></li>
            </ul>
        </div>
    </div>

  );
};

export default navBar;