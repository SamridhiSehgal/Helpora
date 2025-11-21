import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { LogOut, Home, Box, ShieldCheck, Heart } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();

  const navLinks = [
    { to: '/dashboard', icon: Home, label: 'Dashboard' },
    { to: '/inventory', icon: Box, label: 'Inventory' },
    { to: '/shelters', icon: ShieldCheck, label: 'Shelters' },
  ];

  return (
    <header className="bg-helpora-blue shadow-xl sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/dashboard" className="text-2xl font-extrabold text-white tracking-wider hover:text-helpora-yellow transition">
          <Heart size={24} className="inline mr-2" />
          Helpora
        </Link>
        
        <nav className="hidden md:flex space-x-6 items-center">
          {navLinks.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => 
                `flex items-center space-x-2 text-white text-sm font-medium transition duration-150 ease-in-out px-2 py-1 rounded-md ${
                  isActive ? 'bg-helpora-blue/80 border-b-2 border-helpora-yellow shadow-inner' : 'hover:bg-helpora-blue/80'
                }`
              }
            >
              <link.icon size={18} />
              <span>{link.label}</span>
            </NavLink>
          ))}
          
          <div className="flex items-center space-x-4 ml-6 pl-4 border-l border-white/20">
            <span className="text-gray-200 text-sm italic">
              Welcome, {user?.name || 'NGO Admin'}
            </span>
            <button
              onClick={logout}
              className="flex items-center space-x-2 px-3 py-1 bg-helpora-red text-white text-sm rounded-lg shadow-md hover:bg-red-700 transition duration-150 transform hover:scale-[1.05]"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </nav>

        {/* Mobile: Always show logout button */}
        <button onClick={logout} className="md:hidden text-white p-2 rounded-lg bg-helpora-red">
             <LogOut size={24} />
        </button>
      </div>
    </header>
  );
};

export default Navbar;