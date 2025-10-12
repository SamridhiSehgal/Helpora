import React from "react";

export default function RequestDetail({ data, onClose }) {
  return (
    <div style={{ border:"1px solid #ddd", padding:12, borderRadius:8 }}>
      <div style={{ display:"flex", justifyContent:"space-between" }}>
        <h3>{data.type} • {data.status}</h3>
        <button onClick={onClose}>Close</button>
      </div>

      <p><strong>Description:</strong> {data.desc}</p>
      <p><strong>Created:</strong> {new Date(data.createdAt).toLocaleString()}</p>

      {data.assignedTo && (
        <div style={{ marginTop:8, padding:8, border:"1px dashed #ccc", borderRadius:6 }}>
          <strong>Assigned NGO:</strong>
          <div>{data.assignedTo.name}</div>
          <div>Contact: {data.assignedTo.phone}</div>
          <button onClick={()=> window.open(`tel:${data.assignedTo.phone}`)}>Call NGO</button>
        </div>
      )}

      <div style={{ marginTop:8 }}>
        <strong>Timeline</strong>
        <ul>
          {(data.timeline || []).map((t, i) => <li key={i}>{new Date(t.at).toLocaleString()}: {t.text}</li>)}
        </ul>
      </div>

      <div style={{ marginTop:8 }}>
        <strong>Location</strong>
        <div>Lat: {data.lat}, Lng: {data.lng}</div>
        <div style={{ marginTop:8 }}>
          <a target="_blank" rel="noreferrer" href={`https://www.google.com/maps?q=${data.lat},${data.lng}`}>Open in Google Maps</a>
        </div>
      </div>
    </div>
  );
}
