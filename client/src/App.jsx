import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './index.css';
import Navbar from './components/Navbar/Navbar';
import HomePage from './pages/public/HomePage';
import About from './pages/public/About';
import Contact from './pages/public/Contact';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import VictimDashboard from './pages/victim/VictimDashboard';
import NGODashboard from './pages/ngo/NGODashboard';
import IncomingRequests from './pages/ngo/IncomingRequests';
import FulfillmentTracker from './pages/ngo/FulfillmentTracker';
import ResourceUpdate from './pages/ngo/ResourceUpdate';
import Footer from './components/Footer/Footer';
const App = () => {
  // Mock victim data - replace with actual authentication
  const victim = {
    id: "victim123",
    name: "John Doe",
    email: "john@example.com"
  };

  return (
    <div>
      <Navbar />
      <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
        <Routes>
          {/* Public Routes */}
          <Route path='/' element={<HomePage />} />
          <Route path='/about' element={<About />} />
          <Route path='/contact' element={<Contact />} />
          
          {/* Auth Routes */}
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          
          {/* Victim Routes - All handled by VictimDashboard */}
          <Route path='/victim/*' element={<VictimDashboard victim={victim} />} />
          
          {/* NGO Routes */}
          <Route path='/ngo/dashboard' element={<NGODashboard />} />
          <Route path='/ngo/incoming-requests' element={<IncomingRequests />} />
          <Route path='/ngo/fulfillment-tracker' element={<FulfillmentTracker />} />
          <Route path='/ngo/resource-update' element={<ResourceUpdate />} />
        </Routes>
         <Footer />
      <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'></div>
      </div>
    </div>
  );
};

export default App;