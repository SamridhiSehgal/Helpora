import RequestModel from '../models/AidRequest..js'; 
import mongoose from 'mongoose';

export const submitAidRequest = async (req, res) => {
    const victimId = req.user.id; 
    const { requiredResources, locationDetails, priority } = req.body;

    if (!requiredResources || !locationDetails || !locationDetails.coordinates) {
        return res.status(400).json({ success: false, message: "Resource needs and GeoJSON location are required." });
    }

    try {
        const newRequest = new RequestModel({
            victimId: new mongoose.Types.ObjectId(victimId),
            requiredResources: requiredResources,
            location: locationDetails, 
            priorityLevel: priority || 1, 
            status: 'pending' 
        });

        await newRequest.save();

        res.status(201).json({ 
            success: true, 
            message: "Aid request successfully submitted. Awaiting assignment.",
            requestId: newRequest._id
        });
    } catch (error) {
        console.error("Error submitting aid request:", error);
        res.status(500).json({ success: false, message: "Server error submitting request." });
    }
};

export const getVictimRequests = async (req, res) => {
    const victimId = req.user.id; 

    try {
        const requests = await RequestModel.find({ 
            victimId: new mongoose.Types.ObjectId(victimId) 
        })
        .select('status requiredResources assignedNgoId createdAt location') 
        .sort({ createdAt: -1 }); 

        res.status(200).json({ success: true, count: requests.length, requests: requests });

    } catch (error) {
        console.error("Error fetching victim requests:", error);
        res.status(500).json({ success: false, message: "Server error retrieving requests." });
    }
};