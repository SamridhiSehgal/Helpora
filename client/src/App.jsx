import { Routes, Route } from 'react-router-dom';

// Services
import ProtectedRoute from './components/ProtectedRoute';
import StatusViewer from './pages/StatusViewer';
// Layout
import MainLayout from './layouts/MainLayout';

// Public Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import AidRequestForm from './pages/AidRequestForm';

// Authenticated Pages
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import Shelters from './pages/Shelters';



import Victims from './pages/Victim';
function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/aid-request" element={<AidRequestForm />} />
      <Route path="/victims" element={<Victims />} />
      <Route path="/status/:id/:token" element={<StatusViewer />} />
      {/* Protected NGO Routes: Routed through ProtectedRoute and MainLayout */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/shelters" element={<Shelters />} />
           <Route path="/victims" element={<Victims />} />
        </Route>
      </Route>
      
      {/* Catch-all/404 Page */}
      <Route path="*" element={<div className="flex h-screen items-center justify-center text-3xl font-bold text-gray-700">404 | Page Not Found</div>} />
    </Routes>
  );
}

export default App;