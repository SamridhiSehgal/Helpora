import React, { useState } from "react";
import { Send, User, Phone, MapPin, CheckCircle, Loader, AlertTriangle } from "lucide-react";

const RESOURCE_OPTIONS = ['Food', 'Water', 'Medical Aid', 'Shelter', 'Clothing', 'Other'];
const URGENCY_LEVELS = ['Critical', 'High', 'Medium', 'Low'];

const AidRequestForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    contactPhone: "",
    location: "", // store as "lat, lng" string
    urgencyLevel: "High",
    resourcesRequested: [],
    description: "",
  });

  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  // Generic change handler (works for name, contactPhone, location, urgencyLevel, description)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleResourceChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      resourcesRequested: checked
        ? [...prev.resourcesRequested, value]
        : prev.resourcesRequested.filter((r) => r !== value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    // Validate basic fields first
    if (!formData.name?.trim()) {
      setStatus({ type: "error", msg: "⚠️ Please enter your name." });
      setLoading(false);
      return;
    }
    if (!formData.contactPhone?.trim()) {
      setStatus({ type: "error", msg: "⚠️ Please enter a contact phone." });
      setLoading(false);
      return;
    }
    if (!formData.resourcesRequested || formData.resourcesRequested.length === 0) {
      setStatus({ type: "error", msg: "⚠️ Please select at least one resource." });
      setLoading(false);
      return;
    }
    if (!formData.location?.trim()) {
      setStatus({ type: "error", msg: "⚠️ Please enter location in lat,lng format." });
      setLoading(false);
      return;
    }

    // Parse location string "lat, lng" -> coordinates [lng, lat]
    const parts = formData.location.split(",").map((p) => p.trim());
    if (parts.length !== 2) {
      setStatus({ type: "error", msg: "⚠️ Invalid location format. Use: lat, lng" });
      setLoading(false);
      return;
    }
    const lat = parseFloat(parts[0]);
    const lng = parseFloat(parts[1]);
    if (Number.isNaN(lat) || Number.isNaN(lng)) {
      setStatus({ type: "error", msg: "⚠️ Invalid numeric values for location." });
      setLoading(false);
      return;
    }
    const coordinates = [lng, lat]; // GeoJSON expects [lng, lat]

    try {
      const body = {
        victimName: formData.name.trim(),
        victimPhone: formData.contactPhone.trim(),
        description: formData.description?.trim() || "",
        requiredResources: Object.fromEntries(
          formData.resourcesRequested.map((r) => [r, 1])
        ),
        location: { type: "Point", coordinates },
        priorityLevel: URGENCY_LEVELS.indexOf(formData.urgencyLevel) + 1,
      };

      const response = await fetch("http://localhost:4000/api/aid-request/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        let errMsg = "Request failed";
        try {
          const errData = await response.json();
          errMsg = errData.error || errData.message || errMsg;
        } catch (_) { /* ignore parse errors */ }
        throw new Error(errMsg);
      }

      const data = await response.json();
      setStatus({
        type: "success",
        msg: "✅ Request submitted successfully!",
        id: data.request._id,
        token: data.request.trackingToken,
      });

      // Reset form (keep same initial structure)
      setFormData({
        name: "",
        contactPhone: "",
        location: "",
        urgencyLevel: "High",
        resourcesRequested: [],
        description: "",
      });
    } catch (err) {
      console.error("Error submitting request:", err);
      setStatus({ type: "error", msg: `❌ ${err.message}` });
    } finally {
      setLoading(false);
    }
  };

  if (status?.type === "success") {
    const link = `${window.location.origin}/status/${status.id}/${status.token}`;
    return (
      <div className="success-card">
        <style>{`
          body {
            background: linear-gradient(135deg, #e7c6ff, #fff0f9);
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            font-family: 'Poppins', sans-serif;
            margin: 0;
          }
          .success-card {
            background: rgba(255, 255, 255, 0.3);
            padding: 50px 60px;
            border-radius: 20px;
            box-shadow: 0 8px 30px rgba(123, 47, 247, 0.25);
            text-align: center;
            backdrop-filter: blur(12px);
          }
          h2 {
            color: #6a00f4;
            margin-bottom: 15px;
          }
          a {
            color: #7b2ff7;
            text-decoration: underline;
            font-weight: 600;
            word-break: break-all;
          }
        `}</style>
        <h2><CheckCircle size={28} /> Request Submitted</h2>
        <p>{status.msg}</p>
        <p><strong>Tracking Link:</strong><br /><a href={link}>{link}</a></p>
      </div>
    );
  }

  return (
    <div className="form-container">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');

        body {
          background: linear-gradient(135deg, #e7c6ff, #fff0f9);
          font-family: 'Poppins', sans-serif;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          margin: 0;
        }

        .form-container {
          width: 500px;
          background: rgba(255, 255, 255, 0.25);
          backdrop-filter: blur(15px);
          border-radius: 20px;
          padding: 40px 50px;
          box-shadow: 0 8px 30px rgba(123, 47, 247, 0.2);
          color: #4a276f;
        }

        h2 {
          text-align: center;
          font-size: 28px;
          background: linear-gradient(90deg, #7b2ff7, #f107a3);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 30px;
        }

        label {
          display: block;
          font-weight: 600;
          margin-bottom: 8px;
          color: #472c73;
        }

        input, textarea, select {
          width: 100%;
          padding: 12px 15px;
          margin-bottom: 20px;
          border: none;
          border-radius: 12px;
          background: rgba(255,255,255,0.85);
          font-size: 15px;
          color: #3a1a5f;
          outline: none;
          box-shadow: inset 0 2px 5px rgba(0,0,0,0.05);
          transition: 0.3s;
        }

        input:focus, textarea:focus, select:focus {
          box-shadow: 0 0 0 3px rgba(123,47,247,0.3);
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-bottom: 20px;
        }

        .grid label {
          background: rgba(255,255,255,0.4);
          border-radius: 10px;
          text-align: center;
          padding: 10px;
          font-weight: 500;
          cursor: pointer;
          border: 1px solid rgba(255,255,255,0.5);
          transition: all 0.3s ease;
        }

        .grid input {
          display: none;
        }

        .grid input:checked + span {
          background: linear-gradient(45deg, #7b2ff7, #f107a3);
          color: white;
          border-color: #7b2ff7;
          box-shadow: 0 3px 10px rgba(123,47,247,0.4);
          transform: scale(1.05);
        }

        button {
          width: 100%;
          padding: 14px;
          border: none;
          border-radius: 12px;
          background: linear-gradient(45deg, #7b2ff7, #f107a3);
          color: white;
          font-weight: 600;
          font-size: 16px;
          box-shadow: 0 6px 20px rgba(123,47,247,0.3);
          cursor: pointer;
          transition: all 0.3s;
        }

        button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(123,47,247,0.4);
        }

        .error {
          background: rgba(255, 240, 240, 0.8);
          border-left: 4px solid #ff4d4d;
          padding: 10px 12px;
          border-radius: 8px;
          margin-bottom: 15px;
          color: #a10000;
        }
      `}</style>

      <h2><AlertTriangle size={22} /> Request Emergency Aid</h2>

      {status?.type === "error" && <div className="error">{status.msg}</div>}

      <form onSubmit={handleSubmit}>
        <label><User size={16} /> Full Name</label>
        <input type="text" name="name" placeholder="Enter your name" value={formData.name} onChange={handleChange} required />

        <label><Phone size={16} /> Contact Phone</label>
        <input type="tel" name="contactPhone" placeholder="Enter phone number" value={formData.contactPhone} onChange={handleChange} required />

        <label><MapPin size={16} /> Location (lat,lng)</label>
        <input type="text" name="location" placeholder="12.9716, 77.5946" value={formData.location} onChange={handleChange} required />

        <label>Urgency Level</label>
        <select name="urgencyLevel" value={formData.urgencyLevel} onChange={handleChange}>
          {URGENCY_LEVELS.map((u) => <option key={u} value={u}>{u}</option>)}
        </select>

        <label>Resources Needed</label>
        <div className="grid">
          {RESOURCE_OPTIONS.map((r) => (
            <label key={r}>
              <input type="checkbox" value={r} checked={formData.resourcesRequested.includes(r)} onChange={handleResourceChange} />
              <span>{r}</span>
            </label>
          ))}
        </div>

        <label>Description</label>
        <textarea name="description" rows="3" placeholder="Describe your situation..." value={formData.description} onChange={handleChange}></textarea>

        <button type="submit" disabled={loading}>
          {loading ? <><Loader size={16} className="inline" /> Submitting...</> : <>Submit Request <Send size={16} className="inline" /></>}
        </button>
      </form>
    </div>
  );
};

export default AidRequestForm;
