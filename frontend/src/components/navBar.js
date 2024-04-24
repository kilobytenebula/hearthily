import React from 'react';
import '../css/navbar.css';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../Services/Auth/AuthContext';
import Authenticate from '../Store/Authenticate'
import Toaster from '../Utils/Constants/Toaster';
const home = require('../icons/home.png');
const jobHistory = require('../icons/history.png');
const delivery = require('../icons/delivery.png');
const drivers = require('../icons/driver.png');
const orderHistory = require('../icons/orderHistory.png');
const paymentHistory = require('../icons/paymentHistory.png');
const settings = require('../icons/settings.png');
const logout = require('../icons/logout.png');
const logo = require('../icons/logo.png');
const paymentReports = require('../icons/reports.png');
const refund = require('../icons/refund.png');
const airplane = require('../icons/airplane-land.png');
const box = require('../icons/box.png');
const mail = require('../icons/mail-add.png');
const ship = require('../icons/ship.png');

const NavBar = () => {
  const { userRole } = useAuth();
  const Navigate = useNavigate();
  return (
    <div>
      {(userRole !== null) && 
    <div class="navBar fixed-top">
        <div className='logoContainer'><img src={logo} alt="Logo" class="logo"></img></div>
        
        <div class="navBarItems">
            <ul>
                {userRole === 'user' && <li><Link to="/order"><div className='navItem '><img src={home} alt="Home" title='Home' /></div></Link></li>}
                {userRole === 'user' && <li><Link to="/order-history"><div className='navItem'><img src={orderHistory} alt="Order History" title='Order History' /></div></Link></li>}
                {userRole === 'user' && <li><Link to="/payments"><div className='navItem'><img src={paymentHistory} alt="Payment History" title='Payment History' /></div></Link></li>}
                {userRole === 'admin' && <li><Link to="/refunds"><div className='navItem'><img src={refund} alt="Refunds" title="Refunds"></img></div></Link></li>}
                {userRole === 'admin' && <li><Link to="/admin-panel-order-history"><div className='navItem'><img src={orderHistory} alt="Order History" title='Order History' /></div></Link></li>}
                {userRole === 'admin' && <li><Link to="/paymentReports"><div className='navItem'><img src={paymentReports} alt="Payment Reports" title="Payment Reports"></img></div></Link></li>}
                {/* {userRole === 'admin' && <li><Link to="/job-summary"><div className='navItem'><img src={delivery} alt="Job Summary" title='Job Summary' /></div></Link></li>} */}
                {userRole === 'admin' && <li><Link to="/drivers"><div className='navItem'><img src={drivers} alt="Driver Perfomance" title='Driver Perfomance' /></div></Link></li>}
                {userRole === 'driver' && <li><Link to="/delivery"><div className='navItem'><img src={delivery} alt="Available Jobs" title='Available Jobs' /></div></Link></li>}
                {userRole === 'driver' && <li><Link to="/job-history"><div className='navItem'><img src={jobHistory} alt="Job History" title='Job History' /></div></Link></li>}
                {userRole === 'inventory' && <li><Link to="/display"><div className='navItem'><img src={box} alt="Suppliers" title='Suppliers' /></div></Link></li>}
                {userRole === 'inventory' && <li><Link to="/displays"><div className='navItem'><img src={airplane} alt="Shipments" title='Shipments' /></div></Link></li>}
                {userRole === 'inventory' && <li><Link to="/invite"><div className='navItem'><img src={mail} alt="Invitations" title='Invitations' /></div></Link></li>}
                {userRole === 'inventory' && <li><Link to="/shipment"><div className='navItem'><img src={ship} alt="Make a Shipment" title='Make a Shipment' /></div></Link></li>}
                {}
            </ul>
            <ul>
                <li><Link to="/main/user/empEdit"><div className='navItem'><img src={settings} alt="Payment History" title='Settings' /></div></Link></li>
                <li><div className='navItem' onClick={() => {
                  Toaster.justToast('info', 'Logging out', () => {
                    Authenticate.logoutUser();
                    Navigate('/login');
                  })
                }}><img src={logout} alt="logout" title='Logout' style={{cursor: 'pointer'}} /></div></li>
            </ul>
        </div>
    </div>
      }
    </div>
  );
};

export default NavBar;