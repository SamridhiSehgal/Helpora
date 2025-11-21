import axios from 'axios';

// IMPORTANT: Updated the port to 4000 and removed the /api/v1 path
const API_BASE_URL = 'http://localhost:4000'; 

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach the JWT token from localStorage to every authenticated request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('helpora_jwt_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor for handling 401 Unauthorized errors globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error("Authentication failed or expired. Redirecting to login.");
      // Note: The actual redirect/logout logic is handled by AuthContext if an API call fails there
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;