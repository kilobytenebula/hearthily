import React from 'react';
import '../navbar.css';
import '../root.css';
import { Link } from 'react-router-dom';
const home = require('../icons/home.png');
const orderHistory = require('../icons/orderHistory.png');
const paymentHistory = require('../icons/paymentHistory.png')
const settings = require('../icons/settings.png')
const logout = require('../icons/logout.png')
const logo = require('../icons/logo.png')


const Navbar = () => {
  return (
    <div className="navBar fixed-top">
        <div className='logoContainer'><img src={logo} alt="Logo" className="logo"></img></div>
        
        <div className="navBarItems">
            <ul>
                <li><div className='navItem '><img src={home} alt="Home"  /></div></li>
                <Link to="/order-history"><li><div className='navItem active'><img src={orderHistory} alt="Order History" title='Order History' /></div></li></Link> 
                <li><div className='navItem'><img src={paymentHistory} alt="Payment History" title='Payment History' /></div></li>
            </ul>
            <ul>
                <li><div className='navItem'><img src={settings} alt="Payment History" title='Settings' /></div></li>
                <li><div className='navItem'><img src={logout} alt="Payment History" title='Settings' /></div></li>
            </ul>
        </div>
    </div>

  );
};

export default Navbar;