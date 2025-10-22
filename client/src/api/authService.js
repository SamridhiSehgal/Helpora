
import axios from 'axios';

const API_URL = 'http://localhost:4000'; // Backend server URL

// Service for Victim Login
const loginVictim = async (email, password) => {
    const response = await axios.post(`${API_URL}/api/victim/login`, {
        email,
        password,
    });
    if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
};

// Service for NGO Login
const loginNgo = async (email, password) => {
    const response = await axios.post(`${API_URL}/api/ngo/login`, {
        email,
        password,
    });
    if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
};

// Service for Victim Registration
const registerVictim = async (userData) => {
    const response = await axios.post(`${API_URL}/api/victim/register`, userData);
    if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
};

// Service for NGO Registration
const registerNgo = async (userData) => {
    const response = await axios.post(`${API_URL}/api/ngo/register`, userData);
    if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
};

// Logout service
const logout = () => {
    localStorage.removeItem('user');
};

// Get current user
const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem('user'));
};

const authService = {
    loginVictim,
    loginNgo,
    registerVictim,
    registerNgo,
    logout,
    getCurrentUser,
};

export default authService;

