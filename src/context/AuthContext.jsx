import React, { createContext, useEffect, useState } from 'react';
import agent from '../agent.js';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("medremind_token");
    const savedUser = localStorage.getItem("medremind_user");
    if (token && savedUser) {
      setUser({ ...JSON.parse(savedUser), isAuthenticated: true });
    }
  }, []);

  const login = async ({ email, password }) => {
    if (!email || !password) {
      setAuthError('Please enter email and password.');
      return false;
    }
    
    try {
      const data = await agent.Auth.login(email, password);
      
      const mappedUser = { 
        ...data.user, 
        fullName: data.user.full_name || data.user.fullName, 
        isAuthenticated: true 
      };

      localStorage.setItem("medremind_token", data.token);
      localStorage.setItem("medremind_user", JSON.stringify(mappedUser));
      
      setUser(mappedUser);
      setAuthError(null);
      return true;
    } catch (error) {
      setAuthError(error.message || 'Login failed. Please check your details.');
      return false;
    }
  };

  const signup = async ({ fullName, email, password, confirmPassword }) => {
    if (!fullName || !email || !password || !confirmPassword) {
      setAuthError('All fields are required.');
      return false;
    }
    if (password !== confirmPassword) {
      setAuthError('Passwords do not match.');
      return false;
    }

    try {
      const userData = { 
        email, 
        password, 
        full_name: fullName, 
        age_group: "Adult", 
        gender: "OTHER"     
      };
      
      const data = await agent.Auth.register(userData);
      
      const mappedUser = { 
        ...data.user, 
        fullName: data.user.full_name || data.user.fullName, 
        isAuthenticated: true 
      };

      localStorage.setItem("medremind_token", data.token);
      localStorage.setItem("medremind_user", JSON.stringify(mappedUser));
      
      setUser(mappedUser);
      setAuthError(null);
      return true;
    } catch (error) {
      setAuthError(error.message || 'Registration failed.');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("medremind_token");
    localStorage.removeItem("medremind_user");
    setUser(null);
    setAuthError(null);
  };

  const forgotPassword = (email) => {
    setAuthError('Password reset is not configured on the server yet.');
    return false;
  };

  return (
    <AuthContext.Provider value={{ user, authError, login, signup, logout, forgotPassword }}>
      {children}
    </AuthContext.Provider>
  );
}