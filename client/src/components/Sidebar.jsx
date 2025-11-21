// src/components/Sidebar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Box, Shield, Users, LogOut } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Inventory', path: '/inventory', icon: Box },
    { name: 'Shelters', path: '/shelters', icon: Shield },
    { name: 'Victims/Requests', path: '/victims', icon: Users },
  ];

  return (
    <>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .sidebar {
          width: 250px;
          background: linear-gradient(180deg, #1a1a2e 0%, #16213e 100%);
          color: #fff;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 20px;
          box-shadow: 4px 0 15px rgba(0, 0, 0, 0.3);
          position: relative;
          overflow: hidden;
        }

        .sidebar::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(103,126,234,0.08) 0%, transparent 70%);
          animation: rotate 25s linear infinite;
          z-index: 0;
        }

        @keyframes rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .sidebar-content {
          position: relative;
          z-index: 1;
        }

        .sidebar-title {
          font-size: 22px;
          font-weight: 800;
          text-align: center;
          margin-bottom: 30px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          letter-spacing: 0.5px;
        }

        .nav {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .nav-link {
          display: flex;
          align-items: center;
          padding: 12px 16px;
          text-decoration: none;
          color: #cbd5e0;
          border-radius: 10px;
          transition: all 0.3s ease;
          position: relative;
        }

        .nav-link:hover {
          background: rgba(103,126,234,0.15);
          color: #fff;
          transform: translateX(4px);
        }

        .nav-link.active {
          background: linear-gradient(135deg, rgba(103,126,234,0.3), rgba(118,75,162,0.3));
          color: #fff;
          font-weight: 600;
          box-shadow: 0 0 12px rgba(103,126,234,0.3);
        }

        .nav-icon {
          margin-right: 12px;
          color: #a0aec0;
          transition: all 0.3s ease;
        }

        .nav-link:hover .nav-icon {
          color: #fff;
          transform: scale(1.1);
        }

        .nav-link.active .nav-icon {
          color: #667eea;
          filter: drop-shadow(0 0 6px #667eea);
        }

        .logout {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid rgba(103,126,234,0.2);
        }

        .logout-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          padding: 12px 16px;
          background: rgba(239,68,68,0.1);
          border: none;
          color: #fc8181;
          font-weight: 600;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .logout-btn:hover {
          background: rgba(239,68,68,0.2);
          color: #ffb4b4;
          transform: translateY(-2px);
        }

        .logout-icon {
          margin-right: 10px;
          transition: transform 0.3s ease;
        }

        .logout-btn:hover .logout-icon {
          transform: translateX(4px);
        }

      `}</style>

      <div className="sidebar">
        <div className="sidebar-content">
          <h1 className="sidebar-title">Helpora NGO</h1>
          <nav className="nav">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`nav-link ${
                  location.pathname === item.path ? 'active' : ''
                }`}
              >
                <item.icon size={20} className="nav-icon" />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="logout">
          <button
            onClick={() => {
              /* implement logout here */
            }}
            className="logout-btn"
          >
            <LogOut size={20} className="logout-icon" />
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
