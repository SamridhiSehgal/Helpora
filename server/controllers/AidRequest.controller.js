// src/controllers/aidRequestController.js

import RequestModel from '../models/AidRequest.js'; 
import mongoose from 'mongoose';
import { matchResources } from './matchingController.js'; // ⬅️ The matching service
import crypto from 'crypto'; // For generating unique tokens

// --- POST: Submit New Aid Request (Public/Unauthenticated) ---
export const submitAidRequest = async (req, res) => {
    // ⚠️ NOTE: We do NOT check req.user.id here, allowing public submission.
    
    // Correctly map incoming fields to schema fields
    const { name, contactPhone, resourcesRequested, urgencyLevel, location } = req.body; // Assuming the public form sends these fields
    
    if (!contactPhone || !resourcesRequested || !location || !location.coordinates) {
        return res.status(400).json({ success: false, message: "Contact phone, resources, and GeoJSON location are required." });
    }

    try {
        // 1. Prepare Data & Token
        const trackingToken = crypto.randomBytes(20).toString('hex');
        const lon = parseFloat(location.coordinates[0]);
        const lat = parseFloat(location.coordinates[1]);
        
        if (isNaN(lon) || isNaN(lat)) throw new Error("Coordinates must be valid numbers.");

        // 2. Create Request Document
        const newRequest = new RequestModel({
            name,
            contactPhone,
            resourcesRequested, // Assuming this is an array of strings
            urgencyLevel, // Use urgencyLevel from body if provided, not a hardcoded default 'priority'
            location: {
                type: "Point",
                coordinates: [lon, lat] // [longitude, latitude]
            },
            trackingToken: trackingToken, // Save unique token
            requestStatus: 'Pending'
        });

        const victimRequest = await newRequest.save();

        // 3. Trigger Matching (Asynchronous Assignment)
        matchResources(victimRequest._id); 

        res.status(201).json({ 
            success: true, 
            message: "Aid request submitted. Matching in progress.",
            requestId: victimRequest._id,
            trackingToken: trackingToken // Return token for status tracking link
        });
    } catch (error) {
        console.error("Mongoose Validation/Submit Error:", error.message);
        res.status(400).json({ success: false, message: `Validation Failed: ${error.message}` });
    }
};

// --- GET: Get Victim Requests (Requires Victim Authentication) ---
export const getVictimRequests = async (req, res) => {
    // ⬅️ Keep the authentication check for private history access
    const victimId = req.user.id; 
    
    if (!victimId) return res.status(401).json({ success: false, message: "Authentication required." });

    try {
        const requests = await RequestModel.find({ 
            victimId: new mongoose.Types.ObjectId(victimId) 
        })
        // Select required fields from the model
        .select('requestStatus resourcesRequested assignedNgoId createdAt location') 
        .sort({ createdAt: -1 }); 

        res.status(200).json({ success: true, count: requests.length, requests: requests });
    } catch (error) {
        console.error("Error fetching victim requests:", error);
        res.status(500).json({ success: false, message: "Server error retrieving requests." });
    }
};