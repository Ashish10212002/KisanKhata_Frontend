import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    // Check if user is already logged in (persistence)
    const storedName = localStorage.getItem('userName');
    if (token && storedName) {
      setUser({ name: storedName });
    }
  }, [token]);

  const login = (newToken, userName) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('userName', userName);
    setToken(newToken);
    setUser({ name: userName });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    setToken(null);
    setUser(null);
    // Redirect to Landing Page (Home) instead of Login
    window.location.href = '/'; 
  };
  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);