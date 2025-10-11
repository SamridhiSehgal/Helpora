import React from "react";
import { Link, Routes, Route } from "react-router-dom";
import NewRequest from "./NewRequest";
import VictimRequests from "./VictimRequests";


export default function VictimDashboard({ victim }) {
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
        <div style={{ textAlign: "center" }}>
          <h2 style={{ margin: 0 }}>Victim</h2>
          <p style={{ margin: "5px 0", fontWeight: "bold" }}>{victim?.name || "Guest"}</p>
        </div>

        <nav style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <Link
            to=""
            style={{
              padding: "10px 15px",
              borderRadius: "8px",
              background: "#34495e",
              color: "#ecf0f1",
              textDecoration: "none",
              transition: "all 0.3s",
            }}
          >
            Home
          </Link>
          <Link
            to="new"
            style={{
              padding: "10px 15px",
              borderRadius: "8px",
              background: "#34495e",
              color: "#ecf0f1",
              textDecoration: "none",
              transition: "all 0.3s",
            }}
          >
            New Request
          </Link>
          <Link
            to="requests"
            style={{
              padding: "10px 15px",
              borderRadius: "8px",
              background: "#34495e",
              color: "#ecf0f1",
              textDecoration: "none",
              transition: "all 0.3s",
            }}
          >
            My Requests
          </Link>
          
        </nav>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, padding: "30px", background: "#ecf0f1", borderRadius: "0 10px 10px 0" }}>
        <Routes>
          <Route
            index
            element={
              <div
                style={{
                  textAlign: "center",
                  padding: "50px",
                  background: "#fff",
                  borderRadius: "10px",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                }}
              >
                <h2 style={{ color: "#2c3e50" }}>Welcome, {victim?.name || "Guest"}!</h2>
                <p style={{ color: "#7f8c8d", fontSize: "16px" }}>
                  Use the left menu to create a new request or track your existing requests.
                </p>
              </div>
            }
          />
          <Route path="new" element={<NewRequest victim={victim} />} />
          <Route path="requests" element={<VictimRequests victim={victim} />} />
          
          
        </Routes>
      </main>
    </div>
  );
}
