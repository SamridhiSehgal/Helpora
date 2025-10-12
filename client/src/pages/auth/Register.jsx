import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom'; // Use this if you are using React Router
import './Register.css'; // Assuming you have a CSS file

const Register = () => {
    // const navigate = useNavigate(); // Initialize navigate hook

    // State for selected user type: 'victim' or 'ngo'
    const [userType, setUserType] = useState('victim'); 
    
    // State for form data
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        // Victim-specific
        phone: '', 
        // NGO-specific
        organizationName: '',
        ngoRegistrationId: ''
    });

    // State for displaying success/error messages
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);

    // Backend API URL
    const API_URL = 'http://localhost:8080/api/auth/signup';

    // Handler for general input changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setMessage(''); // Clear message on input change
    };

    // Handler for the radio button/toggle change
    const handleUserTypeChange = (e) => {
        const newType = e.target.value;
        setUserType(newType);
        // Reset specific fields when switching user type
        setFormData(prevData => ({
            ...prevData,
            phone: '',
            organizationName: '',
            ngoRegistrationId: ''
        }));
        setMessage('');
    };

    // Client-side validation function
    const validateForm = () => {
        if (!formData.name || !formData.email || !formData.password) {
            return "Please fill in all required fields (Name, Email, Password).";
        }
        if (formData.password.length < 6) {
            return "Password must be at least 6 characters long.";
        }
        if (userType === 'ngo' && (!formData.organizationName || !formData.ngoRegistrationId)) {
            return "NGO registration requires Organization Name and Registration ID.";
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

        // 1. Construct the payload based on userType
        const payload = {
            email: formData.email,
            password: formData.password,
            role: userType, // Critical: Backend needs this!
            name: formData.name, // Representative name (for NGO) or full name (for Victim)
        };

        if (userType === 'victim') {
            payload.phone = formData.phone;
        } else if (userType === 'ngo') {
            // Note: Our backend controller uses 'ngoName' and 'registrationNumber'
            payload.ngoName = formData.organizationName; 
            payload.registrationNumber = formData.ngoRegistrationId;
        }

        try {
            // 2. API Call to the Backend Signup Endpoint
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            
            const data = await response.json();

            if (response.ok) {
                // SUCCESS
                setMessage('Registration successful! Redirecting to login...');
                setIsError(false);
                // navigate('/login'); // In a real app, use this
                setTimeout(() => { 
                    alert("Registration SUCCESS! Simulating redirect to Login.");
                    // window.location.href = '/login'; // Fallback
                }, 1500);
            } else {
                // ERROR (e.g., email already exists, invalid data from backend)
                setMessage(data.msg || 'Registration failed due to a server error.');
                setIsError(true);
            }
        } catch (error) {
            setMessage('Network error. Could not connect to the server.');
            setIsError(true);
            console.error('Signup Error:', error);
        }
    };

    return (
        <div className="register-container">
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
                            Victim
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
                    
                    {/* Common Fields */}
                    <div className="form-group">
                        <label htmlFor="name">Full Name {userType === 'ngo' ? '(Representative)' : ''}</label>
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

                    {/* Conditional Fields */}
                    {userType === 'victim' ? (
                        <div className="form-group">
                            <label htmlFor="phone">Phone Number</label>
                            <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="e.g., +91-9876543210" />
                        </div>
                    ) : (
                        <>
                            <div className="form-group">
                                <label htmlFor="organizationName">Organization Name</label>
                                <input type="text" id="organizationName" name="organizationName" value={formData.organizationName} onChange={handleChange} required={userType === 'ngo'} placeholder="e.g., Helpora Foundation" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="ngoRegistrationId">Registration ID / License No.</label>
                                <input type="text" id="ngoRegistrationId" name="ngoRegistrationId" value={formData.ngoRegistrationId} onChange={handleChange} required={userType === 'ngo'} placeholder="e.g., REG-12345 (for verification)" />
                            </div>
                        </>
                    )}

                    <button type="submit" className="submit-btn">
                        Register as {userType === 'victim' ? 'Individual' : 'NGO'}
                    </button>
                </form>

                <p className="signup-link">
                    Already have an account? 
                    <a href="/login"> Login Here</a>
                </p>
            </div>
        </div>
    );
};

export default Register;