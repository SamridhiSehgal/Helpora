import Inventory from '../models/Inventory.js';
import Shelter from '../models/Shelter.js';
import mongoose from 'mongoose';
// import Victim from '../models/Victim.js'; // ⬅️ Assume you will need this model
import ngoModel from '../models/ngo.model.js';
// Helper function to get the authenticated NGO's ID from the middleware
const getLoggedInNgoId = (req) => {
    // Assuming 'req.user' is set by your authentication middleware
    return req.user ? req.user.ngoId : null; 
};

// --- GET: Dashboard Summary Metrics ---
export const getDashboardSummary = async (req, res) => {
    try {
        const ngoIdString = getLoggedInNgoId(req);
        if (!ngoIdString) return res.status(401).json({ message: 'Authentication required.' });
        
        // Convert ID for secure query filtering
        const ngoId = new mongoose.Types.ObjectId(ngoIdString); 
// ⬅️ STEP 1: Fetch the NGO's name from the database 
        const ngoProfile = await ngoModel.findById(ngoId).select('name');
        if (!ngoProfile) {
             // This is a critical failure, but proceed with a fallback name
             return res.status(200).json({ 
                 success: true, 
                 profileName: 'Unknown NGO',
                 // ... include all other summary data set to 0 or N/A
             });
        }
        // 1. Inventory Summary:
        const totalUniqueItems = await Inventory.countDocuments({ ngoId });
        
        const inventoryAggregation = await Inventory.aggregate([
            { $match: { ngoId: ngoId } },
            { $group: { _id: "$category", totalQuantity: { $sum: "$quantity" } } }
        ]);
        
        // Calculate total quantity across all categories
        const totalAvailableResources = inventoryAggregation.reduce((sum, item) => sum + item.totalQuantity, 0);


        // 2. Shelter Summary:
        const totalShelters = await Shelter.countDocuments({ ngoId });
        const availableCapacityAggregation = await Shelter.aggregate([
            { $match: { ngoId: ngoId, status: 'Open' } }, // Only count open shelters
            { $project: { 
                _id: 0, 
                // Calculate available space in each shelter
                availableSpace: { $subtract: ["$totalCapacity", "$currentOccupancy"] } 
            }},
            { $group: { _id: null, totalAvailableCapacity: { $sum: "$availableSpace" } } }
        ]);
        
        // 🛠️ CORRECTION: Use the correct aggregation result variable name
        const totalAvailableCapacity = availableCapacityAggregation.length > 0 
            ? availableCapacityAggregation[0].totalAvailableCapacity 
            : 0;

        // 3. Victim/Request Summary (PLACEHOLDERS/INTEGRATION POINT):
        // 
        // NOTE: You need to implement the actual Victim model logic here.
        // const pendingRequests = await Victim.countDocuments({ ngoId, status: 'Pending' }); 
        const pendingRequests = 10; // Placeholder

        // 4. Construct the final dashboard object
        res.status(200).json({
            success: true,
            profileName: ngoProfile.name,
            // ⬅️ Ensure the top-level keys match your frontend's SummaryCard expectations
            pendingRequests: pendingRequests,
            availableResources: totalAvailableResources, // Total summed quantity
            shelterCapacity: totalAvailableCapacity,     // Total available beds
            criticalZones: 5,                            // Placeholder/Simple logic needed
            
            // OPTIONAL: Detailed breakdown for other dashboard views
            details: {
                inventory: {
                    totalUniqueItems,
                    breakdownByCategory: inventoryAggregation,
                },
                shelters: {
                    totalShelters,
                    totalAvailableCapacity,
                }
            }
        });

    } catch (error) {
        console.error("DASHBOARD GET Error:", error.message);
        res.status(500).json({ message: 'Server error retrieving dashboard summary.' });
    }
};