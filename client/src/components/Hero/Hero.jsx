import React, { useState } from 'react';
// IMPORTANT: Assumes you have 'react-router-dom' installed for navigation
import { useNavigate } from 'react-router-dom'; 
import './Hero.css';

const Hero = () => {
    // 1. STATE: This simulates the user's authentication status.
    // In a real application, this state would come from a global Auth Context.
    const [isUserLoggedIn, setIsUserLoggedIn] = useState(false); 
    
    // Hook to allow programmatic navigation
    const navigate = useNavigate();

    const handleAidRequest = () => {
        // Check if the user is logged in
        if (isUserLoggedIn) {
            // 2. LOGGED IN: Redirect to the Login page 
            // (Assuming existing users need to log in or are redirected to a request dashboard)
            navigate('/login');
            console.log("User is already registered/logged in. Redirecting to Login.");
        } else {
            // 3. NOT LOGGED IN: Redirect to the Registration page
            navigate('/register');
            console.log("User is not registered. Redirecting to Registration.");
        }
    };

    return (
        <div className="hero">
            {/* Simulation of a dynamic login state for testing */}
            {/* Placed absolutely so it doesn't interfere with the hero layout */}
            <div style={{ position: 'absolute', top: '10px', right: '10px', backgroundColor: 'white', padding: '5px', borderRadius: '5px', boxShadow: '0 0 5px rgba(0,0,0,0.2)', zIndex: 10 }}>
                <label style={{ fontSize: '0.8rem' }}>
                    <input 
                        type="checkbox" 
                        checked={isUserLoggedIn}
                        onChange={(e) => setIsUserLoggedIn(e.target.checked)}
                        style={{ marginRight: '5px' }}
                    />
                    Simulate Logged In
                </label>
            </div>
            
            <div className="hero-content">
                <h1>DISASTER STRIKES. HELP IS HERE.</h1>
                <p>Connecting Victims to the Nearest NGO Resources and Shelters in Real-Time.</p>
                
                {/* Button with the updated conditional redirection logic */}
                <button 
                    className="cta-button"
                    onClick={handleAidRequest}
                >
                    REQUEST AID NOW
                </button>
            </div>
        </div>
    );
}

export default Hero;
