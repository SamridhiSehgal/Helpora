import React, { useState, useEffect } from 'react';
// Note: If using React Router, uncomment the next line
// import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    // const navigate = useNavigate();
    
    // State to hold user info read from localStorage
    const [userName, setUserName] = useState('');
    const [userRole, setUserRole] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [profileData, setProfileData] = useState('Loading profile data...');
    const [isFetching, setIsFetching] = useState(false);

    // --- PROTECTED API ENDPOINT ---
    const PROFILE_API_URL = 'http://localhost:8080/api/profile'; 
    // ------------------------------------


    useEffect(() => {
        // 1. Authorization Check: Read stored data on component mount
        const token = localStorage.getItem('userToken');
        const role = localStorage.getItem('userRole');
        const name = localStorage.getItem('userName');
        
        if (!token || !role) {
            // User is not authenticated. Redirect them to login.
            setIsLoggedIn(false);
            // navigate('/login'); 
            console.warn("Unauthorized access. Redirecting to login.");
            return;
        }

        // User is logged in
        setIsLoggedIn(true);
        setUserRole(role);
        setUserName(name || 'User'); 
        
        // 2. Fetch Protected Data
        fetchProfileData(token);
    }, []);

    // Function to fetch data from a protected endpoint
    const fetchProfileData = async (token) => {
        setIsFetching(true);
        try {
            // CRUCIAL: Including the Authorization Bearer token
            const response = await fetch(PROFILE_API_URL, {
                method: 'GET',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
            });
            
            const data = await response.json();

            if (response.ok) {
                // Store fetched user details (could be more descriptive than just JSON)
                setProfileData(JSON.stringify(data, null, 2)); 
            } else {
                setProfileData(`Failed to load profile: ${data.message || 'Server error'}`);
            }
        } catch (error) {
            setProfileData('Network error: Could not reach profile server.');
            console.error('Profile fetch error:', error);
        } finally {
            setIsFetching(false);
        }
    };

    // Function to handle logout
    const handleLogout = () => {
        localStorage.removeItem('userToken');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userName');
        // navigate('/login'); 
        setIsLoggedIn(false);
        console.log("Logged out successfully.");
    };
    
    // --- INTERNAL ROLE-SPECIFIC COMPONENTS ---

    // Content for Victim/Individual Users
    const VictimDashboardContent = ({ name, data, isFetchingData }) => (
        <>
            <h3 className="text-xl font-bold text-blue-600">
                Victim Dashboard
            </h3>
            <p className="text-gray-600 mt-2">
                Hello, **{name}**! Report an incident or view your case history.
            </p>

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
                <h4 className="font-semibold text-lg text-gray-700 mb-2">My Profile Data</h4>
                <div className="data-box">
                    {isFetchingData ? (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Fetching data...
                        </div>
                    ) : (
                        data
                    )}
                </div>
            </div>
        </>
    );

    // Content for NGO/Provider Users
    const NGODashboardContent = ({ name, data, isFetchingData }) => (
        <>
            <h3 className="text-xl font-bold text-green-600">
                NGO/Provider Dashboard
            </h3>
            <p className="text-gray-600 mt-2">
                Welcome, **{name}**! Manage incoming requests and update your services.
            </p>

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
                <h4 className="font-semibold text-lg text-gray-700 mb-2">Organization Profile Data</h4>
                <div className="data-box">
                    {isFetchingData ? (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Fetching data...
                        </div>
                    ) : (
                        data
                    )}
                </div>
            </div>
        </>
    );
    
    // --- END INTERNAL COMPONENTS ---


    if (!isLoggedIn) {
        // Simple message if authentication failed during initial check
        return (
            <div className="register-container">
                <div className="register-card">
                    <h2 className="text-red-600">Access Denied</h2>
                    <p>Please <a href="/login" className="text-blue-600 font-semibold">login</a> to view this page.</p>
                </div>
            </div>
        );
    }


    // Component logic ends, JSX/Rendering starts
    return (
        <div className="register-container">
            <style>
                {/* Re-using the essential CSS structure for consistent aesthetics and adding grid styles */}
                {`
                .register-container {
                    min-height: 100vh; 
                    display: flex;
                    justify-content: center;
                    align-items: center; 
                    background-color: #f4f7f6;
                    padding: 20px 10px; 
                    box-sizing: border-box; 
                    font-family: 'Inter', sans-serif;
                }

                .register-card {
                    background-color: #ffffff;
                    padding: 2.5rem; 
                    border-radius: 12px;
                    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
                    width: 100%;
                    max-width: 700px; 
                    text-align: center;
                }

                .register-card h2 {
                    color: #1f2937;
                    margin-bottom: 0.5rem;
                    font-size: 2rem;
                    font-weight: 800;
                }

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
                }

                /* Action Grid Styles */
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
                    margin-top: 2.5rem; /* Increased margin for better separation */
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    width: 100%;
                }
                
                .logout-btn {
                    background-color: #ef4444; /* Red for logout */
                    margin-top: 0.75rem;
                }
                .logout-btn:hover {
                    background-color: #dc2626;
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
            
            <div className="register-card">
                <h2>Welcome to Helpora</h2>
                
                {/* --- CONDITIONAL CONTENT RENDERING --- */}
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
                {/* --- END CONDITIONAL CONTENT --- */}

                <button 
                    onClick={handleLogout}
                    className="submit-btn logout-btn"
                >
                    Log Out
                </button>
            </div>
        </div>
    );
};

export default Dashboard;
