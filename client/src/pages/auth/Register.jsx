import React, { useState } from 'react';
// Note: In a real application, you would use 'useNavigate' from react-router-dom
// import { useNavigate } from 'react-router-dom';

const Register = () => {
    // const navigate = useNavigate(); 
    const [userType, setUserType] = useState('victim'); 
    
    // --- Initialized State: Using 'regno' for NGO Registration ID (CORRECTED LINE 1) ---
    const initialFormData = {
        name: '', // Full name / Representative name
        email: '',
        password: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        location: '', 
        phone: '', // Victim-specific
        regno: '' // NGO-specific (Registration ID) - CORRECTED
    };
    
    const [formData, setFormData] = useState(initialFormData);

    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // --- SEPARATE BACKEND API ENDPOINTS --- (NOT CHANGED PER INSTRUCTION)
    const API_URLS = {
        victim: 'http://localhost:4000/victim/register',
        ngo: 'http://localhost:4000/ngo/register'
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
        // Reset specific fields when switching user type (only fields relevant to the switch)
        setFormData(prevData => ({
            ...prevData,
            // Resetting NGO/Victim specific fields
            phone: '',
            regno: '',
            // Name is shared, so we don't reset it here
        }));
        setMessage('');
    };

    // Client-side validation function
    const validateForm = () => {
        const requiredCommonFields = ['name', 'email', 'password', 'address', 'city', 'state', 'zip', 'location'];
        
        for (const field of requiredCommonFields) {
            if (!formData[field]) {
                return `Please fill in the required field: ${field.charAt(0).toUpperCase() + field.slice(1)}.`;
            }
        }

        // --- CORRECTION 2: Password length check consistency (LINE 104) ---
        // Your backend requires length >= 8. We enforce that here.
        if (formData.password.length < 8) {
            return "Password must be at least 8 characters long (recommended by server).";
        }
        
        // --- CORRECTION 2: NGO Validation using 'regno' (LINE 109) ---
        if (userType === 'ngo' && !formData.regno) {
            return "NGO registration requires a Registration ID (regno).";
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

        // 1. Construct the base payload (common fields)
        let payload = {
            email: formData.email,
            password: formData.password,
            name: formData.name, // Name of victim or NGO organization/representative
            address: formData.address,
            city: formData.city,
            state: formData.state,
            zip: formData.zip,
            location: formData.location,
        };

        // 2. Add role-specific fields and select the API URL
        let finalUrl;

        if (userType === 'victim') {
            // Only include phone if it exists and we are a victim
            if (formData.phone) {
                payload.phone = formData.phone;
            }
            // Line 140: Setting victim URL
            finalUrl = API_URLS.victim;
            
        } else if (userType === 'ngo') {
            // --- CORRECTION 3: Aligning payload key with backend 'regno' (LINE 145) ---
            payload.regno = formData.regno; // CORRECTED
            // Line 147: Setting NGO URL
            finalUrl = API_URLS.ngo;
        }

        try {
            // 3. API Call to the specific Backend Endpoint
            const response = await fetch(finalUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            
            const data = await response.json();

            if (response.ok && data.success) { 
                // SUCCESS: Reset form and indicate success/redirect
                setMessage('Registration successful! Please proceed to login.');
                setIsError(false);
                setFormData(initialFormData); // Reset all fields on success
                // navigate('/login'); 
                console.log("Registration SUCCESS! Payload sent:", payload);

            } else {
                // ERROR (Handle server-side validation/conflict errors)
                setMessage(data.message || 'Registration failed due to a server error. Check server logs.');
                setIsError(true);
            }
        } catch (error) {
            setMessage('Network error. Could not connect to the server. Please check the API URL and server status.');
            setIsError(true);
            console.error('Signup Error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Component logic ends, JSX/Rendering starts
    return (
        <div className="register-container">
            <style>
                {/* -------------------------------------- */
                /* CSS Styles (Copied from previous query) */
                /* -------------------------------------- */}
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

                /* User Type Toggle Styling */
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
                    width: 100%; /* Ensure button is full width */
                }

                .blue-btn {
                    background-color: #3b82f6; /* Blue for Victim/Default */
                }

                .blue-btn:hover:not(:disabled) {
                    background-color: #2563eb;
                    box-shadow: 0 6px 8px rgba(59, 130, 246, 0.3);
                }

                .green-btn {
                    background-color: #10b981; /* Green for NGO */
                }

                .green-btn:hover:not(:disabled) {
                    background-color: #059669;
                    box-shadow: 0 6px 8px rgba(16, 185, 129, 0.3);
                }

                .submit-btn:disabled {
                    background-color: #a3a3a3; /* Grayed out when loading */
                    cursor: not-allowed;
                }

                .signup-link {
                    margin-top: 1.5rem;
                    font-size: 0.9rem;
                    color: #6b7280;
                }

                .signup-link a {
                    color: #3b82f6;
                    font-weight: 600;
                    text-decoration: none;
                }

                .signup-link a:hover {
                    text-decoration: underline;
                }

                /* Mobile/Small Screens Responsiveness */
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
                `}
            </style>
            
            <div className="register-card">
                <h2>Helpora Registration</h2>
                
                {/* Message Alert */}
                {message && (
                    <div className={`alert ${isError ? 'alert-error' : 'alert-success'}`}>
                        {message}
                    </div>
                )}
                
                {/* User Type Toggle Switch */}
                <div className="user-type-toggle">
                    <label>Register as:</label>
                    <div className="toggle-options">
                        {/* Victim */}
                        <input type="radio" id="victim" name="userType" value="victim"
                            checked={userType === 'victim'} onChange={handleUserTypeChange} hidden />
                        <label htmlFor="victim" className={`toggle-label ${userType === 'victim' ? 'active-victim' : ''}`}>
                            Victim / Individual
                        </label>

                        {/* NGO */}
                        <input type="radio" id="ngo" name="userType" value="ngo"
                            checked={userType === 'ngo'} onChange={handleUserTypeChange} hidden />
                        <label htmlFor="ngo" className={`toggle-label ${userType === 'ngo' ? 'active-ngo' : ''}`}>
                            NGO / Provider
                        </label>
                    </div>
                </div>
                
                <form onSubmit={handleSubmit} className="register-form">
                    
                    {/* Common Fields: Name, Email, Password */}
                    <div className="form-group">
                        <label htmlFor="name">{userType === 'ngo' ? "Organization Name / Representative Name" : "Full Name"}</label>
                        <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required placeholder={userType === 'ngo' ? "Enter your organization name" : "Enter your full name"} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required placeholder="Enter your email" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password (min 8 characters)</label>
                        <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required minLength="8" placeholder="Create a password" />
                    </div>

                    {/* Address Fields */}
                    <div className="form-group">
                        <label htmlFor="address">Address Line 1</label>
                        <input type="text" id="address" name="address" value={formData.address} onChange={handleChange} required placeholder="Street address or P.O. Box" />
                    </div>
                    
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label htmlFor="city">City</label>
                            <input type="text" id="city" name="city" value={formData.city} onChange={handleChange} required placeholder="City" />
                        </div>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label htmlFor="state">State / Province</label>
                            <input type="text" id="state" name="state" value={formData.state} onChange={handleChange} required placeholder="State or Province" />
                        </div>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label htmlFor="zip">Zip / Postal Code</label>
                            <input type="text" id="zip" name="zip" value={formData.zip} onChange={handleChange} required placeholder="Zip Code" />
                        </div>
                        {/* Location Coordinates */}
                        <div className="form-group" style={{ flex: 1 }}>
                            <label htmlFor="location">Location Coordinates</label>
                            <input type="text" id="location" name="location" value={formData.location} onChange={handleChange} required placeholder="e.g., 34.0522, -118.2437" />
                        </div>
                    </div>

                    {/* Conditional Fields: Phone (Victim) or Registration ID (NGO) */}
                    {userType === 'victim' ? (
                        <div className="form-group">
                            <label htmlFor="phone">Phone Number (Optional)</label>
                            <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="e.g., +91-9876543210" />
                        </div>
                    ) : (
                        // --- CORRECTION 4: NGO Registration ID Input Binding (LINE 323) ---
                        <div className="form-group">
                            <label htmlFor="regno">Registration ID / License No. (Required)</label>
                            <input 
                                type="text" 
                                id="regno" 
                                name="regno" // <-- CRITICAL FIX: Name and Value are bound to 'regno'
                                value={formData.regno} 
                                onChange={handleChange} 
                                required={userType === 'ngo'} 
                                placeholder="e.g., REG-12345" 
                            />
                        </div>
                    )}

                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className={`submit-btn ${userType === 'victim' ? 'blue-btn' : 'green-btn'}`}
                    >
                        {isLoading ? (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {/* Spinner definition is in the style tag */}
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" style={{ animation: 'spin 1s linear infinite' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Registering...
                                {/* Defining spin animation locally since we are using inline styles/embedded CSS */}
                                <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                            </div>
                        ) : (
                            `Register as ${userType === 'victim' ? 'Individual' : 'NGO'}`
                        )}
                    </button>
                </form>
                
                <p className="signup-link">
                    Already have an account? 
                    <a href="/login"> 
                        Login Here
                    </a>
                </p>
            </div>
        </div>
    );
};

export default Register;
