import Victim from '../models/Victim.js';
// ENSURE THIS PATH AND CASING ARE PERFECT:
import { matchResources } from './matchingController.js'; 

// ... (other functions) ...

// --- POST: Submit New Aid Request ---
export const submitAidRequest = async (req, res) => {
    try {
        const { name, contactPhone, resourcesRequested, urgencyLevel, location } = req.body;

        // Validation Check (Basic): Ensure required location data is present
        if (!location || !location.coordinates || location.coordinates.length !== 2) {
            return res.status(400).json({ success: false, message: 'Location coordinates are required for aid requests.' });
        }

        // 1. Create the initial victim request record
        const newVictim = new Victim({
            name, 
            contactPhone, 
            resourcesRequested, 
            urgencyLevel, 
            location
        });

        const victimRequest = await newVictim.save();

        // 2. IMMEDIATE NEXT STEP: Trigger Intelligent Matching Logic
        matchResources(victimRequest._id); // CALLS THE RESOURCE MATCHER

        console.log(`Matching Service Triggered for Request ID: ${victimRequest._id}`);

        res.status(201).json({ 
            success: true, 
            message: "Aid request submitted. Matching in progress.", 
            data: victimRequest 
        });

    } catch (error) {
        console.error("SUBMIT Request Error:", error.message);
        res.status(400).json({ success: false, message: 'Failed to submit aid request.', error: error.message });
    }
};

// --- GET: Retrieve a Single Request Status (Future Endpoint) ---
export const getRequestStatus = async (req, res) => {
    try {
        const victimRequestId = req.params.id;
        
        const request = await Victim.findById(victimRequestId);

        if (!request) {
            return res.status(404).json({ success: false, message: 'Request not found.' });
        }

        res.status(200).json({ 
            success: true, 
            data: {
                requestStatus: request.requestStatus,
                assignedNgoId: request.assignedNgoId
            }
        });
    } catch (error) {
        console.error("GET Status Error:", error.message);
        res.status(500).json({ success: false, message: 'Server error retrieving status.' });
    }
};