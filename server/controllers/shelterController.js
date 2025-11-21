import Shelter from '../models/Shelter.js';
import mongoose from 'mongoose'; // Essential for ObjectId conversion

// Helper function to get the authenticated NGO's ID from the middleware
const getLoggedInNgoId = (req) => {
    return req.user ? req.user.ngoId : null; 
};

// --- POST: Create New Shelter ---
export const createShelter = async (req, res) => {
    try {
        const ngoId = getLoggedInNgoId(req);
        if (!ngoId) return res.status(401).json({ message: 'Authentication required.' });

        // Ensure currentOccupancy starts at 0 if not provided
        const initialOccupancy = req.body.currentOccupancy || 0; 
        
        const newShelter = new Shelter({
            ...req.body,
            currentOccupancy: initialOccupancy,
            ngoId 
        });

        const shelter = await newShelter.save();

        res.status(201).json({ success: true, message: "Shelter created successfully.", data: shelter });

    } catch (error) {
        console.error("CREATE Shelter Error:", error.message);
        res.status(400).json({ message: 'Failed to create shelter.', error: error.message });
    }
};


// --- GET: Get All Shelters for NGO ---
export const getShelters = async (req, res) => {
    try {
        const ngoIdString = getLoggedInNgoId(req);
        if (!ngoIdString) return res.status(401).json({ message: 'Authentication required.' });

        const ngoId = new mongoose.Types.ObjectId(ngoIdString); 
        
        const filterQuery = { ngoId: ngoId };
        const sortOptions = {};

        if (req.query.status) {
            const statusValue = req.query.status.trim();
            filterQuery.status = { $regex: new RegExp(`^${statusValue}$`, 'i') }; 
        }
        if (req.query.sort) {
            const [field, order] = req.query.sort.split(',');
            sortOptions[field] = (order === 'desc') ? -1 : 1; 
        } else {
            sortOptions.name = 1; 
        }

        const shelters = await Shelter.find(filterQuery).sort(sortOptions);

        // ⬅️ FIX: Correct the response structure for the frontend
        res.status(200).json({ success: true, count: shelters.length, shelters: shelters }); 
    } catch (error) {
        console.error("GET Shelters Error:", error.message);
        res.status(500).json({ message: 'Server error retrieving shelters.' });
    }
};

// --- PUT: Update Shelter Details ---
export const updateShelter = async (req, res) => {
    try {
        const ngoId = getLoggedInNgoId(req);
        if (!ngoId) return res.status(401).json({ message: 'Authentication required.' });

        const updatedShelter = await Shelter.findOneAndUpdate(
            { _id: req.params.id, ngoId }, 
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedShelter) {
            return res.status(404).json({ message: 'Shelter not found or unauthorized.' });
        }

        res.status(200).json({ success: true, message: "Shelter details updated.", data: updatedShelter });

    } catch (error) {
        console.error("UPDATE Shelter Error:", error.message);
        res.status(400).json({ message: 'Failed to update shelter.', error: error.message });
    }
};


// --- PUT: Allocate Shelter Space (Atomic Check-In Logic) ---
export const allocateShelterSpace = async (req, res) => {
    try {
        const ngoId = getLoggedInNgoId(req);
        if (!ngoId) return res.status(401).json({ message: 'Authentication required.' });

        // Ensure peopleCheckingIn is a safe integer (defaulting to 1)
        const peopleCheckingIn = parseInt(req.body.people) || 1; 
        
        // ⬅️ CRITICAL FIX: Fetch the shelter first to check totalCapacity
        const shelter = await Shelter.findById(req.params.id);

        if (!shelter || shelter.ngoId.toString() !== ngoId) {
            return res.status(404).json({ message: 'Shelter not found or unauthorized.' });
        }
        
        const newOccupancy = shelter.currentOccupancy + peopleCheckingIn;

        if (newOccupancy > shelter.totalCapacity) {
            // ⬅️ Specific error for full capacity
            return res.status(400).json({ message: 'Allocation failed: Shelter is already at full capacity.' });
        }

        // Use findOneAndUpdate with the capacity check based on the current state.
        // This is safer than the atomic $where/$expr for complex schema setups.
        const updatedShelter = await Shelter.findOneAndUpdate(
            { 
                _id: req.params.id, 
                ngoId,
                // Check capacity in the query: ensures currentOccupancy is NOT too high
                currentOccupancy: { $lte: shelter.totalCapacity - peopleCheckingIn }
            },
            { $inc: { currentOccupancy: peopleCheckingIn } }, // Atomically increase occupancy
            { new: true }
        );

        if (!updatedShelter) {
            // If findOneAndUpdate returns null, it means the query condition failed (i.e., the shelter filled up 
            // between the findById and findOneAndUpdate calls).
            return res.status(400).json({ message: 'Allocation failed due to concurrent update or full capacity.' });
        }

        res.status(200).json({ success: true, message: "Space allocated (Check-in successful).", data: updatedShelter });

    } catch (error) {
        console.error("ALLOCATE Shelter Error:", error.message);
        res.status(400).json({ message: 'Failed to allocate space (Data validation failed).' });
    }
};

// --- PUT: Deallocate Shelter Space (Check-Out Logic) ---
export const deallocateShelterSpace = async (req, res) => {
    try {
        const ngoId = getLoggedInNgoId(req);
        if (!ngoId) return res.status(401).json({ message: 'Authentication required.' });

        const peopleCheckingOut = parseInt(req.body.people) || 1;

        // Use $inc (decrement) for atomic update
        const updatedShelter = await Shelter.findOneAndUpdate(
            { 
                _id: req.params.id, 
                ngoId,
                // Ensure occupancy doesn't go below zero
                currentOccupancy: { $gte: peopleCheckingOut }
            },
            { $inc: { currentOccupancy: -peopleCheckingOut } }, // Atomically decrease occupancy
            { new: true }
        );

        if (!updatedShelter) {
            return res.status(400).json({ message: 'Deallocation failed: Occupancy is already zero or invalid ID.' });
        }

        res.status(200).json({ success: true, message: "Space deallocated (Check-out successful).", data: updatedShelter });

    } catch (error) {
        console.error("DEALLOCATE Shelter Error:", error.message);
        res.status(400).json({ message: 'Failed to deallocate space.', error: error.message });
    }
};

// --- DELETE: Delete Shelter ---
export const deleteShelter = async (req, res) => {
    try {
        const ngoId = getLoggedInNgoId(req);
        if (!ngoId) return res.status(401).json({ message: 'Authentication required.' });

        const result = await Shelter.findOneAndDelete({ 
            _id: req.params.id, 
            ngoId 
        });

        if (!result) {
            return res.status(404).json({ message: 'Shelter not found or unauthorized.' });
        }

        res.status(204).send(); 

    } catch (error) {
        console.error("DELETE Shelter Error:", error.message);
        res.status(500).json({ message: 'Failed to delete shelter.' });
    }
};