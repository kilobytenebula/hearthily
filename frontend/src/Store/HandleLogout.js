import React from 'react';
import { useAuth } from '../Services/Auth/AuthContext';
const logoutIcon = require('../icons/logout.png');

const LogoutButton = ({ Toaster, Navigate }) => {
  const { logout } = useAuth();

  const handleLogout = () => {
    Toaster.justToast('info', 'Logging out', () => {
      logout(); // Call the logout function from useAuth hook
      Navigate('/login'); // Navigate to the login page after logout
    });
  };

  return (
    <div className='navItem' onClick={handleLogout}>
      <img src={logoutIcon} alt="logout" title='Logout' style={{cursor: 'pointer'}} />
    </div>
  );
};

export default LogoutButton;
