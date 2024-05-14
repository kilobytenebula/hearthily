// AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    // Retrieve user role from Local Storage on component mount
    const storedRole = localStorage.getItem('userRole');
    if (storedRole) {
      setUserRole(storedRole);
    }
  }, []);

  const login = (role) => {
    setUserRole(role);
    localStorage.setItem('userRole', role); // Save user role to Local Storage
  };

  const logout = () => {
    setUserRole(null);
    localStorage.removeItem('userRole'); // Remove user role from Local Storage
  };

  return (
    <AuthContext.Provider value={{ userRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);