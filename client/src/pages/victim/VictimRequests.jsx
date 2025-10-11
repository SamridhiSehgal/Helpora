import React, { useEffect, useState } from "react";
import RequestCard from "../../components/RequestCard";
import RequestDetail from "../../components/RequestDetail";

export default function VictimRequests({ victim }) {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    fetchRequests(victim?.id)
      .then((data) => {
        if (mounted) {
          setList(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        setLoading(false);
        alert("Fetch failed: " + err.message);
      });
    return () => (mounted = false);
  }, [victim]);

  async function openDetail(item) {
    setDetailLoading(true);
    const d = await fetchRequestById(item.id);
    setSelected(d);
    setDetailLoading(false);
  }

  return (
    <div style={{ padding: "20px", minHeight: "70vh", background: "#ecf0f1", borderRadius: "10px" }}>
      <h2 style={{ color: "#2c3e50", marginBottom: "20px" }}>Your Requests</h2>

      {loading ? (
        <p>Loading…</p>
      ) : list.length === 0 ? (
        <div
          style={{
            padding: "30px",
            background: "#fff",
            borderRadius: "10px",
            textAlign: "center",
            boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
          }}
        >
          No requests yet. Create one from <strong>New Request</strong>.
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "20px",
          }}
        >
          {list.map((r) => (
            <RequestCard key={r.id} item={r} onOpen={openDetail} />
          ))}
        </div>
      )}

      {selected && (
        <div style={{ marginTop: "30px" }}>
          {detailLoading ? (
            <p>Loading detail…</p>
          ) : (
            <RequestDetail
              data={selected}
              onClose={() => setSelected(null)}
            />
          )}
        </div>
      )}
    </div>
  );
}
