// src/layouts/MainLayout.jsx

import React from 'react';
import { Outlet } from 'react-router-dom'; // ⬅️ CRITICAL for rendering nested routes
import Sidebar from '../components/Sidebar'; // ⬅️ Assumes your Sidebar component is here

// Define the component using standard function syntax
const MainLayout = () => {
    return (
        // The main container uses flex to place the sidebar and content side-by-side
        <div className="flex min-h-screen bg-gray-50">
            
            {/* 1. Sidebar (Fixed Navigation) */}
            <Sidebar />
            
            {/* 2. Main Content Area */}
            <main className="flex-1 p-8 lg:p-10">
                {/* ⬅️ THIS IS THE SLOT: Renders the content of the current nested route (e.g., Dashboard.jsx or Victims.jsx) */}
                <Outlet /> 
            </main>
        </div>
    );
};

// ⬅️ CRITICAL FIX: Use 'export default' to resolve the SyntaxError in App.jsx
export default MainLayout;