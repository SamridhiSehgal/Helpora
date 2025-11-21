import RequestModel from '../models/AidRequest.js'; 
import mongoose from 'mongoose';

// --- GET: Retrieve Public Request Status (Secure Lookup) ---
export const getPublicRequestStatus = async (req, res) => {
    
    // ⬅️ CRITICAL FIX: Destructure the required parameters from the request
    const { id, token } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid request ID format." });
    }

    try {
        // Find the request using BOTH the ID and the secure tracking token
        const request = await RequestModel.findOne({
            _id: id,
            trackingToken: token 
        })
        // ⬅️ CORRECTED SELECT STATEMENT: Includes all necessary fields for the StatusViewer.jsx
        .select('requestStatus resourcesRequested urgencyLevel assignedNgoId createdAt name contactPhone'); 

        if (!request) {
            return res.status(404).json({ message: "Request not found or invalid tracking link." });
        }
        
        // Return the request object directly, which now includes all selected fields
        res.status(200).json({ success: true, data: request });
        
    } catch (error) {
        console.error("Public Status Check Error:", error.message);
        res.status(500).json({ message: 'Server error retrieving status.' });
    }
};