import React from "react";

export default function RequestCard({ item, onOpen }) {
  const statusColor = item.status === "pending" ? "#f0ad4e" : (item.status==="assigned" ? "#5cb85c" : "#6c757d");
  return (
    <div style={{ border:"1px solid #eee", padding:12, borderRadius:8, marginBottom:8, display:"flex", justifyContent:"space-between" }}>
      <div>
        <div style={{ fontWeight:600 }}>{item.type} • {item.desc}</div>
        <div style={{ fontSize:13, color:"#666" }}>{new Date(item.createdAt).toLocaleString()}</div>
      </div>
      <div style={{ textAlign:"right" }}>
        <div style={{ background:statusColor, color:"#fff", padding:"4px 8px", borderRadius:6 }}>{item.status}</div>
        <div style={{ marginTop:8 }}>
          <button onClick={()=>onOpen(item)}>Details</button>
        </div>
      </div>
    </div>
  );
}
