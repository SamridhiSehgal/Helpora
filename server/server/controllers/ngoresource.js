// controllers/ngoresource.js
// server/controllers/ngoresource.js
// ES module controller exposing the functions expected by the NGO router

import NgoModel from '../models/ngo.model.js';
import ShelterModel from '../models/Shelter.js';
import AidRequestModel from '../models/AidRequest.js';
import Resource from '../models/Resource.js';

// Helper to read NGO id from the middleware (req.user)
const getNgoId = (req) => (req.user && (req.user.id || req.user.ngoId)) || null;

export const updateResources = async (req, res) => {
    const ngoId = getNgoId(req);
    if (!ngoId) return res.status(401).json({ message: 'Authentication required' });

    try {
        const resource = await Resource.create({ ...req.body, ngoId });
        return res.status(201).json({ success: true, data: resource });
    } catch (err) {
        console.error('Error creating resource:', err && err.message);
        return res.status(400).json({ success: false, message: 'Failed to create resource', error: err && err.message });
    }
};
// Add a function to get a single resource by ID

export const getResourceById = async (req, res) => {
    try {
        const ngoId = req.user.id; // NGO A's ID from the token
        const resourceId = req.params.id; // Resource ID being requested (could be NGO B's)

        // CRUCIAL: Mongoose must find the record that matches BOTH IDs
        const resource = await Resource.findOne({
            _id: resourceId, // The ID from the URL parameter
            ngoId: ngoId     // The ID from the authenticated token
        });

        if (!resource) {
            // Return 404 to hide the existence of a resource owned by NGO B
            return res.status(404).json({ message: 'Resource not found' });
        }

        res.status(200).json(resource);
    } catch (error) {
        // Handle invalid ID format, etc.
        res.status(400).json({ message: 'Invalid resource ID format' });
    }
};
export const updateResource = async (req, res) => {
    try {
        const ngoId = req.user.id; // NGO A's ID from the token
        const resourceId = req.params.id;
        
        // CRUCIAL: Find and update the record that matches BOTH IDs
        const resource = await Resource.findOneAndUpdate(
            { 
                _id: resourceId, 
                ngoId: ngoId 
            },
            { ...req.body, lastUpdated: Date.now() },
            { new: true, runValidators: true } 
        );

        if (!resource) {
            // If the resource exists but belongs to NGO B, the query returns null. 
            // Return 404 Not Found or 403 Forbidden. 404 is generally safer.
            return res.status(404).json({ message: 'Resource not found or unauthorized' });
        }
        
        res.status(200).json({ message: "Resource updated successfully", data: resource });
    } catch (error) {
        // ... error handling ...
        res.status(400).json({ message: 'Failed to update resource', error: error.message });
    }
};

export const getAssignedRequests = async (req, res) => {
    const ngoId = getNgoId(req);
    if (!ngoId) return res.status(401).json({ message: 'Authentication required' });

    try {
        const requests = await AidRequestModel.find({ assignedNGO: ngoId }).sort({ createdAt: -1 }).limit(100);
        return res.json({ success: true, count: requests.length, data: requests });
    } catch (err) {
        console.error('Error fetching assigned requests:', err && err.message);
        return res.status(500).json({ success: false, message: 'Failed to fetch assigned requests' });
    }
};

export const getDashboardData = async (req, res) => {
    const ngoId = getNgoId(req);
    if (!ngoId) return res.status(401).json({ message: 'Authentication required' });

    try {
        const [ngoDetails, shelters, totalPendingRequests] = await Promise.all([
            NgoModel.findById(ngoId).select('name location'),
            ShelterModel.find({ ngo: ngoId }).select('name capacity occupied'),
            AidRequestModel.countDocuments({ assignedNGO: ngoId, status: { $in: ['Pending', 'Assigned'] } }),
        ]);

        if (!ngoDetails) return res.status(404).json({ message: 'NGO not found' });

        const dashboardData = {
            ngo_id: ngoId,
            ngo_name: ngoDetails.name,
            location: ngoDetails.location,
            metrics: {
                totalShelters: shelters.length,
                totalPendingRequests,
            },
            shelterOverview: shelters.map(s => ({ id: s._id, name: s.name, capacity: s.capacity, occupied: s.occupied })),
        };

        return res.json({ success: true, data: dashboardData });
    } catch (err) {
        console.error('Error building dashboard data:', err && err.message);
        return res.status(500).json({ success: false, message: 'Failed to build dashboard data' });
    }
};

export const updateShelterCapacity = async (req, res) => {
    const ngoId = getNgoId(req);
    if (!ngoId) return res.status(401).json({ message: 'Authentication required' });

    try {
        const { shelterId, capacity, occupied } = req.body;
        if (!shelterId) {
            return res.status(400).json({ message: 'Shelter ID is required' });
        }

        const shelter = await ShelterModel.findOneAndUpdate(
            { _id: shelterId, ngo: ngoId },
            { 
                ...(capacity !== undefined && { capacity }),
                ...(occupied !== undefined && { occupied })
            },
            { new: true, runValidators: true }
        );

        if (!shelter) {
            return res.status(404).json({ message: 'Shelter not found or unauthorized' });
        }

        return res.json({ 
            success: true, 
            message: 'Shelter capacity updated successfully', 
            data: shelter 
        });
    } catch (err) {
        console.error('Error updating shelter capacity:', err && err.message);
        return res.status(500).json({ 
            success: false, 
            message: 'Failed to update shelter capacity' 
        });
    }
};