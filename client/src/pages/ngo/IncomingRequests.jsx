import React from "react";
import "./NGO.css"; // Shared CSS

const IncomingRequests = ({ requests }) => {
  // ✅ Temporary sample data if none is passed
  const sampleRequests = [
    {
      id: 1,
      victimName: "Amit Sharma",
      location: "Delhi",
      aidType: "Food & Water",
      priority: "Urgent",
      status: "Pending",
    },
    {
      id: 2,
      victimName: "Riya Patel",
      location: "Mumbai",
      aidType: "Medical Help",
      priority: "Normal",
      status: "Accepted",
    },
    {
      id: 3,
      victimName: "Rohit Kumar",
      location: "Jaipur",
      aidType: "Shelter",
      priority: "Urgent",
      status: "Pending",
    },
  ];

  const finalRequests = requests && requests.length > 0 ? requests : sampleRequests;

  // Sort requests (Urgent & Pending first)
  const sortedRequests = finalRequests.sort((a, b) => {
    if (a.status === "Pending" && b.status !== "Pending") return -1;
    if (a.status !== "Pending" && b.status === "Pending") return 1;
    if (a.priority === "Urgent" && b.priority !== "Urgent") return -1;
    return 0;
  });

  const handleAction = (id, action) => {
    alert(`✅ ${action} processed for Request #${id}`);
  };

  return (
    <div className="request-table-wrapper">
      <h2>🚨 Incoming Requests</h2>
      <p className="table-description">
        Review high-priority aid requests from victims in your region.
      </p>

      {sortedRequests.length === 0 ? (
        <div className="empty-state">🎉 No active requests found right now.</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Victim</th>
              <th>Location</th>
              <th>Aid Needed</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {sortedRequests.map((req) => (
              <tr key={req.id}>
                <td>{req.id}</td>
                <td>{req.victimName}</td>
                <td>{req.location}</td>
                <td>{req.aidType}</td>
                <td>
                  <span
                    className={
                      req.priority === "Urgent" ? "priority-urgent" : ""
                    }
                  >
                    {req.priority}
                  </span>
                </td>
                <td>
                  <span
                    className={`status-tag status-${req.status.toLowerCase()}`}
                  >
                    {req.status}
                  </span>
                </td>
                <td>
                  {req.status === "Pending" ? (
                    <>
                      <button
                        className="action-btn accept"
                        onClick={() => handleAction(req.id, "Accepted")}
                      >
                        Accept
                      </button>
                      <button
                        className="action-btn decline"
                        onClick={() => handleAction(req.id, "Declined")}
                      >
                        Decline
                      </button>
                    </>
                  ) : (
                    <span
                      style={{ color: "#6c757d", fontSize: "0.85rem" }}
                    >
                      {req.status === "Accepted"
                        ? "In Tracker"
                        : "Completed"}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default IncomingRequests;
