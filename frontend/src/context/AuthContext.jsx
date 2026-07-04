import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    token: null,
    userId: null,
    name: null,
    email: null,
    role: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const name = localStorage.getItem('name');
    const email = localStorage.getItem('email');
    const role = localStorage.getItem('role');

    if (token) {
      setAuthState({ token, userId, name, email, role });
    }
    setLoading(false);
  }, []);

  const login = (data) => {
    // data: { token, userId, name, email, role }
    localStorage.setItem('token', data.token);
    localStorage.setItem('userId', data.userId);
    localStorage.setItem('name', data.name);
    localStorage.setItem('email', data.email);
    localStorage.setItem('role', data.role);

    setAuthState({
      token: data.token,
      userId: data.userId,
      name: data.name,
      email: data.email,
      role: data.role,
    });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('name');
    localStorage.removeItem('email');
    localStorage.removeItem('role');

    setAuthState({
      token: null,
      userId: null,
      name: null,
      email: null,
      role: null,
    });
  };

  const isAuthenticated = !!authState.token;

  return (
    <AuthContext.Provider value={{ ...authState, login, logout, isAuthenticated, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
