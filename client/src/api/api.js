// client/src/api/api.js

const BASE =
  import.meta?.env?.VITE_API_BASE ||
  process.env.REACT_APP_API_BASE ||
  "http://localhost:5000/api";

async function requestJson(url, options = {}) {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }
  return res.json();
}

// 🔹 Fetch all requests for a victim (mock)
export async function fetchRequests(victimId) {
  return new Promise((resolve) =>
    setTimeout(
      () =>
        resolve([
          {
            id: "r1",
            type: "Food",
            desc: "Family of 4 needs urgent help",
            status: "pending",
            createdAt: Date.now() - 3600000,
            lat: 28.7041,
            lng: 77.1025,
          },
          {
            id: "r2",
            type: "Medicine",
            desc: "Insulin required for diabetic patient",
            status: "assigned",
            assignedTo: {
              name: "Helping Hands NGO",
              phone: "9999999999",
            },
            createdAt: Date.now() - 7200000,
            lat: 28.7,
            lng: 77.1,
          },
        ]),
      400
    )
  );
}

// 🔹 Create a new help request (mock)
export async function createRequest(payload) {
  console.log("Request payload:", payload);
  return new Promise((resolve) =>
    setTimeout(
      () => resolve({ success: true, id: "r" + Math.floor(Math.random() * 1000) }),
      400
    )
  );
}

// 🔹 Fetch a single request detail (mock)
export async function fetchRequestById(id) {
  return new Promise((resolve) =>
    setTimeout(
      () =>
        resolve({
          id,
          type: "Food",
          desc: "Family of 4 needs urgent help",
          status: "pending",
          timeline: [{ at: Date.now() - 3600000, text: "Request created" }],
          lat: 28.7041,
          lng: 77.1025,
        }),
      300
    )
  );
}
