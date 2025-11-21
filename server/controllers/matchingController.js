import Victim from '../models/Victim.js'; // The unified model
import Shelter from '../models/Shelter.js';
import Inventory from '../models/Inventory.js';
import mongoose from 'mongoose'; 

// --- Core Logic: Find and Assign Resources based on Proximity and Availability ---
export const matchResources = async (victimRequestId) => {
    try {
        const victimRequest = await Victim.findById(victimRequestId);
        if (!victimRequest) {
            console.warn(`Victim request ${victimRequestId} not found.`);
            return;
        }
        
        const requestedResources = victimRequest.resourcesRequested || [];
        const victimLocation = victimRequest.location;

        console.log(`Matching resources for ${victimRequest.name} at [${victimLocation.coordinates}] needing: ${requestedResources.join(', ')}`);

        // ===================================================================
        // 1. MATCH SHELTER (Prioritized Check - GeoJSON Required)
        // ===================================================================

        if (requestedResources.includes('Temporary Shelter')) { 
            
            // Search for nearest open shelter with space
            const nearestShelter = await Shelter.findOne({
                location: {
                    $near: {
                        $geometry: victimLocation,
                        $maxDistance: 50000 
                    }
                },
                status: 'Open', 
                $expr: { $gt: ["$totalCapacity", "$currentOccupancy"] } 
            }).sort({ totalCapacity: -1 });

            if (nearestShelter) {
                // Perform atomic update (check-in)
                const assignedShelter = await Shelter.findOneAndUpdate(
                    { 
                        _id: nearestShelter._id, 
                        currentOccupancy: { $lt: nearestShelter.totalCapacity } 
                    },
                    { $inc: { currentOccupancy: 1 } }, 
                    { new: true }
                );

                if (assignedShelter) {
                    // ASSIGNMENT SUCCESS: SHELTER
                    victimRequest.requestStatus = 'Assigned';
                    victimRequest.assignedNgoId = assignedShelter.ngoId;
                    await victimRequest.save();

                    console.log(`SUCCESS: Assigned Shelter ${assignedShelter.name || assignedShelter._id} via atomic update.`);
                    return; // ⬅️ EXIT FUNCTION HERE ON SHELTER SUCCESS
                }
            }
        }
        
        // ===================================================================
        // 2. MATCH INVENTORY (Non-Geospatial Fallback)
        // ===================================================================
        
        // ⬅️ FIX: Remove the $near query entirely to bypass the 2dsphere index crash
        // This query finds the NGO with the best stock, regardless of distance.
        const nearestInventory = await Inventory.find({
            category: { $in: requestedResources }, // Check category against requested resources
            quantity: { $gt: 0 } 
        }).sort({ quantity: -1 }).limit(1); // Sort by highest stock and take the top one
        
        if (nearestInventory.length > 0) {
            // ASSIGNMENT SUCCESS: INVENTORY
            victimRequest.requestStatus = 'Assigned';
            victimRequest.assignedNgoId = nearestInventory[0].ngoId; 
            await victimRequest.save();

            console.log(`SUCCESS: Assigned Inventory Resource Provider (Non-Geo).`);
            return;
        }

        // If no match found
        victimRequest.requestStatus = 'Pending';
        await victimRequest.save();
        console.log("INFO: No immediate match found. Request remains pending.");

    } catch (error) {
        // Log the crash for debugging
        console.error("CRASH DEBUG - Error during resource matching:", error.stack);
        
        // Fallback: Set request to Pending on crash so it doesn't get lost
        const victimRequest = await Victim.findById(victimRequestId);
        if (victimRequest) {
             victimRequest.requestStatus = 'Pending';
             await victimRequest.save();
        }
    }
};