import React, { useState } from 'react';
import './Register.css';
const redirectToLogin = () => {
    console.log("Redirecting to the Registration page...");
    // In a real application, this would be navigate('/login');
    alert("Simulating redirection to Login page.");
};

const Register = () => {
  // State to track the selected user type: 'victim' (Individual) or 'ngo' (Provider)
  const [userType, setUserType] = useState('victim'); 
  // State for all form data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    // Initializing optional fields to prevent errors
    phone: '',
    organizationName: '',
    ngoRegistrationId: ''
  });

  // Handler for the radio button/toggle change
  const handleUserTypeChange = (event) => {
    setUserType(event.target.value);
    // Optional: Reset form fields specific to the *other* user type when switching
    setFormData(prevData => ({
      ...prevData,
      phone: '',
      organizationName: '',
      ngoRegistrationId: ''
    }));
  };

  // Handler for general input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handler for form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(`Registering as ${userType}:`, formData);
    // You would typically send the data to your backend API here.
    // The API would use the 'userType' to determine which collection/table to save to.
    alert(`Registration attempted for ${formData.email} as a ${userType === 'victim' ? 'Individual' : 'NGO'}. Check console for data.`);
  };

  // Conditional rendering for specific fields based on user type
  const renderSpecificFields = () => {
    if (userType === 'victim') {
      return (
        // Fields specific to an Individual/Victim
        <div className="form-group">
          <label htmlFor="phone">Phone Number</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            placeholder="e.g., +91-9876543210"
          />
        </div>
      );
    } else if (userType === 'ngo') {
      return (
        // Fields specific to an NGO/Service Provider
        <>
          <div className="form-group">
            <label htmlFor="organizationName">Organization Name</label>
            <input
              type="text"
              id="organizationName"
              name="organizationName"
              value={formData.organizationName}
              onChange={handleChange}
              required
              placeholder="e.g., Helpora Foundation"
            />
          </div>
          <div className="form-group">
            <label htmlFor="ngoRegistrationId">Registration ID / License No.</label>
            <input
              type="text"
              id="ngoRegistrationId"
              name="ngoRegistrationId"
              value={formData.ngoRegistrationId}
              onChange={handleChange}
              required
              placeholder="e.g., REG-12345 (for verification)"
            />
          </div>
        </>
      );
    }
    return null;
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2>Helpora Registration</h2>
        
        {/* User Type Toggle Switch */}
        <div className="user-type-toggle">
          <label>Register as:</label>
          <div className="toggle-options">
            {/* Individual Radio Button */}
            <input
              type="radio"
              id="victim"
              name="userType"
              value="victim"
              checked={userType === 'victim'}
              onChange={handleUserTypeChange}
            />
            <label htmlFor="victim" className={`toggle-label ${userType === 'victim' ? 'active' : ''}`}>
              Victim
            </label>

            {/* NGO Radio Button */}
            <input
              type="radio"
              id="ngo"
              name="userType"
              value="ngo"
              checked={userType === 'ngo'}
              onChange={handleUserTypeChange}
            />
            <label htmlFor="ngo" className={`toggle-label ${userType === 'ngo' ? 'active' : ''}`}>
              NGO / Provider
            </label>
          </div>
        </div>
        
        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <label htmlFor="name">Full Name {userType === 'ngo' ? '(Representative)' : ''}</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Create a password"
            />
          </div>

          {/* Render conditional fields based on selection */}
          {renderSpecificFields()}

          <button type="submit" className="submit-btn">
            Register as {userType === 'victim' ? 'Individual' : 'NGO'}
          </button>
        </form>
        {/* Signup Link/Redirect */}
        <p className="signup-link">
          Already have an account? 
          <a href="/login" onClick={redirectToLogin}> Login Here</a>
        </p>
      </div>
    </div>
  );
};

export default Register;