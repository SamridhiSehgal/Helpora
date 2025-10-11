import React from "react";
import { Link, Routes, Route, useLocation, Navigate } from "react-router-dom";
import NewRequest from "./NewRequest";
import VictimRequests from "./VictimRequests";

export default function VictimDashboard({ victim }) {
  const location = useLocation();

  const isActive = (path) => {
    if (path === "") return location.pathname === "/victim" || location.pathname === "/victim/";
    return location.pathname.includes(path);
  };

  return (
    <div style={{ display: "flex", minHeight: "80vh", fontFamily: "Arial, sans-serif", background: "#f5f5f5" }}>
      {/* Sidebar */}
      <aside
        style={{
          width: 250,
          background: "#2c3e50",
          color: "#ecf0f1",
          padding: "20px 15px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <div style={{ textAlign: "center", paddingBottom: 15, borderBottom: "2px solid rgba(255,255,255,0.1)" }}>
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: "50%",
              background: "#1abc9c",
              margin: "0 auto 10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 24,
              fontWeight: "bold"
            }}
          >
            {victim?.name?.charAt(0).toUpperCase() || "V"}
          </div>
          <h2 style={{ margin: "0 0 5px 0", fontSize: 18 }}>Victim Portal</h2>
          <p style={{ margin: 0, fontWeight: "500", fontSize: 14 }}>{victim?.name || "Guest"}</p>
        </div>

        <nav style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <Link
            to="/victim"
            style={{
              padding: "12px 15px",
              borderRadius: "8px",
              background: isActive("") && !isActive("/new") && !isActive("/requests") ? "#1abc9c" : "#34495e",
              color: "#ecf0f1",
              textDecoration: "none",
              transition: "all 0.3s",
              fontWeight: 500
            }}
          >
            🏠 Home
          </Link>
          <Link
            to="/victim/new"
            style={{
              padding: "12px 15px",
              borderRadius: "8px",
              background: isActive("/new") ? "#1abc9c" : "#34495e",
              color: "#ecf0f1",
              textDecoration: "none",
              transition: "all 0.3s",
              fontWeight: 500
            }}
          >
            ➕ New Request
          </Link>
          <Link
            to="/victim/requests"
            style={{
              padding: "12px 15px",
              borderRadius: "8px",
              background: isActive("/requests") ? "#1abc9c" : "#34495e",
              color: "#ecf0f1",
              textDecoration: "none",
              transition: "all 0.3s",
              fontWeight: 500
            }}
          >
            📋 My Requests
          </Link>
        </nav>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, padding: "30px", background: "#ecf0f1" }}>
        <Routes>
          {/* Home / Default dashboard */}
          <Route
            index
            element={
              <div>
                {/* Welcome Section */}
                <div
                  style={{
                    textAlign: "center",
                    padding: "30px",
                    background: "#fff",
                    borderRadius: "10px",
                    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                    marginBottom: 25,
                  }}
                >
                  <h2 style={{ color: "#2c3e50", marginBottom: 10 }}>
                    Welcome, {victim?.name || "Guest"}! 👋
                  </h2>
                  <p style={{ color: "#7f8c8d", fontSize: "16px" }}>
                    Here’s a quick overview of your requests and actions you can take.
                  </p>
                </div>

                {/* Dashboard Cards */}
                <div style={{ display: "flex", gap: 20, flexWrap: "wrap", marginBottom: 25 }}>
                  <div
                    style={{
                      flex: "1 1 200px",
                      padding: 20,
                      background: "#1abc9c",
                      color: "#fff",
                      borderRadius: 10,
                      boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
                      cursor: "pointer",
                      transition: "transform 0.2s",
                    }}
                    onClick={() => window.alert("Navigate to New Request")}
                    onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.05)")}
                    onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                  >
                    <h3>Total Requests</h3>
                    <p style={{ fontSize: 28, fontWeight: "bold" }}>5</p>
                  </div>

                  <div
                    style={{
                      flex: "1 1 200px",
                      padding: 20,
                      background: "#3498db",
                      color: "#fff",
                      borderRadius: 10,
                      boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
                      cursor: "pointer",
                      transition: "transform 0.2s",
                    }}
                    onClick={() => window.alert("Navigate to Pending Requests")}
                    onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.05)")}
                    onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                  >
                    <h3>Pending Requests</h3>
                    <p style={{ fontSize: 28, fontWeight: "bold" }}>2</p>
                  </div>

                  <div
                    style={{
                      flex: "1 1 200px",
                      padding: 20,
                      background: "#e74c3c",
                      color: "#fff",
                      borderRadius: 10,
                      boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
                      cursor: "pointer",
                      transition: "transform 0.2s",
                    }}
                    onClick={() => window.alert("Navigate to Resolved Requests")}
                    onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.05)")}
                    onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                  >
                    <h3>Resolved Requests</h3>
                    <p style={{ fontSize: 28, fontWeight: "bold" }}>3</p>
                  </div>
                </div>

                {/* Quick Actions */}
                <div style={{ display: "flex", gap: 15 }}>
                  <Link
                    to="/victim/new"
                    style={{
                      padding: "12px 24px",
                      background: "#1abc9c",
                      color: "#fff",
                      textDecoration: "none",
                      borderRadius: 8,
                      fontWeight: 600,
                    }}
                  >
                    ➕ Create Request
                  </Link>
                  <Link
                    to="/victim/requests"
                    style={{
                      padding: "12px 24px",
                      background: "#3498db",
                      color: "#fff",
                      textDecoration: "none",
                      borderRadius: 8,
                      fontWeight: 600,
                    }}
                  >
                    📋 View Requests
                  </Link>
                </div>
              </div>
            }
          />

          {/* Other Routes */}
          <Route path="new" element={<NewRequest victim={victim} />} />
          <Route path="requests" element={<VictimRequests victim={victim} />} />

          {/* Redirect any unknown path to home */}
          <Route path="*" element={<Navigate to="/victim" replace />} />
        </Routes>
      </main>
    </div>
  );
}
