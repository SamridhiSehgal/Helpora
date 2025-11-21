import React, { useState, useEffect } from "react";
import { Loader, AlertTriangle, Box, Shield, Users, BarChart } from "lucide-react";

// Mock axiosInstance for demo
const axiosInstance = {
  get: async () => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    return {
      data: {
        profileName: "Hope Foundation",
        pendingRequests: 247,
        availableResources: 12450,
        shelterCapacity: 850,
        criticalZones: 3
      }
    };
  }
};

const SummaryCard = ({ title, value, icon: Icon, colorClass, description }) => (
  <div className={`summary-card ${colorClass}`}>
    <div className="card-icon-bg">
      <Icon size={120} />
    </div>
    <div className="card-content">
      <div className="card-icon-container">
        <Icon size={32} />
      </div>
      <h3 className="card-title">{title}</h3>
      <p className="card-value">{value}</p>
      <p className="card-description">{description}</p>
    </div>
    <div className="card-shine"></div>
  </div>
);

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const profileName = summary?.profileName || "NGO Partner";

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await axiosInstance.get("ngo/dashboard/summary");
        setSummary(response.data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch dashboard summary:", err);
        const errorMsg =
          err.response?.data?.message ||
          "Could not load dashboard data. Authentication or Server error.";
        setError(errorMsg);
        setSummary(null);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  if (loading) {
    return (
      <>
        <style>{`
          @keyframes spinLoader {
            to { transform: rotate(360deg); }
          }
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
          @keyframes ping {
            75%, 100% {
              transform: scale(2);
              opacity: 0;
            }
          }
          .loading-container {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            position: relative;
            overflow: hidden;
          }
          .loading-container::before {
            content: '';
            position: absolute;
            width: 400px;
            height: 400px;
            background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
            border-radius: 50%;
            animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
          }
          .loader-icon {
            animation: spinLoader 1s linear infinite;
            color: white;
            filter: drop-shadow(0 0 20px rgba(255,255,255,0.5));
            position: relative;
            z-index: 10;
          }
          .loading-text {
            margin-top: 24px;
            font-size: 24px;
            color: white;
            font-weight: 600;
            animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
            position: relative;
            z-index: 10;
            text-shadow: 0 2px 10px rgba(0,0,0,0.3);
          }
        `}</style>
        <div className="loading-container">
          <Loader className="loader-icon" size={64} />
          <p className="loading-text">Loading your dashboard...</p>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <style>{`
          .error-container {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            padding: 32px;
          }
          .error-card {
            max-width: 600px;
            background: white;
            border-radius: 24px;
            overflow: hidden;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            animation: slideDown 0.5s ease-out;
          }
          @keyframes slideDown {
            from {
              opacity: 0;
              transform: translateY(-30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .error-header {
            background: linear-gradient(135deg, #f5576c 0%, #e53935 100%);
            padding: 32px;
            display: flex;
            align-items: center;
            gap: 16px;
            color: white;
          }
          .error-body {
            padding: 32px;
          }
          .error-title {
            font-size: 28px;
            font-weight: 700;
            margin: 0;
          }
          .error-message {
            font-size: 18px;
            color: #333;
            margin-bottom: 16px;
            line-height: 1.6;
          }
          .error-hint {
            color: #666;
            font-size: 14px;
          }
        `}</style>
        <div className="error-container">
          <div className="error-card">
            <div className="error-header">
              <AlertTriangle size={48} />
              <h2 className="error-title">Unable to Load Dashboard</h2>
            </div>
            <div className="error-body">
              <p className="error-message">{error}</p>
              <p className="error-hint">
                Please verify your network connection and server status, then refresh the page.
              </p>
            </div>
          </div>
        </div>
      </>
    );
  }

  const data = summary || {};

  return (
    <>
      <style>{`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
        }

        .dashboard-wrapper {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          position: relative;
          overflow-x: hidden;
        }

        .dashboard-wrapper::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -50%;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
          border-radius: 50%;
        }

        .dashboard-wrapper::after {
          content: '';
          position: absolute;
          bottom: -50%;
          left: -50%;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%);
          border-radius: 50%;
        }

        .dashboard-main {
          max-width: 1400px;
          margin: 0 auto;
          padding: 40px 24px;
          position: relative;
          z-index: 1;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }

        .welcome-section {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 32px;
          padding: 48px;
          margin-bottom: 40px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.3);
          animation: fadeInUp 0.6s ease-out;
          position: relative;
          overflow: hidden;
        }

        .welcome-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          animation: shimmer 3s infinite;
        }

        .welcome-title {
          font-size: 48px;
          font-weight: 800;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 16px;
          position: relative;
        }

        .welcome-subtitle {
          font-size: 20px;
          color: #666;
          font-weight: 500;
        }

        .status-badge {
          position: absolute;
          top: 48px;
          right: 48px;
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(76, 175, 80, 0.1);
          padding: 12px 20px;
          border-radius: 50px;
          border: 2px solid #4caf50;
        }

        .status-dot {
          width: 12px;
          height: 12px;
          background: #4caf50;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.1);
          }
        }

        .status-text {
          font-size: 14px;
          font-weight: 600;
          color: #4caf50;
        }

        .cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
          margin-bottom: 40px;
          animation: fadeInUp 0.8s ease-out;
        }

        .summary-card {
          background: white;
          border-radius: 24px;
          padding: 32px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
          position: relative;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          cursor: pointer;
        }

        .summary-card:hover {
          transform: translateY(-12px) scale(1.02);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }

        .summary-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 6px;
          background: linear-gradient(90deg, transparent, currentColor, transparent);
          opacity: 0;
          transition: opacity 0.4s;
        }

        .summary-card:hover::before {
          opacity: 1;
        }

        .summary-card.bg-red-500 {
          color: #ef4444;
        }

        .summary-card.bg-green-500 {
          color: #10b981;
        }

        .summary-card.bg-blue-500 {
          color: #3b82f6;
        }

        .summary-card.bg-yellow-500 {
          color: #f59e0b;
        }

        .card-icon-bg {
          position: absolute;
          top: -20px;
          right: -20px;
          opacity: 0.05;
          transition: all 0.4s;
        }

        .summary-card:hover .card-icon-bg {
          opacity: 0.1;
          transform: rotate(15deg) scale(1.1);
        }

        .card-content {
          position: relative;
          z-index: 2;
        }

        .card-icon-container {
          width: 64px;
          height: 64px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
          background: currentColor;
          color: white;
          transition: all 0.4s;
        }

        .summary-card:hover .card-icon-container {
          transform: scale(1.1) rotate(5deg);
          box-shadow: 0 8px 24px currentColor;
        }

        .card-title {
          font-size: 14px;
          color: #666;
          font-weight: 600;
          margin-bottom: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .card-value {
          font-size: 42px;
          font-weight: 800;
          color: #1a1a1a;
          margin-bottom: 8px;
          transition: all 0.4s;
        }

        .summary-card:hover .card-value {
          transform: scale(1.05);
        }

        .card-description {
          font-size: 13px;
          color: #999;
          line-height: 1.5;
        }

        .card-shine {
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%);
          transform: rotate(45deg);
          transition: all 0.6s;
          opacity: 0;
        }

        .summary-card:hover .card-shine {
          opacity: 1;
          left: 100%;
        }

        .feed-section {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 32px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.3);
          animation: fadeInUp 1s ease-out;
        }

        .feed-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 32px;
          display: flex;
          align-items: center;
          gap: 16px;
          color: white;
        }

        .feed-icon-container {
          width: 56px;
          height: 56px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(10px);
          animation: float 3s ease-in-out infinite;
        }

        .feed-header-text h2 {
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 4px;
        }

        .feed-header-text p {
          font-size: 14px;
          opacity: 0.9;
        }

        .feed-content {
          padding: 32px;
        }

        .feed-items {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .feed-item {
          border-radius: 20px;
          padding: 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }

        .feed-item::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 6px;
          transition: width 0.3s;
        }

        .feed-item:hover {
          transform: translateX(8px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
        }

        .feed-item:hover::before {
          width: 100%;
          opacity: 0.1;
        }

        .feed-critical {
          background: linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%);
          border-left: 6px solid #ef4444;
        }

        .feed-critical::before {
          background: #ef4444;
        }

        .feed-success {
          background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
          border-left: 6px solid #10b981;
        }

        .feed-success::before {
          background: #10b981;
        }

        .feed-action {
          background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
          border-left: 6px solid #3b82f6;
        }

        .feed-action::before {
          background: #3b82f6;
        }

        .feed-item-content {
          flex: 1;
        }

        .feed-badge {
          display: inline-flex;
          padding: 6px 14px;
          border-radius: 50px;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 8px;
        }

        .feed-critical .feed-badge {
          background: #ef4444;
          color: white;
        }

        .feed-success .feed-badge {
          background: #10b981;
          color: white;
        }

        .feed-action .feed-badge {
          background: #3b82f6;
          color: white;
        }

        .feed-text {
          font-size: 16px;
          color: #333;
          font-weight: 500;
          line-height: 1.6;
        }

        .feed-time {
          background: rgba(255, 255, 255, 0.9);
          padding: 8px 16px;
          border-radius: 50px;
          font-size: 13px;
          font-weight: 600;
          white-space: nowrap;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .feed-critical .feed-time {
          color: #ef4444;
        }

        .feed-success .feed-time {
          color: #10b981;
        }

        .feed-action .feed-time {
          color: #3b82f6;
        }

        @media (max-width: 768px) {
          .dashboard-main {
            padding: 24px 16px;
          }

          .welcome-section {
            padding: 32px 24px;
          }

          .welcome-title {
            font-size: 32px;
          }

          .welcome-subtitle {
            font-size: 16px;
          }

          .status-badge {
            position: static;
            margin-top: 20px;
            display: inline-flex;
          }

          .cards-grid {
            grid-template-columns: 1fr;
          }

          .feed-item {
            flex-direction: column;
            align-items: flex-start;
          }

          .feed-time {
            align-self: flex-end;
          }
        }
      `}</style>

      <div className="dashboard-wrapper">
        <main className="dashboard-main">
          {/* Welcome Section */}
          <div className="welcome-section">
            <h1 className="welcome-title">
              Welcome back, {profileName} 👋
            </h1>
            <p className="welcome-subtitle">
              Monitor your operations and manage resources in real-time
            </p>
            <div className="status-badge">
              <div className="status-dot"></div>
              <span className="status-text">System Operational</span>
            </div>
          </div>

          {/* Summary Cards Grid */}
          <div className="cards-grid">
            <SummaryCard
              title="Pending Aid Requests"
              value={data.pendingRequests?.toLocaleString() || 0}
              icon={AlertTriangle}
              colorClass="bg-red-500"
              description="Immediate attention required"
            />
            <SummaryCard
              title="Available Resources"
              value={data.availableResources?.toLocaleString() || 0}
              icon={Box}
              colorClass="bg-green-500"
              description="Total summed quantity of inventory items"
            />
            <SummaryCard
              title="Total Shelter Capacity"
              value={data.shelterCapacity?.toLocaleString() || 0}
              icon={Shield}
              colorClass="bg-blue-500"
              description="Total available beds across all open shelters"
            />
            <SummaryCard
              title="Active Critical Zones"
              value={data.criticalZones?.toLocaleString() || 0}
              icon={Users}
              colorClass="bg-yellow-500"
              description="High priority areas needing resources"
            />
          </div>

          {/* Live Feed Section */}
          <section className="feed-section">
            <div className="feed-header">
              <div className="feed-icon-container">
                <BarChart size={32} />
              </div>
              <div className="feed-header-text">
                <h2>Live Operational Feed</h2>
                <p>Real-time updates from the field</p>
              </div>
            </div>

            <div className="feed-content">
              <div className="feed-items">
                <div className="feed-item feed-critical">
                  <div className="feed-item-content">
                    <span className="feed-badge">Critical</span>
                    <p className="feed-text">
                      Shelter S003 is at 100% occupancy. Divert all new requests.
                    </p>
                  </div>
                  <span className="feed-time">1 min ago</span>
                </div>

                <div className="feed-item feed-success">
                  <div className="feed-item-content">
                    <span className="feed-badge">Resource Update</span>
                    <p className="feed-text">
                      500 units of blankets received at central warehouse.
                    </p>
                  </div>
                  <span className="feed-time">1 hour ago</span>
                </div>

                <div className="feed-item feed-action">
                  <div className="feed-item-content">
                    <span className="feed-badge">Action</span>
                    <p className="feed-text">
                      Team Alpha dispatched to Critical Zone 2.
                    </p>
                  </div>
                  <span className="feed-time">3 hours ago</span>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

export default Dashboard;