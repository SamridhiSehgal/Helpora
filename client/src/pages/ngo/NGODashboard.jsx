import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './NGO.css'; 

// 🚨 CRITICAL: Imports must match your file structure (PascalCase + .jsx assumed)
import IncomingRequests from './IncomingRequests.jsx'; 
import FulfillmentTracker from './FulfillmentTracker.jsx';
import ResourceUpdate from './ResourceUpdate.jsx';


const initialRequests = [
    { id: 101, victimName: "Rohan P.", location: "Pune, Sector 5", aidType: "Medical Supplies", status: "Pending", priority: "High" },
    { id: 102, victimName: "Priya S.", location: "Mumbai, Slum Area", aidType: "Shelter", status: "Pending", priority: "Urgent" },
    { id: 103, victimName: "Amit V.", location: "Thane, Coastal Zone", aidType: "Food & Water", status: "Accepted", priority: "Medium" },
];

const NGODashboard = () => {
    // Hooks for routing and location awareness
    const navigate = useNavigate();
    const location = useLocation(); // Used to determine the active link/page
    
    // State is only used for data (requests), not internal routing
    const [requests] = useState(initialRequests);
    const [ngoName] = useState("Helpora Relief Agency");

    // --- Dashboard Overview Component (Rendered when URL is /ngo/dashboard) ---
    const DashboardOverview = ({ requests, ngoName }) => {
        const totalPending = requests.filter(r => r.status === 'Pending').length;
        const totalInProgress = requests.filter(r => r.status === 'Accepted').length;
        
        // Helper to navigate to a new path
        const handleNavigation = (e, path) => {
            e.preventDefault(); 
            navigate(path); 
        };
        
        return (
            <>
                <header className="ngo-header">
                    <h1>{ngoName} Dashboard Overview</h1>
                    <p>Welcome back! Use the sidebar to manage aid requests and update resources.</p>
                </header>

                <div className="stats-grid">
                    <div className="stat-card">
                        <h3>Total Requests</h3>
                        <p className="stat-value">{requests.length}</p>
                    </div>
                    <div className="stat-card pending">
                        <h3>Pending Review</h3>
                        <p className="stat-value">{totalPending}</p>
                    </div>
                    <div className="stat-card accepted">
                        <h3>In Progress</h3>
                        <p className="stat-value">{totalInProgress}</p>
                    </div>
                </div>
                
                <p className="resource-section">
                    <a 
                        href="/ngo/incoming-requests" 
                        className="primary-btn" 
                        onClick={(e) => handleNavigation(e, '/ngo/incoming-requests')}
                    >
                        View All Incoming Requests
                    </a>
                </p>
            </>
        );
    };

    // --- Content Renderer (Maps URL to Component) ---
    const renderContent = () => {
        const path = location.pathname;

        // Note: The App.jsx router must handle the exact paths below!
        if (path === '/ngo/incoming-requests') {
            return <IncomingRequests requests={requests} />; 
        }
        if (path === '/ngo/fulfillment-tracker') {
            return <FulfillmentTracker />;
        }
        if (path === '/ngo/resource-update') {
            return <ResourceUpdate />;
        }
        // Default case: Show the Dashboard Overview
        return <DashboardOverview requests={requests} ngoName={ngoName} />;
    };

    // --- Sidebar Navigation Handler ---
    const handleSidebarNavigation = (e, path) => {
        e.preventDefault(); 
        navigate(path);
    };

    // Helper to determine the active link class based on the current URL
    const isLinkActive = (path) => location.pathname === path;


    return (
        // The ngo-container class applies the CSS Grid layout
        <div className="ngo-container">
            {/* Sidebar Navigation */}
            <nav className="sidebar">
                <h3>NGO Portal</h3>
                <ul className="nav-link-list">
                    <li>
                        {/* Dashboard Home link */}
                        <a 
                            href="/ngo/dashboard"
                            className={isLinkActive('/ngo/dashboard') ? 'active' : ''} 
                            onClick={(e) => handleSidebarNavigation(e, '/ngo/dashboard')}
                        >
                            🏠 Dashboard Home
                        </a>
                    </li>
                    <li>
                        {/* Incoming Requests link */}
                        <a 
                            href="/ngo/incoming-requests"
                            className={isLinkActive('/ngo/incoming-requests') ? 'active' : ''} 
                            onClick={(e) => handleSidebarNavigation(e, '/ngo/incoming-requests')}
                        >
                            🚨 Incoming Requests
                        </a>
                    </li>
                    <li>
                        {/* Fulfillment Tracker link */}
                        <a 
                            href="/ngo/fulfillment-tracker"
                            className={isLinkActive('/ngo/fulfillment-tracker') ? 'active' : ''} 
                            onClick={(e) => handleSidebarNavigation(e, '/ngo/fulfillment-tracker')}
                        >
                            📍 Fulfillment Tracker
                        </a>
                    </li>
                    <li>
                        {/* Resource Update link */}
                        <a 
                            href="/ngo/resource-update"
                            className={isLinkActive('/ngo/resource-update') ? 'active' : ''} 
                            onClick={(e) => handleSidebarNavigation(e, '/ngo/resource-update')}
                        >
                            📦 Resource Update
                        </a>
                    </li>
                </ul>
            </nav>

            {/* Main Content Area - Renders the selected component */}
            <main className="main-content-area">
                {renderContent()}
            </main>
        </div>
    );
};

export default NGODashboard;
