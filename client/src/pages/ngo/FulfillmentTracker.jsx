import React, { useState } from 'react';
import './NGO.css'; // Shared CSS

const initialTrackedRequest = {
    id: 101, 
    victimName: "Rohan P.", 
    location: "Pune, Sector 5", 
    aidType: "Medical Supplies", 
    currentStage: "Preparing Kit", // Initial stage
    lastUpdate: new Date().toLocaleString()
};

const FulfillmentTracker = ({ requestId = 101 }) => {
    // State to simulate tracking a single accepted request
    const [request, setRequest] = useState(initialTrackedRequest);
    const [loading, setLoading] = useState(false);

    const stages = [
        "Accepted",
        "Preparing Kit",
        "Dispatching Team",
        "On Route",
        "Aid Delivered",
        "Closed"
    ];

    const handleStageUpdate = (newStage) => {
        setLoading(true);
        // Simulate API call delay
        setTimeout(() => {
            setRequest(prev => ({
                ...prev,
                currentStage: newStage,
                lastUpdate: new Date().toLocaleString()
            }));
            setLoading(false);
            console.log(`Request ${request.id} updated to stage: ${newStage}`);
        }, 800);
    };

    const currentStageIndex = stages.indexOf(request.currentStage);
    const nextStage = currentStageIndex < stages.length - 1 ? stages[currentStageIndex + 1] : null;

    const isComplete = request.currentStage === 'Closed';

    return (
        <div className="tracker-card">
            <h2>Fulfillment Tracker: Request #{request.id}</h2>
            
            <div className="tracker-info">
                <p><strong>Victim:</strong> {request.victimName} | 
                <strong> Location:</strong> {request.location} | 
                <strong> Aid:</strong> {request.aidType}</p>
            </div>

            <div className="tracker-progress">
                {stages.map((stage, index) => (
                    <div key={stage} className={`stage-step ${index <= currentStageIndex ? 'completed' : ''}`}>
                        <div className="stage-circle">
                            {index <= currentStageIndex && <span className="stage-check">✔</span>}
                        </div>
                        <span className="stage-label">{stage.replace(/ /g, '\u00a0')}</span> {/* Use non-breaking space */}
                    </div>
                ))}
            </div>

            <div className="current-status">
                <h3>Current Stage: <span className={`status-tag status-stage stage-${request.currentStage.replace(/\s/g, '').toLowerCase()}`}>{request.currentStage}</span></h3>
                <p>Last Update: {request.lastUpdate}</p>
            </div>

            <div className="completion-message">
                {isComplete ? (
                    <p className="success-message">✅ Fulfillment Complete and Closed.</p>
                ) : (
                    <>
                        <p>Ready to move to the next stage?</p>
                        <button 
                            className="primary-btn update-stage-btn"
                            onClick={() => handleStageUpdate(nextStage)}
                            disabled={loading}
                        >
                            {loading ? 'Updating...' : `Mark as: ${nextStage}`}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default FulfillmentTracker;
