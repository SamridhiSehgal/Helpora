import React, { useState } from 'react';
// 1. IMPORT useNavigate from React Router
import { useNavigate } from 'react-router-dom';

const Login = () => {
    // 2. INITIALIZE useNavigate hook
    const navigate = useNavigate();
    
    // State for selected user type: 'victim' or 'ngo' (Default to victim)
    const [userType, setUserType] = useState('victim'); 

    // State for form data
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // --- SEPARATE BACKEND API LOGIN ENDPOINTS ---
    // NOTE: In a professional setup, you should use a single API path like /api/login and let the backend determine the role.
    const API_URLS = {
        victim: 'http://localhost:4000/victim/login', // Assuming this is the victim URL
        ngo: 'http://localhost:4000/ngo/login'        // Assuming this is the NGO URL
    };
    // ------------------------------------

    // Handler for general input changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setMessage(''); 
    };

    // Handler for the radio button/toggle change
    const handleUserTypeChange = (e) => {
        const newType = e.target.value;
        setUserType(newType);
        setMessage('');
    };

    // Client-side validation function
    const validateForm = () => {
        if (!formData.email || !formData.password) {
            return "Please enter both email and password.";
        }
        return null; // Null means valid
    };

    // Handler for form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setIsError(false);
        
        const validationError = validateForm();
        if (validationError) {
            setMessage(validationError);
            setIsError(true);
            return;
        }
        
        setIsLoading(true);

        // Payload only requires email and password
        const payload = {
            email: formData.email,
            password: formData.password,
        };
        
        // Select the correct URL based on userType
        const finalUrl = API_URLS[userType];

        try {
            // 1. API Call to the specific Backend Login Endpoint
            const response = await fetch(finalUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            
            const data = await response.json();

            if (response.ok) {
                // SUCCESS - Token is expected in the response body
                
                // IMPORTANT: Extract and store the JWT/token
                const token = data.accessToken || data.token; 
                if (token) {
                    // 2. Store the token for subsequent authorized API calls
                    localStorage.setItem('helporaToken', token);
                    
                    // 3. Store user data (optional but useful)
                    // We specifically store the role determined by the toggle/URL
                    localStorage.setItem('userRole', userType);
                    localStorage.setItem('userName', data.name || 'User'); // Assuming name is returned

                    setMessage(`Login successful as ${userType}! Redirecting...`);
                    setIsError(false);
                    
                    // 4. >>>>>> CRITICAL: CONDITIONAL REDIRECT LOGIC <<<<<<
                    if (userType === 'victim') {
                        navigate('/victim/dashboard'); // Redirect to /victim/dashboard
                    } else if (userType === 'ngo') {
                        navigate('/ngo/dashboard'); // Redirect to /ngo/dashboard
                    }
                    
                } else {
                    setMessage('Login succeeded, but no token was received from the server.');
                    setIsError(true);
                }

            } else {
                // ERROR (401 Unauthorized, 400 Bad Request)
                setMessage(data.msg || data.message || 'Invalid credentials or server error.');
                setIsError(true);
            }
        } catch (error) {
            setMessage('Network error. Could not connect to the server.');
            setIsError(true);
            console.error('Login Error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Component logic ends, JSX/Rendering starts
    return (
        <div className="register-container">
            <style>
                {/* CSS STYLES ARE LEFT UNCHANGED FOR AESTHETICS AND RESPONSIVENESS */}
                {`
                .register-container {
                    /* Use viewport units for minimum height to fill the screen */
                    min-height: 100vh; 
                    display: flex;
                    justify-content: center;
                    align-items: center; 
                    background-color: #f4f7f6;
                    
                    padding: 20px 10px; 
                    box-sizing: border-box; 
                    font-family: 'Inter', sans-serif;
                    transition: padding 0.3s ease-out, min-height 0.3s ease-out; 
                }

                .register-card {
                    background-color: #ffffff;
                    padding: 2rem; 
                    border-radius: 12px;
                    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
                    width: 100%;
                    max-width: 450px; 
                    text-align: center;
                    margin: auto; 
                }

                .register-card h2 {
                    color: #1f2937;
                    margin-bottom: 1.5rem;
                    font-size: 2rem;
                    font-weight: 800;
                }

                /* -------------------------------------- */
                /* User Type Toggle Styling */
                /* -------------------------------------- */
                .user-type-toggle {
                    margin-bottom: 1.5rem;
                    text-align: left;
                }

                .user-type-toggle label:first-child {
                    display: block;
                    margin-bottom: 0.5rem;
                    font-weight: 600;
                    color: #4b5563;
                }

                .toggle-options {
                    display: flex;
                    background-color: #e5e7eb;
                    border-radius: 8px;
                    overflow: hidden;
                    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
                }

                .toggle-options input[type="radio"] {
                    display: none;
                }

                .toggle-label {
                    flex-grow: 1; 
                    text-align: center;
                    padding: 0.8rem 1rem;
                    cursor: pointer;
                    color: #4b5563;
                    font-weight: 600;
                    transition: all 0.3s ease;
                    font-size: 0.95rem;
                }

                /* Active state styles */
                .toggle-label.active-victim {
                    background-color: #3b82f6; /* Blue for Victim */
                    color: white;
                    box-shadow: 0 2px 5px rgba(59, 130, 246, 0.4);
                }

                .toggle-label.active-ngo {
                    background-color: #10b981; /* Green for NGO */
                    color: white;
                    box-shadow: 0 2px 5px rgba(16, 185, 129, 0.4);
                }
                
                /* -------------------------------------- */
                /* Form and Input Styling */
                /* -------------------------------------- */
                .register-form {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                .form-group {
                    text-align: left;
                }

                .form-group label {
                    display: block;
                    margin-bottom: 0.4rem;
                    font-size: 0.9rem;
                    color: #374151;
                    font-weight: 500;
                }

                .form-group input {
                    width: 100%;
                    padding: 0.75rem;
                    border: 1px solid #d1d5db;
                    border-radius: 8px;
                    box-sizing: border-box; 
                    font-size: 1rem;
                    transition: border-color 0.3s, box-shadow 0.3s;
                }

                .form-group input:focus {
                    border-color: #3b82f6;
                    outline: none;
                    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
                }

                /* -------------------------------------- */
                /* Alert Styles */
                /* -------------------------------------- */
                .alert {
                    padding: 1rem;
                    margin-bottom: 1rem;
                    border-radius: 8px;
                    font-weight: 500;
                    text-align: center;
                }

                .alert-error {
                    background-color: #fee2e2;
                    color: #ef4444;
                    border: 1px solid #fca5a5;
                }

                .alert-success {
                    background-color: #d1fae5;
                    color: #059669;
                    border: 1px solid #6ee7b7;
                }

                /* -------------------------------------- */
                /* Button Styles */
                /* -------------------------------------- */
                .submit-btn {
                    padding: 0.8rem 1rem;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 1.1rem;
                    font-weight: 700;
                    color: white;
                    transition: all 0.3s ease;
                    margin-top: 0.5rem;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    width: 100%; /* Ensure button is full width */
                    background-color: #3b82f6; /* Blue for Login/Default */
                }

                .submit-btn:hover:not(:disabled) {
                    background-color: #2563eb;
                    box-shadow: 0 6px 8px rgba(59, 130, 246, 0.3);
                }

                .submit-btn:disabled {
                    background-color: #a3a3a3; /* Grayed out when loading */
                    cursor: not-allowed;
                }

                .signup-link, .register-link {
                    margin-top: 1.5rem;
                    font-size: 0.9rem;
                    color: #6b7280;
                }

                .signup-link a, .register-link a {
                    color: #3b82f6;
                    font-weight: 600;
                    text-decoration: none;
                }

                .signup-link a:hover, .register-link a:hover {
                    text-decoration: underline;
                }

                /* -------------------------------------- */
                /* Mobile/Small Screens Responsiveness */
                /* -------------------------------------- */
                @media (max-width: 600px) {
                    .register-container {
                        min-height: auto;
                        align-items: flex-start; 
                        padding-top: 20px; 
                        padding-bottom: 20px; 
                        padding-left: 10px; 
                        padding-right: 10px;
                    }
                    
                    .register-card {
                        padding: 1.5rem;
                        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                    }
                }
                
                /* KEYFRAME definition for spinner is needed */
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                
                `}
            </style>
            
            <div className="register-card">
                <h2>Helpora Login</h2>
                
                {/* Message Alert */}
                {message && (
                    <div className={`alert ${isError ? 'alert-error' : 'alert-success'}`}>
                        {message}
                    </div>
                )}
                
                {/* User Type Toggle Switch */}
                <div className="user-type-toggle">
                    <label>Log in as:</label>
                    <div className="toggle-options">
                        {/* Victim */}
                        <input type="radio" id="login-victim" name="userType" value="victim"
                            checked={userType === 'victim'} onChange={handleUserTypeChange} hidden />
                        <label htmlFor="login-victim" className={`toggle-label ${userType === 'victim' ? 'active-victim' : ''}`}>
                            Victim / Individual
                        </label>

                        {/* NGO */}
                        <input type="radio" id="login-ngo" name="userType" value="ngo"
                            checked={userType === 'ngo'} onChange={handleUserTypeChange} hidden />
                        <label htmlFor="login-ngo" className={`toggle-label ${userType === 'ngo' ? 'active-ngo' : ''}`}>
                            NGO / Provider
                        </label>
                    </div>
                </div>
                
                <form onSubmit={handleSubmit} className="register-form">
                    
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required placeholder="Enter your email" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required placeholder="Enter your password" />
                    </div>

                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className={`submit-btn ${userType === 'victim' ? 'blue-btn' : 'green-btn'}`}
                    >
                        {isLoading ? (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {/* Spinner remains in SVG for modern animation */}
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" style={{ animation: 'spin 1s linear infinite' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Logging in...
                            </div>
                        ) : (
                            `Log In as ${userType === 'victim' ? 'Victim' : 'NGO'}`
                        )}
                    </button>
                </form>
                    

                <p className="signup-link">
                    Don't have an account? 
                    <a href="/register"> 
                        Register Here
                    </a>
                </p>
            </div>
        </div>
    );
};

export default Login;
