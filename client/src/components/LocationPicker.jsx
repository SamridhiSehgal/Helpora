import React, { useState } from "react";

export default function LocationPicker({ value, onChange }) {
  const [lat, setLat] = useState(value?.lat || "");
  const [lng, setLng] = useState(value?.lng || "");

  function apply() {
    const la = parseFloat(lat);
    const lo = parseFloat(lng);
    if (isNaN(la) || isNaN(lo)) return alert("Please enter valid coordinates");
    onChange({ lat: la, lng: lo });
  }

  return (
    <div
      style={{
        border: "1px solid #ddd",
        padding: "15px",
        borderRadius: "8px",
        background: "#f9f9f9",
        marginTop: "6px",
      }}
    >
      <div style={{ marginBottom: 8 }}>
        <label>Latitude:</label>
        <input
          type="number"
          value={lat}
          onChange={(e) => setLat(e.target.value)}
          placeholder="e.g. 28.7041"
          style={{
            marginLeft: "8px",
            padding: "6px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            width: "50%",
          }}
        />
      </div>

      <div style={{ marginBottom: 8 }}>
        <label>Longitude:</label>
        <input
          type="number"
          value={lng}
          onChange={(e) => setLng(e.target.value)}
          placeholder="e.g. 77.1025"
          style={{
            marginLeft: "8px",
            padding: "6px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            width: "50%",
          }}
        />
      </div>

      <button
        onClick={apply}
        style={{
          background: "#27ae60",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          padding: "8px 14px",
          cursor: "pointer",
        }}
      >
        Set Location
      </button>

      <p style={{ marginTop: 8, fontSize: 13, color: "#666" }}>
        Tip: Replace this with Google Maps or Leaflet for interactive picking.
      </p>
    </div>
  );
}
