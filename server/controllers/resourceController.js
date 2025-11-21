// controllers/resourceContoller.js (ES module)
import Resource from '../models/Resource.js';

const getLoggedInNgoId = (req) => {
    return req.user ? (req.user.id || req.user.ngoId) : null;
};

export const createResource = async (req, res) => {
    try {
        const ngoId = getLoggedInNgoId(req);
        if (!ngoId) return res.status(401).json({ message: 'Authentication required' });

        const resource = await Resource.create({ ...req.body, ngoId });
        console.log(`Resource created for NGO ${ngoId}:`, resource.name);
        return res.status(201).json({ success: true, data: resource });
    } catch (err) {
        console.error('CREATE Error:', err && err.message);
        return res.status(400).json({ message: 'Failed to create resource', error: err && err.message });
    }
};

export const getResources = async (req, res) => {
    try {
        const ngoId = getLoggedInNgoId(req);
        if (!ngoId) return res.status(401).json({ message: 'Authentication required' });

        const resources = await Resource.find({ ngoId }).sort({ lastUpdated: -1 });
        return res.status(200).json({ success: true, count: resources.length, data: resources });
    } catch (err) {
        console.error('READ Error:', err && err.message);
        return res.status(500).json({ message: 'Server error retrieving resources' });
    }
};

export const updateResource = async (req, res) => {
    try {
        const ngoId = getLoggedInNgoId(req);
        if (!ngoId) return res.status(401).json({ message: 'Authentication required' });

        const resource = await Resource.findOneAndUpdate(
            { _id: req.params.id, ngoId },
            { ...req.body, lastUpdated: Date.now() },
            { new: true, runValidators: true }
        );

        if (!resource) return res.status(404).json({ message: 'Resource not found or unauthorized' });
        console.log(`Resource updated: ${req.params.id}`);
        return res.status(200).json({ success: true, data: resource });
    } catch (err) {
        console.error('UPDATE Error:', err && err.message);
        return res.status(400).json({ message: 'Failed to update resource', error: err && err.message });
    }
};