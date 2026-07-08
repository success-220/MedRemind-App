import React, { createContext, useEffect, useState } from 'react';
import { loadData, saveData } from '../utils/storage.js';

export const AuthContext = createContext();

const AUTH_KEY = 'medremind-auth';
const USERS_KEY = 'medremind-users';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadData(AUTH_KEY, null));
  const [users, setUsers] = useState(loadData(USERS_KEY, []));
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    saveData(AUTH_KEY, user);
  }, [user]);

  useEffect(() => {
    saveData(USERS_KEY, users);
  }, [users]);

  const login = ({ email, password }) => {
    if (!email || !password) {
      setAuthError('Please enter email and password.');
      return false;
    }

    const match = users.find((item) => item.email.toLowerCase() === email.toLowerCase() && item.password === password);
    if (match) {
      setAuthError(null);
      setUser({ ...match, isAuthenticated: true });
      return true;
    }

    setAuthError('Login failed. Please check your details.');
    return false;
  };

  const signup = ({ fullName, email, password, confirmPassword }) => {
    if (!fullName || !email || !password || !confirmPassword) {
      setAuthError('All fields are required.');
      return false;
    }

    if (password !== confirmPassword) {
      setAuthError('Passwords do not match.');
      return false;
    }

    const existing = users.some((item) => item.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      setAuthError('This email is already registered.');
      return false;
    }

    const newUser = {
      fullName,
      email,
      password,
      isAuthenticated: true,
    };

    setUsers((current) => [...current, newUser]);
    setAuthError(null);
    setUser(newUser);
    return true;
  };

  const logout = () => {
    setUser(null);
    setAuthError(null);
  };

  const forgotPassword = (email) => {
    if (!email) {
      setAuthError('Please provide a valid email.');
      return false;
    }
    setAuthError('If this email is registered, reset instructions will be sent.');
    return true;
  };

  return (
    <AuthContext.Provider value={{ user, authError, login, signup, logout, forgotPassword }}>
      {children}
    </AuthContext.Provider>
  );
}
