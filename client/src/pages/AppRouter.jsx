import React, { useState, useEffect, useCallback } from 'react';

// --- CONSTANTS ---
const API_URL = 'http://localhost:8080/api/auth';
// Note: Frontend will construct full URL based on user type

// --- CSS STYLES (INCLUDED FOR SINGLE-FILE RUNNABILITY) ---
const CustomStyles = () => (
    <style>
        {`
        /* Global and Container Styling */
        .register-container {
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
            padding: 2.5rem; 
            border-radius: 12px;
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
            width: 100%;
            max-width: 450px; 
            text-align: center;
            margin: auto; 
        }
        
        .dashboard-card {
            max-width: 700px; /* Wider card for dashboard content */
        }

        .register-card h2 {
            color: #1f2937;
            margin-bottom: 1.5rem;
            font-size: 2rem;
            font-weight: 800;
        }

        /* User Type Toggle Styling (Reused for both Register and Login) */
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

        /* Form and Input Styling */
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

        /* Alert Styles */
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

        /* Button Styles */
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
        }
        
        .submit-btn.blue-bg {
            background-color: #3b82f6;
        }

        .submit-btn.green-bg {
            background-color: #10b981;
        }
        
        .logout-btn {
            background-color: #ef4444 !important; /* Red for logout */
            margin-top: 0.75rem;
        }
        .logout-btn:hover {
            background-color: #dc2626 !important;
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
            cursor: pointer;
        }

        .signup-link a:hover, .register-link a:hover {
            text-decoration: underline;
        }
        
        /* Dashboard Specific Styles */
        .profile-section {
            margin-top: 1.5rem;
            border-top: 1px solid #e5e7eb;
            padding-top: 1.5rem;
            text-align: left;
        }

        .data-box {
            background-color: #f9fafb;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 1rem;
            margin-top: 0.75rem;
            font-family: monospace;
            white-space: pre-wrap;
            overflow-x: auto;
            font-size: 0.9rem;
            color: #374151;
            min-height: 100px;
        }

        .action-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
            margin-top: 2rem;
        }
        
        .grid-btn {
            padding: 1.5rem 1rem;
            border: none;
            border-radius: 12px;
            cursor: pointer;
            font-size: 1rem;
            font-weight: 700;
            color: white;
            transition: all 0.3s ease;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
        }
        .grid-btn span {
            margin-bottom: 0.5rem;
        }

        .animate-spin {
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        `}
    </style>
);

// --- INTERNAL COMPONENT: REGISTER ---
const Register = ({ setPage }) => {
    const [userType, setUserType] = useState('victim');
    const [formData, setFormData] = useState({
        name: '', email: '', password: '', phone: '', address: '',
        city: '', state: '', zip: '', location: '', organizationName: '', ngoRegistrationId: ''
    });
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setMessage('');
    };

    const handleUserTypeChange = (e) => {
        setUserType(e.target.value);
        setMessage('');
    };

    const validateForm = () => {
        if (!formData.name || !formData.email || !formData.password || !formData.address || !formData.city || !formData.zip) {
            return "Please fill in all required fields.";
        }
        if (formData.password.length < 6) {
            return "Password must be at least 6 characters long.";
        }
        if (userType === 'ngo' && (!formData.organizationName || !formData.ngoRegistrationId)) {
            return "NGO registration requires Organization Name and Registration ID.";
        }
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setIsError(false);
        setIsLoading(true);

        const validationError = validateForm();
        if (validationError) {
            setMessage(validationError);
            setIsError(true);
            setIsLoading(false);
            return;
        }

        const endpoint = userType === 'victim' 
            ? `${API_URL}/victim/register` 
            : `${API_URL}/ngo/register`;

        const payload = {
            email: formData.email,
            password: formData.password,
            name: formData.name, 
            address: formData.address,
            city: formData.city,
            state: formData.state,
            zip: formData.zip,
            location: formData.location || '', // Optional
            ...(userType === 'victim' && { phone: formData.phone }),
            ...(userType === 'ngo' && { 
                ngoName: formData.organizationName,
                registrationNumber: formData.ngoRegistrationId
            })
        };

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            
            const data = await response.json();

            if (response.ok) {
                setMessage('Registration successful! Please log in.');
                setIsError(false);
                setTimeout(() => setPage('login'), 1500); // Redirect to login
            } else {
                setMessage(data.msg || data.error || 'Registration failed due to a server error.');
                setIsError(true);
            }
        } catch (error) {
            setMessage('Network error. Could not connect to the server. Check your backend is running.');
            setIsError(true);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="register-card">
            <h2>Helpora Register</h2>
            
            {message && (
                <div className={`alert ${isError ? 'alert-error' : 'alert-success'}`}>
                    {message}
                </div>
            )}
            
            <div className="user-type-toggle">
                <label>Register as:</label>
                <div className="toggle-options">
                    <input type="radio" id="victim" name="userType" value="victim"
                        checked={userType === 'victim'} onChange={handleUserTypeChange} hidden />
                    <label htmlFor="victim" className={`toggle-label ${userType === 'victim' ? 'active-victim' : ''}`}>
                        Victim
                    </label>
                    <input type="radio" id="ngo" name="userType" value="ngo"
                        checked={userType === 'ngo'} onChange={handleUserTypeChange} hidden />
                    <label htmlFor="ngo" className={`toggle-label ${userType === 'ngo' ? 'active-ngo' : ''}`}>
                        NGO / Provider
                    </label>
                </div>
            </div>
            
            <form onSubmit={handleSubmit} className="register-form">
                
                <div className="form-group">
                    <label htmlFor="name">{userType === 'ngo' ? 'Representative Name' : 'Full Name'}</label>
                    <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required placeholder="Enter your name" />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required placeholder="Enter your email" />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required minLength="6" placeholder="Create a password (min 6 characters)" />
                </div>
                <div className="form-group">
                    <label htmlFor="address">Address</label>
                    <input type="text" id="address" name="address" value={formData.address} onChange={handleChange} required placeholder="Enter your full address" />
                </div>
                <div className="form-group">
                    <label htmlFor="city">City</label>
                    <input type="text" id="city" name="city" value={formData.city} onChange={handleChange} required placeholder="Enter your city" />
                </div>
                <div className="form-group">
                    <label htmlFor="state">State</label>
                    <input type="text" id="state" name="state" value={formData.state} onChange={handleChange} placeholder="Enter your state (optional)" />
                </div>
                <div className="form-group">
                    <label htmlFor="zip">Zip Code</label>
                    <input type="text" id="zip" name="zip" value={formData.zip} onChange={handleChange} required placeholder="Enter your zip code" />
                </div>
                <div className="form-group">
                    <label htmlFor="location">Location (Coordinates)</label>
                    <input type="text" id="location" name="location" value={formData.location} onChange={handleChange} placeholder="e.g., 34.05,-118.24 (optional)" />
                </div>

                {userType === 'victim' ? (
                    <div className="form-group">
                        <label htmlFor="phone">Phone Number</label>
                        <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="e.g., +91-9876543210 (optional)" />
                    </div>
                ) : (
                    <>
                        <div className="form-group">
                            <label htmlFor="organizationName">Organization Name (Required)</label>
                            <input type="text" id="organizationName" name="organizationName" value={formData.organizationName} onChange={handleChange} required={userType === 'ngo'} placeholder="e.g., Helpora Foundation" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="ngoRegistrationId">Registration ID / License No. (Required)</label>
                            <input type="text" id="ngoRegistrationId" name="ngoRegistrationId" value={formData.ngoRegistrationId} onChange={handleChange} required={userType === 'ngo'} placeholder="e.g., REG-12345 (for verification)" />
                        </div>
                    </>
                )}

                <button 
                    type="submit" 
                    className={`submit-btn ${userType === 'victim' ? 'blue-bg' : 'green-bg'}`}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Registering...
                        </span>
                    ) : (
                        `Register as ${userType === 'victim' ? 'Individual' : 'NGO'}`
                    )}
                </button>
            </form>
            
            <p className="signup-link">
                Already have an account? 
                <a onClick={() => setPage('login')}> Login Here</a>
            </p>
        </div>
    );
};

// --- INTERNAL COMPONENT: LOGIN ---
const Login = ({ setPage }) => {
    const [userType, setUserType] = useState('victim');
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Check for existing token on mount
    useEffect(() => {
        if (localStorage.getItem('userToken')) {
            setPage('dashboard');
        }
    }, [setPage]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setMessage('');
    };

    const handleUserTypeChange = (e) => {
        setUserType(e.target.value);
        setMessage('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setIsError(false);
        setIsLoading(true);

        const endpoint = userType === 'victim' 
            ? `${API_URL}/login-victim` 
            : `${API_URL}/login-ngo`;

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            
            const data = await response.json();

            if (response.ok && data.token) {
                // SUCCESS: Store token and user role
                localStorage.setItem('userToken', data.token);
                localStorage.setItem('userRole', userType);
                localStorage.setItem('userName', data.name || 'User'); // Store user name if available
                
                setMessage('Login successful! Redirecting to dashboard...');
                setIsError(false);
                setTimeout(() => setPage('dashboard'), 500);
            } else {
                // ERROR: Backend sends non-200 status or token is missing
                setMessage(data.msg || data.error || 'Login failed. Please check your credentials.');
                setIsError(true);
            }
        } catch (error) {
            setMessage('Network error. Could not connect to the server. Check your backend is running.');
            setIsError(true);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="register-card">
            <h2>Helpora Login</h2>

            {message && (
                <div className={`alert ${isError ? 'alert-error' : 'alert-success'}`}>
                    {message}
                </div>
            )}

            <div className="user-type-toggle">
                <label>Login as:</label>
                <div className="toggle-options">
                    <input type="radio" id="login-victim" name="userType" value="victim"
                        checked={userType === 'victim'} onChange={handleUserTypeChange} hidden />
                    <label htmlFor="login-victim" className={`toggle-label ${userType === 'victim' ? 'active-victim' : ''}`}>
                        Victim
                    </label>
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
                    className={`submit-btn ${userType === 'victim' ? 'blue-bg' : 'green-bg'}`}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Logging In...
                        </span>
                    ) : (
                        `Login as ${userType === 'victim' ? 'Individual' : 'NGO'}`
                    )}
                </button>
            </form>
            
            <p className="register-link">
                Don't have an account? 
                <a onClick={() => setPage('register')}> Register Here</a>
            </p>
        </div>
    );
};

// --- INTERNAL COMPONENT: DASHBOARD ---
const Dashboard = ({ setPage }) => {
    const [userName, setUserName] = useState('');
    const [userRole, setUserRole] = useState('');
    const [profileData, setProfileData] = useState('Fetching profile data...');
    const [isFetching, setIsFetching] = useState(false);

    const fetchProfileData = useCallback(async (token) => {
        setIsFetching(true);
        try {
            const response = await fetch(`${API_URL}/profile`, {
                method: 'GET',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
            });
            
            const data = await response.json();

            if (response.ok) {
                setProfileData(JSON.stringify(data, null, 2)); 
            } else {
                setProfileData(`Failed to load profile: ${data.message || 'Server error'}. Token may be invalid.`);
            }
        } catch (error) {
            setProfileData('Network error. Could not reach profile server.');
        } finally {
            setIsFetching(false);
        }
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('userToken');
        const role = localStorage.getItem('userRole');
        const name = localStorage.getItem('userName');
        
        if (!token || !role) {
            // No token, redirect to login
            setPage('login');
            return;
        }

        setUserRole(role);
        setUserName(name || 'User'); 
        
        fetchProfileData(token);
    }, [setPage, fetchProfileData]);

    const handleLogout = () => {
        localStorage.removeItem('userToken');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userName');
        setPage('login');
        console.log("Logged out successfully.");
    };

    // Sub-Component for Victim Content
    const VictimDashboardContent = ({ name, data, isFetchingData }) => (
        <>
            <h3 className="text-xl font-bold text-blue-600">Victim Dashboard</h3>
            <p className="text-gray-600 mt-2">Hello, **{name}**! Report an incident or view your case history.</p>

            <div className="action-grid">
                <button className="grid-btn bg-blue-500 hover:bg-blue-600">
                    <span className="text-2xl">🚨</span> Report New Incident
                </button>
                <button className="grid-btn bg-blue-500 hover:bg-blue-600">
                    <span className="text-2xl">📝</span> View My Cases
                </button>
                <button className="grid-btn bg-blue-500 hover:bg-blue-600">
                    <span className="text-2xl">📞</span> Contact Support
                </button>
            </div>

            <div className="profile-section">
                <h4 className="font-semibold text-lg text-gray-700 mb-2">My Profile Data (Protected API)</h4>
                <div className="data-box">
                    {isFetchingData ? (
                        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Fetching data...
                        </span>
                    ) : data}
                </div>
            </div>
        </>
    );

    // Sub-Component for NGO Content
    const NGODashboardContent = ({ name, data, isFetchingData }) => (
        <>
            <h3 className="text-xl font-bold text-green-600">NGO/Provider Dashboard</h3>
            <p className="text-gray-600 mt-2">Welcome, **{name}**! Manage incoming requests and update your services.</p>

            <div className="action-grid">
                <button className="grid-btn bg-green-500 hover:bg-green-600">
                    <span className="text-2xl">🗺️</span> View Case Map
                </button>
                <button className="grid-btn bg-green-500 hover:bg-green-600">
                    <span className="text-2xl">📂</span> Pending Requests (12)
                </button>
                <button className="grid-btn bg-green-500 hover:bg-green-600">
                    <span className="text-2xl">⚙️</span> Manage Services
                </button>
            </div>

            <div className="profile-section">
                <h4 className="font-semibold text-lg text-gray-700 mb-2">Organization Profile Data (Protected API)</h4>
                <div className="data-box">
                    {isFetchingData ? (
                        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Fetching data...
                        </span>
                    ) : data}
                </div>
            </div>
        </>
    );

    return (
        <div className="register-card dashboard-card">
            <h2>Helpora Dashboard</h2>
            
            {userRole === 'victim' ? (
                <VictimDashboardContent 
                    name={userName}
                    data={profileData}
                    isFetchingData={isFetching}
                />
            ) : (
                <NGODashboardContent 
                    name={userName}
                    data={profileData}
                    isFetchingData={isFetching}
                />
            )}

            <button 
                onClick={handleLogout}
                className="submit-btn logout-btn"
            >
                Log Out
            </button>
        </div>
    );
};

// --- MAIN ROUTER COMPONENT ---
const AppRouter = () => {
    // Check local storage for a token on initial load
    const initialPage = localStorage.getItem('userToken') ? 'dashboard' : 'login';
    const [currentPage, setCurrentPage] = useState(initialPage);

    const renderPage = () => {
        switch (currentPage) {
            case 'register':
                return <Register setPage={setCurrentPage} />;
            case 'dashboard':
                return <Dashboard setPage={setCurrentPage} />;
            case 'login':
            default:
                return <Login setPage={setCurrentPage} />;
        }
    };

    return (
        <div className="register-container">
            <CustomStyles />
            {renderPage()}
        </div>
    );
};

export default AppRouter;
