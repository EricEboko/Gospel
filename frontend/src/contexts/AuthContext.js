import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('gospelspot_token');
        if (token) {
          const userData = await authAPI.getCurrentUser();
          setUser(userData);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('gospelspot_token');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      setUser(response.user);
      setIsAuthenticated(true);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    authAPI.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const verifyEmail = async (token) => {
    try {
      const response = await authAPI.verifyEmail(token);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const resendVerification = async (email) => {
    try {
      const response = await authAPI.resendVerification(email);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const updateUser = async (updateData) => {
    try {
      const updatedUser = await authAPI.getCurrentUser();
      setUser(updatedUser);
      return updatedUser;
    } catch (error) {
      throw error;
    }
  };

  const hasRole = (requiredRoles) => {
    if (!user) return false;
    const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
    return roles.includes(user.role);
  };

  const isSuperAdmin = () => hasRole(['super_admin']);
  const isLabelManager = () => hasRole(['label_manager']);
  const isArtist = () => hasRole(['artist']);
  const isUser = () => hasRole(['user']);

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    verifyEmail,
    resendVerification,
    updateUser,
    hasRole,
    isSuperAdmin,
    isLabelManager,
    isArtist,
    isUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};