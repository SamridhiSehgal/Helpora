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

        const newShelter = new Shelter({
            ...req.body,
            ngoId 
        });

        const shelter = await newShelter.save();

        res.status(201).json({ success: true, message: "Shelter created successfully.", data: shelter });

    } catch (error) {
        console.error("CREATE Shelter Error:", error.message);
        res.status(400).json({ message: 'Failed to create shelter.', error: error.message });
    }
};


// --- GET: Get All Shelters (with Advanced Filtering and Sorting) ---
export const getShelters = async (req, res) => {
    try {
        const ngoIdString = getLoggedInNgoId(req);
        if (!ngoIdString) return res.status(401).json({ message: 'Authentication required.' });

        // CRITICAL FIX 1: Convert the string ID from the token into a Mongoose ObjectId 
        const ngoId = new mongoose.Types.ObjectId(ngoIdString); 
        
        // Base query: only find shelters belonging to the authenticated NGO
        const filterQuery = { ngoId: ngoId };
        const sortOptions = {};

        // 1. Filtering by Status (e.g., status=Open)
        if (req.query.status) {
            const statusValue = req.query.status.trim();
            // CRITICAL FIX 2: Use $regex for case-insensitive matching
            filterQuery.status = { $regex: new RegExp(`^${statusValue}$`, 'i') }; 
        }

        // 2. Dynamic Sorting (e.g., sort=totalCapacity,desc)
        if (req.query.sort) {
            const [field, order] = req.query.sort.split(',');
            sortOptions[field] = (order === 'desc') ? -1 : 1; 
        } else {
            sortOptions.name = 1; // Default sort
        }

        const shelters = await Shelter.find(filterQuery).sort(sortOptions);

        res.status(200).json({ success: true, count: shelters.length, data: shelters });
    } catch (error) {
        console.error("GET Shelters Error:", error.message);
        res.status(500).json({ message: 'Server error retrieving shelters.' });
    }
};

// --- PUT: Update Shelter Placeholder (FIX for TypeError) ---
export const updateShelter = async (req, res) => {
    try {
        const ngoId = getLoggedInNgoId(req);
        if (!ngoId) return res.status(401).json({ message: 'Authentication required.' });

        // Find the shelter by its ID AND ensure it belongs to the authenticated NGO (Ownership Check)
        const updatedShelter = await Shelter.findOneAndUpdate(
            { _id: req.params.id, ngoId }, 
            req.body,
            { new: true, runValidators: true } // Return the updated document and run schema validation
        );

        if (!updatedShelter) {
            return res.status(404).json({ message: 'Shelter not found or unauthorized.' });
        }

        res.status(200).json({ success: true, message: "Shelter details updated.", data: updatedShelter });

    } catch (error) {
        console.error("UPDATE Shelter Error:", error.message);
        // Catches validation errors, e.g., if totalCapacity is set lower than currentOccupancy
        res.status(400).json({ message: 'Failed to update shelter.', error: error.message });
    }
};
export const allocateShelterSpace = async (req, res) => {
    try {
        const ngoId = getLoggedInNgoId(req);
        if (!ngoId) return res.status(401).json({ message: 'Authentication required.' });

        // Assuming req.body contains the number of people checking in (default to 1)
        const peopleCheckingIn = req.body.people || 1;

        const shelter = await Shelter.findOne({ _id: req.params.id, ngoId });

        if (!shelter) {
            return res.status(404).json({ message: 'Shelter not found or unauthorized.' });
        }

        // Check for capacity before allocating
        if (shelter.currentOccupancy + peopleCheckingIn > shelter.totalCapacity) {
            return res.status(400).json({ message: 'Allocation failed: Shelter is full.' });
        }

        // Increase occupancy
        shelter.currentOccupancy += peopleCheckingIn;
        await shelter.save();

        res.status(200).json({ success: true, message: "Space allocated (Check-in successful).", data: shelter });

    } catch (error) {
        console.error("ALLOCATE Shelter Error:", error.message);
        res.status(400).json({ message: 'Failed to allocate space.', error: error.message });
    }
};

// --- PUT: Deallocate Shelter Space (Check-Out Logic) ---
export const deallocateShelterSpace = async (req, res) => {
    try {
        const ngoId = getLoggedInNgoId(req);
        if (!ngoId) return res.status(401).json({ message: 'Authentication required.' });

        // Assuming req.body contains the number of people checking out (default to 1)
        const peopleCheckingOut = req.body.people || 1;

        const shelter = await Shelter.findOne({ _id: req.params.id, ngoId });

        if (!shelter) {
            return res.status(404).json({ message: 'Shelter not found or unauthorized.' });
        }

        // Ensure occupancy doesn't go below zero
        if (shelter.currentOccupancy < peopleCheckingOut) {
            shelter.currentOccupancy = 0;
        } else {
            // Decrease occupancy
            shelter.currentOccupancy -= peopleCheckingOut;
        }
        await shelter.save();

        res.status(200).json({ success: true, message: "Space deallocated (Check-out successful).", data: shelter });

    } catch (error) {
        console.error("DEALLOCATE Shelter Error:", error.message);
        res.status(400).json({ message: 'Failed to deallocate space.', error: error.message });
    }
};
// --- DELETE: Delete Shelter Placeholder (FIX for TypeError) ---
// controllers/shelterController.js

// --- DELETE: Delete Shelter ---
export const deleteShelter = async (req, res) => {
    try {
        const ngoId = getLoggedInNgoId(req);
        if (!ngoId) return res.status(401).json({ message: 'Authentication required.' });

        // Find and delete the shelter, ensuring it belongs to the NGO
        const result = await Shelter.findOneAndDelete({ 
            _id: req.params.id, 
            ngoId 
        });

        if (!result) {
            return res.status(404).json({ message: 'Shelter not found or unauthorized.' });
        }

        // 204 No Content is the standard success response for DELETE
        res.status(204).send(); 

    } catch (error) {
        console.error("DELETE Shelter Error:", error.message);
        res.status(500).json({ message: 'Failed to delete shelter.' });
    }

};