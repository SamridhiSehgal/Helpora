import React, { useState } from "react";

export default function NewRequest({ victim }) {
  const [type, setType] = useState("");
  const [desc, setDesc] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);

  const resources = ["Food", "Water", "Medicine", "Shelter", "Clothing", "First Aid", "Other"];

  const validate = () => {
    const err = {};
    if (!type) err.type = "Please select a type";
    if (!desc.trim()) err.desc = "Description is required";
    else if (desc.trim().length < 10) err.desc = "Min 10 characters required";
    if (!lat || !lng) err.location = "Location is required";
    else {
      const latNum = parseFloat(lat);
      const lngNum = parseFloat(lng);
      if (isNaN(latNum) || latNum < -90 || latNum > 90) err.lat = "Invalid latitude";
      if (isNaN(lngNum) || lngNum < -180 || lngNum > 180) err.lng = "Invalid longitude";
    }
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const getLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }
    setGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(pos.coords.latitude.toFixed(6));
        setLng(pos.coords.longitude.toFixed(6));
        setGettingLocation(false);
        setErrors({ ...errors, location: "", lat: "", lng: "" });
      },
      (err) => {
        alert("Location error: " + err.message);
        setGettingLocation(false);
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const data = {
        type,
        desc: desc.trim(),
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        victimId: victim?.id || "unknown",
        victimName: victim?.name || "Guest",
        createdAt: new Date().toISOString(),
      };
      
      console.log("Submitting:", data);
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      alert("✅ Request submitted successfully!");
      
      // Reset
      setType("");
      setDesc("");
      setLat("");
      setLng("");
      setErrors({});
    } catch (error) {
      alert("❌ Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      maxWidth: 600,
      margin: "20px auto",
      padding: 30,
      background: "#fff",
      borderRadius: 12,
      boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
    }}>
      <h2 style={{ textAlign: "center", color: "#2c3e50", marginBottom: 8 }}>
        Create New Request
      </h2>
      <p style={{ textAlign: "center", color: "#7f8c8d", fontSize: 14, marginBottom: 25 }}>
        Fill in the details to request assistance
      </p>

      {/* Type */}
      <div style={{ marginBottom: 18 }}>
        <label style={{ display: "block", fontWeight: 600, marginBottom: 6, color: "#2c3e50" }}>
          Request Type <span style={{ color: "#e74c3c" }}>*</span>
        </label>
        <select
          value={type}
          onChange={(e) => { setType(e.target.value); setErrors({ ...errors, type: "" }); }}
          style={{
            width: "100%",
            padding: 12,
            border: errors.type ? "2px solid #e74c3c" : "1px solid #ddd",
            borderRadius: 8,
            fontSize: 14
          }}
        >
          <option value="">-- Select Type --</option>
          {resources.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
        {errors.type && <p style={{ color: "#e74c3c", fontSize: 12, margin: "5px 0 0" }}>{errors.type}</p>}
      </div>

      {/* Description */}
      <div style={{ marginBottom: 18 }}>
        <label style={{ display: "block", fontWeight: 600, marginBottom: 6, color: "#2c3e50" }}>
          Description <span style={{ color: "#e74c3c" }}>*</span>
        </label>
        <textarea
          value={desc}
          onChange={(e) => { setDesc(e.target.value); setErrors({ ...errors, desc: "" }); }}
          placeholder="Describe your situation..."
          rows={4}
          style={{
            width: "100%",
            padding: 12,
            border: errors.desc ? "2px solid #e74c3c" : "1px solid #ddd",
            borderRadius: 8,
            fontSize: 14,
            resize: "vertical",
            fontFamily: "inherit"
          }}
        />
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5 }}>
          {errors.desc && <p style={{ color: "#e74c3c", fontSize: 12, margin: 0 }}>{errors.desc}</p>}
          <p style={{ color: desc.length < 10 ? "#e74c3c" : "#7f8c8d", fontSize: 12, margin: 0, marginLeft: "auto" }}>
            {desc.length} chars
          </p>
        </div>
      </div>

      {/* Location */}
      <div style={{ marginBottom: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <label style={{ fontWeight: 600, color: "#2c3e50" }}>
            Location <span style={{ color: "#e74c3c" }}>*</span>
          </label>
          <button
            type="button"
            onClick={getLocation}
            disabled={gettingLocation}
            style={{
              padding: "6px 12px",
              background: gettingLocation ? "#95a5a6" : "#3498db",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              fontSize: 12,
              cursor: gettingLocation ? "not-allowed" : "pointer"
            }}
          >
            {gettingLocation ? "Getting..." : "📍 Use Current"}
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <input
              type="number"
              step="any"
              value={lat}
              onChange={(e) => { setLat(e.target.value); setErrors({ ...errors, lat: "", location: "" }); }}
              placeholder="Latitude (28.7041)"
              style={{
                width: "100%",
                padding: 12,
                border: errors.lat ? "2px solid #e74c3c" : "1px solid #ddd",
                borderRadius: 8,
                fontSize: 14
              }}
            />
            {errors.lat && <p style={{ color: "#e74c3c", fontSize: 11, margin: "3px 0 0" }}>{errors.lat}</p>}
          </div>
          <div>
            <input
              type="number"
              step="any"
              value={lng}
              onChange={(e) => { setLng(e.target.value); setErrors({ ...errors, lng: "", location: "" }); }}
              placeholder="Longitude (77.1025)"
              style={{
                width: "100%",
                padding: 12,
                border: errors.lng ? "2px solid #e74c3c" : "1px solid #ddd",
                borderRadius: 8,
                fontSize: 14
              }}
            />
            {errors.lng && <p style={{ color: "#e74c3c", fontSize: 11, margin: "3px 0 0" }}>{errors.lng}</p>}
          </div>
        </div>
        {errors.location && <p style={{ color: "#e74c3c", fontSize: 12, margin: "5px 0 0" }}>{errors.location}</p>}
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{
          width: "100%",
          padding: 14,
          background: loading ? "#95a5a6" : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "#fff",
          border: "none",
          borderRadius: 8,
          fontSize: 16,
          fontWeight: 600,
          cursor: loading ? "not-allowed" : "pointer",
          boxShadow: "0 4px 15px rgba(102,126,234,0.3)"
        }}
      >
        {loading ? "Submitting..." : "Submit Request"}
      </button>

      <p style={{ marginTop: 15, textAlign: "center", fontSize: 12, color: "#7f8c8d" }}>
        Your request will be assigned to the nearest NGO
      </p>
    </div>
  );
}