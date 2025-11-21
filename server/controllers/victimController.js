// src/controllers/victimController.js

import Victim from '../models/Victim.js'; // ⬅️ Unified Model
import mongoose from 'mongoose';
import { matchResources } from './matchingController.js'; // The matching service
import crypto from 'crypto'; // For generating unique tokens

// Helper to safely get the authenticated victim's ID (used ONLY for history)
const getLoggedInUserId = (req) => {
    return req.user ? req.user.id : null; 
};

// --- POST: Submit New Aid Request (Public/Unauthenticated) ---
export const submitAidRequest = async (req, res) => {
    
    const { name, contactPhone, resourcesRequested, urgencyLevel, location, email } = req.body;

    // 1. Validation Check (Ensures all required fields are present and not empty)
    if (!name || !contactPhone || !location || !Array.isArray(resourcesRequested) || resourcesRequested.length === 0) {
        return res.status(400).json({ success: false, message: "Name, contact phone, location, and at least one resource are required." });
    }

    try {
        // 2. Safely Parse Coordinates (CRITICAL: Prevents TypeErrors and ensures valid GeoJSON)
        const lon = parseFloat(location.coordinates[0]);
        const lat = parseFloat(location.coordinates[1]);

        if (isNaN(lon) || isNaN(lat)) {
             throw new Error("Coordinates must be valid numbers.");
        }
        
        // 3. Generate secure tracking token
        const trackingToken = crypto.randomBytes(20).toString('hex');
        
        // 4. Create and Save Request Document
        const newRequest = new Victim({
            name, 
            contactPhone, 
            email, // Include email (or null)
            resourcesRequested, 
            urgencyLevel, 
            trackingToken: trackingToken,
            requestStatus: 'Pending', // Initial status
            location: {
                type: "Point",
                coordinates: [lon, lat] // Use the safely parsed numbers
            }
        });

        const victimRequest = await newRequest.save();

        // 5. Trigger the automatic matching service asynchronously
        matchResources(victimRequest._id); 

        // 6. Return Success Response with Token
        res.status(201).json({ 
            success: true, 
            message: "Aid request successfully submitted. Matching in progress.",
            requestId: victimRequest._id,
            trackingToken: trackingToken // Sent to client for status link
        });
    } catch (error) {
        console.error("SERVER DEBUG (Aid Request Submission Failed):", error.stack); 
        
        // Handle MongoDB E11000 (Duplicate Key) error
        if (error.code === 11000) {
             return res.status(409).json({ success: false, message: "Email or tracking token already exists. Please use a unique email." });
        }

        // Handle Mongoose Validation/Parsing Errors (400 Bad Request)
        if (error.name === 'ValidationError' || error.message.includes("Coordinates must be")) {
             return res.status(400).json({ success: false, message: `Validation Failed: ${error.message}` });
        }
        
        // General 500 status for unknown server crashes
        res.status(500).json({ success: false, message: "Server error submitting request." });
    }
};

// --- GET: Get All Requests for the Logged-in Victim (History) ---
export const getVictimRequests = async (req, res) => {
    const victimId = getLoggedInUserId(req); 
    
    if (!victimId) return res.status(401).json({ success: false, message: "Victim authentication required to view history." });

    try {
        // Query the 'Victim' collection filtered by the logged-in user's ID
        const requests = await Victim.find({ 
            _id: new mongoose.Types.ObjectId(victimId) // The _id of the document is the identifier
        })
        .select('requestStatus resourcesRequested assignedNgoId createdAt location urgencyLevel') 
        .sort({ createdAt: -1 }); 

        res.status(200).json({ success: true, count: requests.length, requests: requests });

    } catch (error) {
        console.error("Error fetching victim requests:", error);
        res.status(500).json({ success: false, message: "Server error retrieving requests." });
    }
};