import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Retrieve user role and userId from Local Storage on component mount
    const storedRole = localStorage.getItem('userRole');
    const storedId = localStorage.getItem('userId');
    if (storedRole && storedId) {
      setUserRole(storedRole);
      setUserId(storedId);
    }
  }, []);

  const login = (role, id) => {
    setUserRole(role);
    setUserId(id);
    localStorage.setItem('userRole', role); // Save user role to Local Storage
    localStorage.setItem('userId', id); // Save userId to Local Storage
  };

  const logout = () => {
    setUserRole(null);
    setUserId(null);
    localStorage.removeItem('userRole'); // Remove user role from Local Storage
    localStorage.removeItem('userId'); // Remove userId from Local Storage
  };

  return (
    <AuthContext.Provider value={{ userRole, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);