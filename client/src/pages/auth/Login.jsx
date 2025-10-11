import React, { useState } from 'react';
import './Login.css'; // Import the dedicated CSS file

// Placeholder function for routing/redirection
const redirectToSignup = () => {
    console.log("Redirecting to the Registration page...");
    // In a real application, this would be navigate('/register');
    alert("Simulating redirection to Signup page.");
};

const Login = () => {
  // State to track the selected user type: 'victim' (Individual) or 'ngo' (Provider)
  const [userType, setUserType] = useState('victim'); 
  
  // State for form data
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // Handler for the radio button change
  const handleUserTypeChange = (event) => {
    setUserType(event.target.value);
  };

  // Handler for general input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handler for form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(`Attempting login as ${userType}:`, formData);
    // In a real application, authentication logic would go here, 
    // likely sending userType along with credentials.
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Helpora Login</h2>
        
        {/* User Type Toggle Switch */}
        <div className="user-type-toggle">
          <label>Log in as:</label>
          <div className="toggle-options">
            <input
              type="radio"
              id="login-individual"
              name="userType"
              value="victim"
              checked={userType === 'victim'}
              onChange={handleUserTypeChange}
            />
            <label htmlFor="login-individual" className={`toggle-label ${userType === 'victim' ? 'active' : ''}`}>
              Victim
            </label>

            <input
              type="radio"
              id="login-ngo"
              name="userType"
              value="ngo"
              checked={userType === 'ngo'}
              onChange={handleUserTypeChange}
            />
            <label htmlFor="login-ngo" className={`toggle-label ${userType === 'ngo' ? 'active' : ''}`}>
              NGO / Provider
            </label>
          </div>
        </div>
        
        {/* Login Form */}
        <form onSubmit={handleSubmit} className="login-form">
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
              placeholder="Enter your password"
            />
          </div>

          <button type="submit" className="submit-btn">
            Log In as {userType === 'victim' ? 'Individual' : 'NGO'}
          </button>
        </form>

        {/* Signup Link/Redirect */}
        <p className="signup-link">
          Don't have an account? 
          <a href="/register" onClick={redirectToSignup}> Register Here</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
