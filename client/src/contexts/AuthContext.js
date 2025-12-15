import React, { createContext, useState, useEffect, useContext } from 'react';
import { getCurrentUser, logout as logoutService } from '../services/authService';

// I'm creating a context to manage authentication state globally
// This eliminates prop drilling and centralizes auth logic

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // I'm tracking the current user, loading state, and initialization state
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  // I'm checking for an existing token on mount
  // This restores the user session if they refresh the page
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');

      if (token) {
        try {
          // I'm fetching the current user with the stored token
          const userData = await getCurrentUser();
          setUser(userData.user);
        } catch (error) {
          // I'm clearing invalid tokens
          console.error('Failed to restore session:', error);
          localStorage.removeItem('token');
        }
      }

      setLoading(false);
      setIsInitialized(true);
    };

    initializeAuth();
  }, []);

  // I'm providing a login function that stores the token and sets the user
  const login = (token, userData) => {
    localStorage.setItem('token', token);
    setUser(userData);
  };

  // I'm providing a logout function that clears the token and user
  const logout = async () => {
    try {
      // I'm calling the backend logout endpoint
      await logoutService();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // I'm always clearing local state, even if the API call fails
      localStorage.removeItem('token');
      setUser(null);
    }
  };

  // I'm providing an update function for after onboarding
  const updateUser = (userData) => {
    setUser(userData);
  };

  // I'm computing whether the user is authenticated
  const isAuthenticated = !!user;

  // I'm providing all auth state and methods to the app
  const value = {
    user,
    loading,
    isInitialized,
    isAuthenticated,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// I'm creating a custom hook for easy access to auth context
// This prevents the need to import useContext and AuthContext everywhere
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
