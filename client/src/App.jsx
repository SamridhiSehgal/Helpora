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
import RequestStatus from './pages/victim/RequestStatus';
import RequestForm from './pages/victim/RequestForm';
import Chatbot from './pages/victim/Chatbot';
import FulfillmentTracker from './pages/ngo/FulfillmentTracker';
import IncomingRequests from './pages/ngo/IncomingRequests';
import NGODashboard from './pages/ngo/NGODashboard';
import ResourceUpdate from './pages/ngo/ResourceUpdate';

const App = () => {
  return (
    <div>
      <Navbar />
      <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/about' element={<About />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          { <Route path='/victim/dashboard' element={<VictimDashboard />} /> }
          { <Route path='/victim/request-status' element={<RequestStatus />} /> }
          { <Route path='/victim/request-form' element={<RequestForm />} /> }
          { <Route path='/victim/chatbot' element={<Chatbot />} /> }
          { <Route path='/ngo/dashboard' element={<NGODashboard />} /> }
          {<Route path='/ngo/incoming-requests' element={<IncomingRequests />} /> }
          { <Route path='/ngo/fulfillment-tracker' element={<FulfillmentTracker />} /> }
          { <Route path='/ngo/resource-update' element={<ResourceUpdate />} /> }
        </Routes>
      </div>
    </div>
  );
};

export default App;
