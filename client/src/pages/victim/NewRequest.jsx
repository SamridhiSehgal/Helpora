import React, { useState } from "react";

export default function VictimNewRequest() {
  const [type, setType] = useState("");
  const [desc, setDesc] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!type || !desc || !lat || !lng) {
      alert("Please fill all fields");
      return;
    }
    const newRequest = {
      type,
      desc,
      lat: parseFloat(lat),
      lng: parseFloat(lng),
    };
    console.log("New Request:", newRequest);
    alert("Request submitted successfully!");
    // abhi sirf console me dikhayenge — API integration baad me karenge
  };

  return (
    <div style={{
      maxWidth: 400,
      margin: "40px auto",
      border: "1px solid #ccc",
      borderRadius: 8,
      padding: 20,
      boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
    }}>
      <h2 style={{ textAlign: "center" }}>Create New Request</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label>Request Type:</label><br />
          <input
            type="text"
            value={type}
            onChange={(e) => setType(e.target.value)}
            placeholder="e.g. Food, Medicine"
            style={{ width: "100%", padding: 8 }}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Description:</label><br />
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Describe the situation"
            style={{ width: "100%", padding: 8 }}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Latitude:</label><br />
          <input
            type="text"
            value={lat}
            onChange={(e) => setLat(e.target.value)}
            placeholder="e.g. 28.7041"
            style={{ width: "100%", padding: 8 }}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Longitude:</label><br />
          <input
            type="text"
            value={lng}
            onChange={(e) => setLng(e.target.value)}
            placeholder="e.g. 77.1025"
            style={{ width: "100%", padding: 8 }}
          />
        </div>
        <button
          type="submit"
          style={{
            width: "100%",
            padding: 10,
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: 5,
            cursor: "pointer"
          }}
        >
          Submit Request
        </button>
      </form>
    </div>
  );
}
