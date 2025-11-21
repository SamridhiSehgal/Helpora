import Victim from '../models/Victim.js';
import Shelter from '../models/Shelter.js';
import Inventory from '../models/Inventory.js';

// --- Core Logic: Find and Assign Resources ---
export const matchResources = async (victimRequestId) => {
    try {
        const victimRequest = await Victim.findById(victimRequestId);
        if (!victimRequest) {
            console.warn(`Victim request ${victimRequestId} not found.`);
            return;
        }

        const requestedResources = victimRequest.resourcesRequested;
        const victimLocation = victimRequest.location;

        console.log(`Matching resources for ${victimRequest.name} at [${victimLocation.coordinates}] needing: ${requestedResources.join(', ')}`);

        // ===================================================================
        // 1. MATCH SHELTER (Prioritized Check)
        // ===================================================================

        if (requestedResources.includes('Shelter')) {
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
                // ASSIGNMENT: Update request status and assign the shelter
                victimRequest.requestStatus = 'Assigned';
                victimRequest.assignedNgoId = nearestShelter.ngoId;
                await victimRequest.save();

                // ALLOCATION (Check-In Logic): Increase shelter occupancy by 1
                nearestShelter.currentOccupancy += 1;
                await nearestShelter.save();

                console.log(`SUCCESS: Assigned Shelter ${nearestShelter.name}`);
                return; 
            }
        }
        
        // ===================================================================
        // 2. MATCH INVENTORY (General Aid Check)
        // ===================================================================
        
        const nearestInventory = await Inventory.find({
            location: {
                $near: {
                    $geometry: victimLocation,
                    $maxDistance: 25000 
                }
            },
            category: { $in: requestedResources },
            quantity: { $gt: 0 } 
        }).limit(3); 
        
        if (nearestInventory.length > 0) {
            // ASSIGNMENT: Update status and assign to the NGO owning the closest item
            victimRequest.requestStatus = 'Assigned';
            victimRequest.assignedNgoId = nearestInventory[0].ngoId; 
            await victimRequest.save();

            console.log(`SUCCESS: Assigned Inventory Resource Provider.`);
            return;
        }

        // If no match found
        victimRequest.requestStatus = 'Pending';
        await victimRequest.save();
        console.log("INFO: No immediate match found. Request remains pending.");

    } catch (error) {
        console.error("Error during resource matching:", error.message);
    }
};