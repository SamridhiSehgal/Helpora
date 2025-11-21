import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Check for existing token on initial load
  useEffect(() => {
    const token = localStorage.getItem('helpora_jwt_token');
    if (token) {
      // In a real app, this should be verified with a /me endpoint call
      setIsAuthenticated(true);
      setUser({ id: 'ngo_user_mock', name: 'NGO Admin' }); 
    }
  }, []);

  const login = async (email, password) => {
    try {
      // Corrected Backend Path: /ngo/login
      const response = await axiosInstance.post('/ngo/login', { email, password });
      const { token, ngo } = response.data;
      
      localStorage.setItem('helpora_jwt_token', token);
      setUser(ngo); // Store user data
      setIsAuthenticated(true);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login Failed:', error.response?.data?.message || error.message);
      throw new Error(error.response?.data?.message || 'Login failed due to network error.');
    }
  };

  const register = async (ngoData) => {
    try {
      // Corrected Backend Path: /ngo/register
      const response = await axiosInstance.post('/ngo/register', ngoData);
      // For registration, we redirect to login to force token exchange
      navigate('/login');
      return response.data;
    } catch (error) {
      console.error('Registration Failed:', error.response?.data?.message || error.message);
      throw new Error(error.response?.data?.message || 'Registration failed.');
    }
  };

  const logout = () => {
    localStorage.removeItem('helpora_jwt_token');
    setUser(null);
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);