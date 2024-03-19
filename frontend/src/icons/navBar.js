import React from 'react';
import '../navBar.css';
const home = require('../icons/home.png');
const orderHistory = require('../icons/orderHistory.png');
const paymentHistory = require('../icons/paymentHistory.png')
const settings = require('../icons/settings.png')
const logout = require('../icons/logout.png')
const logo = require('../icons/logo.png')




const navBar = () => {
  return (
    <div class="navBar fixed-top">
        <div className='logoContainer'><img src={logo} alt="Logo" class="logo"></img></div>
        
        <div class="navBarItems">
            <ul>
                <li><div className='navItem '><img src={home} alt="Home"  /></div></li>
                <li><div className='navItem'><img src={orderHistory} alt="Order History" title='Order History' /></div></li>
                <li><div className='navItem active'><img src={paymentHistory} alt="Payment History" title='Payment History' /></div></li>
            </ul>
            <ul>
                <li><div className='navItem'><img src={settings} alt="Payment History" title='Settings' /></div></li>
                <li><div className='navItem'><img src={logout} alt="Payment History" title='Settings' /></div></li>
            </ul>
        </div>
    </div>

  );
};

export default navBar;