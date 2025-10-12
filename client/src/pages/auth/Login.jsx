import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import './Login.css'; // Assuming a separate CSS file for styling

const Login = () => {
    // const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    
    // State to manage the visual selection of the login role (doesn't affect API call)
    const [loginType, setLoginType] = useState('victim'); // Default to victim for visual start
    
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);

    // Backend API URL
    const API_URL = 'http://localhost:8080/api/auth/login';

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setMessage('');
    };

    // Handler for the visual toggle change
    const handleLoginTypeChange = (e) => {
        setLoginType(e.target.value);
        setMessage('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setIsError(false);

        if (!formData.email || !formData.password) {
            setMessage("Please enter both email and password.");
            setIsError(true);
            return;
        }

        try {
            // API Call to the Backend Login Endpoint
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            
            const data = await response.json();

            if (response.ok && data.token) {
                // SUCCESS
                setMessage('Login successful! Redirecting...');
                setIsError(false);
                
                // 1. Store the JWT token
                localStorage.setItem('token', data.token);
                
                // 2. Store user role (important for rendering dashboards)
                localStorage.setItem('userRole', data.user.role);

                // 3. Redirect based on role
                setTimeout(() => { 
                    // This alert should be replaced by navigate(`/${data.user.role}/dashboard`);
                    alert(`Login SUCCESS! Redirecting to ${data.user.role} dashboard.`);
                }, 1000);

            } else {
                // ERROR (e.g., Invalid Credentials)
                setMessage(data.msg || 'Login failed. Please check your credentials.');
                setIsError(true);
            }
        } catch (error) {
            setMessage('Network error. Could not connect to the server.');
            setIsError(true);
            console.error('Login Error:', error);
        }
    };

    return (
        <div className="register-container"> {/* Reused class from Register.css */}
            <div className="register-card"> {/* Reused class from Register.css */}
                <h2>Helpora Login</h2>

                {/* Message Alert */}
                {message && (
                    <div className={`alert ${isError ? 'alert-error' : 'alert-success'}`}>
                        {message}
                    </div>
                )}
                
                {/* User Type Toggle Switch - Added for visual clarity */}
                <div className="user-type-toggle">
                    <label>Logging in as:</label>
                    <div className="toggle-options">
                        {/* Victim */}
                        <input type="radio" id="login-victim" name="loginType" value="victim"
                            checked={loginType === 'victim'} onChange={handleLoginTypeChange} hidden />
                        <label htmlFor="login-victim" className={`toggle-label ${loginType === 'victim' ? 'active-victim' : ''}`}>
                            Victim
                        </label>

                        {/* NGO */}
                        <input type="radio" id="login-ngo" name="loginType" value="ngo"
                            checked={loginType === 'ngo'} onChange={handleLoginTypeChange} hidden />
                        <label htmlFor="login-ngo" className={`toggle-label ${loginType === 'ngo' ? 'active-ngo' : ''}`}>
                            NGO / Provider
                        </label>
                    </div>
                </div>
                
                <form onSubmit={handleSubmit} className="register-form"> {/* Reused class from Register.css */}
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required placeholder="Enter your email" />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required placeholder="Enter your password" />
                    </div>

                    <button type="submit" className="submit-btn blue-btn">
                        Log In
                    </button>
                </form>

                <p className="register-link">
                    Don't have an account? 
                    <a href="/register"> Register Here</a>
                </p>
            </div>
        </div>
    );
};

export default Login;
