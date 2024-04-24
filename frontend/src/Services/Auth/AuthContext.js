// AuthContext.js
import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);

  const login = (role, userId) => {
    setUserRole(role);
    setUserId(userId);
  };

  const logout = () => {
    setUserRole(null);
    setUserId(null);
  };

  return (
    <AuthContext.Provider value={{ userRole, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
