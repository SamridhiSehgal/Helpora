// src/pages/StatusViewer.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Loader, AlertTriangle, Clock, ShieldCheck } from "lucide-react";

// Status styling
const STATUS_MAP = {
  Loading: { color: "#6366f1", bg: "#eef2ff", label: "Processing Request..." },
  Pending: { color: "#eab308", bg: "#fef9c3", label: "Pending Triage" },
  Assigned: { color: "#16a34a", bg: "#dcfce7", label: "Assignment Confirmed" },
  Fulfilled: { color: "#10b981", bg: "#d1fae5", label: "Fulfilled" },
  Canceled: { color: "#dc2626", bg: "#fee2e2", label: "Canceled" },
  Error: { color: "#dc2626", bg: "#fee2e2", label: "Tracking Failed" },
};

const StatusViewer = () => {
  const { id, token } = useParams();
  const [requestData, setRequestData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:4000/api/aid-request/${id}/${token}`);
        const data = res.data;

        // Convert requiredResources Map/Object to an array of resource names
        const resourcesRequested = data.requiredResources
          ? Object.keys(data.requiredResources)
          : [];

        setRequestData({
          requestStatus: data.requestStatus || "Pending",
          victimName: data.victimId?.name || "Anonymous",
          victimPhone: data.victimId?.contactPhone || "N/A",
          location: data.location?.coordinates
            ? `Lat: ${data.location.coordinates[1]}, Lng: ${data.location.coordinates[0]}`
            : "N/A",
          resourcesRequested,
          priorityLevel: data.priorityLevel,
          assignedPartner: data.assignedNgoId || null,
          createdAt: data.createdAt,
        });
      } catch (err) {
        console.error(err);
        setError("Failed to load aid request.");
      } finally {
        setLoading(false);
      }
    };

    fetchRequest();
  }, [id, token]);

  if (loading) {
    return (
      <div style={{
        display: "flex", flexDirection: "column", justifyContent: "center",
        alignItems: "center", height: "100vh", background: "#f3f4f6"
      }}>
        <Loader className="animate-spin" size={36} />
        <p style={{ marginTop: "12px", fontWeight: "600", fontSize: "1.2rem" }}>
          Loading Aid Request...
        </p>
      </div>
    );
  }

  if (error || !requestData) {
    return (
      <div style={{
        display: "flex", justifyContent: "center", alignItems: "center",
        height: "100vh", color: "red", fontWeight: "600"
      }}>
        <AlertTriangle size={36} />
        <span style={{ marginLeft: "10px" }}>{error || "Aid request not found."}</span>
      </div>
    );
  }

  const currentStatus = requestData.requestStatus;
  const statusStyle = STATUS_MAP[currentStatus] || STATUS_MAP.Error;

  return (
    <div style={{ padding: "40px", minHeight: "100vh", background: "#f3f4f6" }}>
      <div style={{
        maxWidth: "700px",
        margin: "0 auto",
        background: "white",
        borderRadius: "20px",
        borderTop: `6px solid ${statusStyle.color}`,
        padding: "30px",
        boxShadow: "0 10px 40px rgba(0,0,0,0.05)"
      }}>
        <h1 style={{ fontSize: "28px", marginBottom: "20px", fontWeight: 800 }}>
          Aid Request Status Tracker
        </h1>

        {/* Status bar */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          background: statusStyle.bg,
          padding: "10px",
          borderRadius: "12px",
        }}>
          <ShieldCheck size={28} color={statusStyle.color} />
          <h2 style={{ color: statusStyle.color, fontWeight: "700" }}>{statusStyle.label}</h2>
        </div>

        {/* Request details */}
        <div style={{ marginTop: "25px", lineHeight: "1.6" }}>
          <p><strong>Request ID:</strong> {id}</p>
          <p><strong>Submitted By:</strong> {requestData.victimName}</p>
          <p><strong>Contact Phone:</strong> {requestData.victimPhone}</p>
          <p><strong>Location:</strong> {requestData.location}</p>
          <p><strong>Submitted On:</strong> {new Date(requestData.createdAt).toLocaleString()}</p>
          <p><strong>Priority Level:</strong> {requestData.priorityLevel}</p>
          <p><strong>Resources Requested:</strong> {requestData.resourcesRequested.join(", ")}</p>

          {requestData.assignedPartner && (
            <div style={{
              marginTop: "15px",
              padding: "15px",
              background: "#dcfce7",
              borderRadius: "8px",
              borderLeft: "4px solid #16a34a"
            }}>
              <strong>✅ Assignment Confirmed:</strong> {requestData.assignedPartner}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatusViewer;
