import React, { useState } from "react";
import LocationPicker from "../../components/LocationPicker";

export default function RequestForm({ victim }) {
  const [type, setType] = useState("Food");
  const [priority, setPriority] = useState("medium");
  const [desc, setDesc] = useState("");
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!desc.trim()) return alert("Please describe your need");
    if (!location) return alert("Please set your location");

    setLoading(true);

    try {
      const payload = {
        victimId: victim?.id || "me",
        name: victim?.name || "Anonymous",
        phone: victim?.phone || "",
        type,
        desc,
        priority,
        lat: location.lat,
        lng: location.lng,
        createdAt: Date.now(),
      };

      const res = await createRequest(payload); // Ensure you import this function
      setLoading(false);

      if (res?.success) {
        alert("Request submitted! ID: " + res.id);
        setDesc("");
        setLocation(null);
      } else {
        alert("Failed to submit request");
      }
    } catch (err) {
      setLoading(false);
      alert("Error: " + err.message);
    }
  }

  return (
    <div
      style={{
        maxWidth: 720,
        margin: "20px auto",
        background: "#fff",
        padding: "30px",
        borderRadius: "12px",
        boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
      }}
    >
      <h2 style={{ color: "#2c3e50", marginBottom: "20px", textAlign: "center" }}>
        Create a New Help Request
      </h2>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <div>
          <label style={{ fontWeight: "bold" }}>Type of Help</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              marginTop: "5px",
            }}
          >
            <option>Food</option>
            <option>Medicine</option>
            <option>Shelter</option>
            <option>Water</option>
            <option>Other</option>
          </select>
        </div>

        <div>
          <label style={{ fontWeight: "bold" }}>Priority</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              marginTop: "5px",
            }}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div>
          <label style={{ fontWeight: "bold" }}>Describe Your Need</label>
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            rows={5}
            placeholder="Provide details about the help you need..."
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              marginTop: "5px",
              resize: "vertical",
            }}
          />
        </div>

        <div>
          <label style={{ fontWeight: "bold" }}>Set Your Location</label>
          <div style={{ marginTop: "8px" }}>
            <LocationPicker value={location} onChange={setLocation} />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            background: "#3498db",
            color: "#fff",
            padding: "12px",
            borderRadius: "8px",
            fontWeight: "bold",
            border: "none",
            cursor: "pointer",
            transition: "0.3s",
          }}
          onMouseOver={(e) => (e.currentTarget.style.background = "#2980b9")}
          onMouseOut={(e) => (e.currentTarget.style.background = "#3498db")}
        >
          {loading ? "Submitting..." : "Submit Request"}
        </button>
      </form>
    </div>
  );
}

