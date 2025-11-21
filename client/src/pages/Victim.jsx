// src/pages/Victims.jsx
import React, { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import {
  Users,
  Loader,
  AlertTriangle,
  CheckCheck,
  Clock,
  MapPin,
  Phone,
  Search,
  X,
} from "lucide-react";

const STATUS_MAP = {
  Pending: { color: "#ef4444", icon: AlertTriangle, label: "Pending Triage", style: "#ef4444" },
  Assigned: { color: "#3b82f6", icon: Clock, label: "Assigned", style: "#3b82f6" },
  InProgress: { color: "#facc15", icon: Loader, label: "In Progress", style: "#facc15" },
  Fulfilled: { color: "#16a34a", icon: CheckCheck, label: "Fulfilled", style: "#16a34a" },
  Canceled: { color: "#6b7280", icon: X, label: "Canceled", style: "#6b7280" },
};

const URGENCY_LEVELS = ["Critical", "High", "Medium", "Low"];

const Victims = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ requestStatus: "", urgencyLevel: "" });
  const [refreshCounter, setRefreshCounter] = useState(0);

  // Helper: format requiredResources (handles Map-like objects, arrays, or plain objects)
  const formatResources = (reqRes) => {
    if (!reqRes) return [];
    // If it's an array of strings:
    if (Array.isArray(reqRes)) return reqRes;
    // If it's a Map (serialized to object) or object of counts:
    if (typeof reqRes === "object") {
      try {
        // If it's a Map-like (instance of Map), convert:
        if (reqRes instanceof Map) {
          return Array.from(reqRes.entries()).map(([k, v]) => (v != null ? `${k} (${v})` : `${k}`));
        }
        // Otherwise object: keys => value
        return Object.entries(reqRes).map(([k, v]) => (v != null ? `${k} (${v})` : `${k}`));
      } catch (err) {
        return [];
      }
    }
    // fallback
    return [String(reqRes)];
  };

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get("/api/aid-request"); // expects backend GET /api/aid-request

      // Map to UI shape; assume backend populates victimId (or stores victimName on request)
      const requestsMapped = data.map((r) => {
        // victim may be stored as victimName on the request, or populated under victimId
        const victimName = r.victimName || r.victimId?.name || "Anonymous";
        const victimPhone = r.victimPhone || r.victimId?.contactPhone || "N/A";

        const resourcesRequested = formatResources(r.requiredResources);

        const urgencyLevel =
          r.priorityLevel === 4
            ? "Critical"
            : r.priorityLevel === 3
            ? "High"
            : r.priorityLevel === 2
            ? "Medium"
            : "Low";

        const assignedNgoName =
          typeof r.assignedNgoId === "string"
            ? r.assignedNgoId
            : r.assignedNgoId?.name || null;

        const location = r.location?.coordinates
          ? `Lat: ${r.location.coordinates[1]}, Lng: ${r.location.coordinates[0]}`
          : r.location || "N/A";

        return {
          _id: r._id,
          name: victimName,
          contactPhone: victimPhone,
          resourcesRequested,
          urgencyLevel,
          requestStatus: r.requestStatus || "Pending",
          assignedNgoId: assignedNgoName ? { name: assignedNgoName } : null,
          location,
          createdAt: r.createdAt,
        };
      });

      // Apply filters client-side
      let filtered = requestsMapped;
      if (filters.requestStatus) {
        filtered = filtered.filter((x) => x.requestStatus === filters.requestStatus);
      }
      if (filters.urgencyLevel) {
        filtered = filtered.filter((x) => x.urgencyLevel === filters.urgencyLevel);
      }

      setRequests(filtered);
      setError(null);
    } catch (err) {
      console.error("Error fetching aid requests:", err);
      setError("Failed to load aid requests from the backend.");
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, refreshCounter]);

  const handleFilterChange = (e) => setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  // Try to update status on backend; fallback to generic patch if specific endpoint missing
  const handleFulfill = async (requestId) => {
    if (!window.confirm("Mark request as Fulfilled?")) return;
    try {
      // Try dedicated endpoint first
      await axiosInstance.patch(`/api/aid-request/${requestId}/fulfill`);
    } catch (err) {
      // If that fails, try generic patch to update requestStatus
      try {
        await axiosInstance.patch(`/api/aid-request/${requestId}`, { requestStatus: "Fulfilled" });
      } catch (err2) {
        console.error("Failed to mark fulfilled:", err2);
        alert("Failed to update request status. See console for details.");
        return;
      }
    }
    // refresh
    setRefreshCounter((c) => c + 1);
  };

  // Prompt for NGO name and call backend to assign (with fallback)
  const handleAssign = async (requestId) => {
    const ngoName = window.prompt("Enter NGO name to assign to this request:");
    if (!ngoName) return;

    try {
      // Try dedicated endpoint first
      await axiosInstance.patch(`/api/aid-request/${requestId}/assign`, { assignedNgoId: ngoName });
    } catch (err) {
      // fallback to generic update
      try {
        await axiosInstance.patch(`/api/aid-request/${requestId}`, { assignedNgoId: ngoName, requestStatus: "Assigned" });
      } catch (err2) {
        console.error("Failed to assign NGO:", err2);
        alert("Failed to assign NGO. See console for details.");
        return;
      }
    }
    setRefreshCounter((c) => c + 1);
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <Loader className="spin" size={50} />
        <p>Loading Victim Requests...</p>
      </div>
    );
  }

  if (error && requests.length === 0) {
    return (
      <div className="error-box">
        <AlertTriangle className="icon" />
        {error}
      </div>
    );
  }

  return (
    <div className="victims-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;800&display=swap');
        .victims-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%);
          padding: 40px;
          font-family: 'Poppins', sans-serif;
          animation: fadeIn 0.6s ease-in;
        }
        header {
          background: linear-gradient(90deg, #667eea, #764ba2);
          color: white;
          padding: 25px;
          border-radius: 18px;
          box-shadow: 0 6px 18px rgba(0,0,0,0.15);
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 40px;
        }
        header h1 { font-size: 28px; display: flex; align-items: center; }
        header span {
          background: rgba(255,255,255,0.2);
          padding: 8px 20px;
          border-radius: 50px;
          font-weight: 600;
        }
        .filter-bar {
          background: white;
          border-left: 6px solid #667eea;
          border-radius: 15px;
          padding: 20px;
          display: flex;
          gap: 15px;
          align-items: center;
          margin-bottom: 25px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }
        .filter-bar input, .filter-bar select {
          border: 1px solid #ccc;
          padding: 10px;
          border-radius: 10px;
          outline: none;
          transition: all 0.2s;
        }
        .filter-bar input:focus, .filter-bar select:focus {
          border-color: #667eea;
          box-shadow: 0 0 6px rgba(102,126,234,0.5);
        }
        .grid-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 25px;
        }
        .card {
          background: white;
          border-radius: 20px;
          padding: 20px;
          box-shadow: 0 6px 15px rgba(0,0,0,0.08);
          border-left: 6px solid;
          transition: transform 0.3s, box-shadow 0.3s;
        }
        .card:hover { transform: translateY(-6px); box-shadow: 0 10px 25px rgba(102,126,234,0.2); }
        .card h2 { color: #222; margin-bottom: 8px; font-size: 20px; }
        .card strong { color: #333; }
        .status-tag {
          padding: 4px 12px;
          border-radius: 50px;
          font-size: 12px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 5px;
          width: fit-content;
          margin-top: 5px;
          color: white;
        }
        .btn { padding: 10px; font-weight: 600; border-radius: 8px; border: none; color: white; cursor: pointer; transition: all 0.2s; }
        .btn-assign { background: #3b82f6; }
        .btn-assign:hover { background: #2563eb; }
        .btn-fulfill { background: #16a34a; }
        .btn-fulfill:hover { background: #15803d; }
        .loading-screen, .error-box { display: flex; flex-direction: column; justify-content: center; align-items: center; height: 80vh; font-weight: 600; color: #667eea; }
        .error-box { background: #fee2e2; color: #b91c1c; padding: 20px; border-radius: 10px; }
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media (max-width: 768px) { .victims-page { padding: 20px; } .filter-bar { flex-direction: column; align-items: stretch; } }
      `}</style>

      <header>
        <h1>
          <Users size={30} className="mr-3" /> Victim Aid Requests Dashboard
        </h1>
        <span>{requests.length} Active Requests</span>
      </header>

      <div className="filter-bar">
        <Search size={20} color="#667eea" />
        <input type="text" placeholder="Search by name or contact..." style={{ flexGrow: 1 }} />

        <select name="requestStatus" value={filters.requestStatus} onChange={handleFilterChange}>
          <option value="">All Statuses</option>
          {Object.keys(STATUS_MAP).map((key) => (
            <option key={key} value={key}>{STATUS_MAP[key].label}</option>
          ))}
        </select>

        <select name="urgencyLevel" value={filters.urgencyLevel} onChange={handleFilterChange}>
          <option value="">All Urgencies</option>
          {URGENCY_LEVELS.map((level) => <option key={level} value={level}>{level}</option>)}
        </select>
      </div>

      <div className="grid-container">
        {requests.length > 0 ? requests.map((r) => {
          const s = STATUS_MAP[r.requestStatus] || STATUS_MAP["Pending"];
          const assignedNgoName = r.assignedNgoId ? r.assignedNgoId.name : "Awaiting Assignment";
          return (
            <div key={r._id} className="card" style={{ borderColor: s.style }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <p style={{ fontSize: "12px", color: "#aaa" }}>Request ID: {r._id.substring(0, 8)}</p>
                  <h2 style={{ color: "#667eea" }}>{r.name}</h2>
                  <div className="status-tag" style={{ background: s.color }}>
                    <s.icon size={14} style={{ color: "white" }} /> {s.label}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontWeight: "600", color: r.urgencyLevel === "Critical" ? "#ef4444" : "#f59e0b" }}>
                    {r.urgencyLevel} Priority
                  </p>
                  <p style={{ fontSize: "12px", marginTop: "5px" }}>Received: {new Date(r.createdAt).toLocaleTimeString()}</p>
                </div>
              </div>

              <div style={{ marginTop: "15px", padding: "15px 0", borderTop: "1px solid #eee" }}>
                <p style={{ display: "flex", alignItems: "center", marginBottom: "5px" }}>
                  <Phone size={14} style={{ marginRight: "8px", color: "#764ba2" }} /> {r.contactPhone}
                </p>
                <p style={{ display: "flex", alignItems: "center", marginBottom: "5px" }}>
                  <MapPin size={14} style={{ marginRight: "8px", color: "#764ba2" }} /> {r.location}
                </p>
                <p style={{ fontSize: "14px" }}>
                  <strong>Needs:</strong> {r.resourcesRequested.length ? r.resourcesRequested.join(", ") : "N/A"}
                </p>
                <p style={{ fontSize: "14px", marginTop: "8px" }}>
                  <strong>Assigned To:</strong>{" "}
                  <span style={{ color: "#4f46e5", fontWeight: "600" }}>{assignedNgoName}</span>
                </p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginTop: "15px" }}>
                {r.requestStatus !== "Fulfilled" && (
                  <button className="btn btn-fulfill" onClick={() => handleFulfill(r._id)}>Mark Fulfilled</button>
                )}
                {(r.requestStatus === "Pending" || r.requestStatus === "Canceled") && (
                  <button className="btn btn-assign" onClick={() => handleAssign(r._id)}>Manual Assign</button>
                )}
              </div>
            </div>
          );
        }) : (
          <div className="error-box" style={{ height: "100px", gridColumn: "1 / -1" }}>
            No active aid requests found matching current filters.
          </div>
        )}
      </div>
    </div>
  );
};

export default Victims;
