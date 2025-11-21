import Inventory from '../models/Inventory.js';
import Shelter from '../models/Shelter.js';
import mongoose from 'mongoose';

// Helper function to get the authenticated NGO's ID from the middleware
const getLoggedInNgoId = (req) => {
    return req.user ? req.user.ngoId : null; 
};

// --- GET: Dashboard Summary Metrics ---
export const getDashboardSummary = async (req, res) => {
    try {
        const ngoIdString = getLoggedInNgoId(req);
        if (!ngoIdString) return res.status(401).json({ message: 'Authentication required.' });
        
        // Convert ID for secure query filtering
        const ngoId = new mongoose.Types.ObjectId(ngoIdString); 

        // 1. Inventory Summary: Count unique items and total quantity
        const totalInventoryItems = await Inventory.countDocuments({ ngoId });
        
        // Use MongoDB aggregation to sum quantities
        const inventoryAggregation = await Inventory.aggregate([
            { $match: { ngoId: ngoId } },
            { $group: { _id: "$category", totalQuantity: { $sum: "$quantity" } } }
        ]);

        // 2. Shelter Summary: Count shelters and total available capacity
        const totalShelters = await Shelter.countDocuments({ ngoId });
        const availableCapacityAggregation = await Shelter.aggregate([
            { $match: { ngoId: ngoId, status: 'Open' } }, // Only count open shelters
            { $project: { 
                _id: 0, 
                availableSpace: { $subtract: ["$totalCapacity", "$currentOccupancy"] } 
            }},
            { $group: { _id: null, totalAvailableCapacity: { $sum: "$availableSpace" } } }
        ]);
        
        const totalAvailableCapacity = availableCapacityAggregation.length > 0 
            ? totalAvailableCapacityAggregation[0].totalAvailableCapacity 
            : 0;

        // 3. Construct the final dashboard object
        res.status(200).json({
            success: true,
            data: {
                inventory: {
                    totalUniqueItems: totalInventoryItems,
                    breakdownByCategory: inventoryAggregation, // e.g., [{_id: 'Food', totalQuantity: 300}, ...]
                },
                shelters: {
                    totalShelters: totalShelters,
                    totalAvailableCapacity: totalAvailableCapacity,
                }
            }
        });

    } catch (error) {
        console.error("DASHBOARD GET Error:", error.message);
        res.status(500).json({ message: 'Server error retrieving dashboard summary.' });
    }
};