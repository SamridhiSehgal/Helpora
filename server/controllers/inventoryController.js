import Inventory from '../models/Inventory.js';
import mongoose from 'mongoose'; // <-- CRITICAL FIX: Ensure Mongoose is imported

// Helper function to get the authenticated NGO's ID from the middleware
const getLoggedInNgoId = (req) => {
    // Assuming ngoAuth middleware places the NGO's ID on req.user.ngoId
    return req.user ? req.user.ngoId : null; 
};

// Helper function to check the user's role (not used directly in this function but useful)
// const getUserRole = (req) => {
//     return req.user ? req.user.role : null;
// };


// --- GET: Get All Inventory Items (with Filtering and Sorting) ---
export const getInventoryItems = async (req, res) => {
    try {
        const ngoIdString = getLoggedInNgoId(req);
        if (!ngoIdString) return res.status(401).json({ message: 'Authentication required.' });

        // CRITICAL FIX: Convert the string ID from the token into a Mongoose ObjectId 
        const ngoId = new mongoose.Types.ObjectId(ngoIdString); 
        
        // Base query: only find items belonging to the authenticated NGO
        const filterQuery = { ngoId: ngoId };
        const sortOptions = {};
        
        // --- DEBUG LINES ---
        console.log("Query Parameters Received:", req.query); 
        // -------------------

        // 1. Filtering by Category (e.g., ?category=Food)
        if (req.query.category) {
            // Add category filter to the query object
            filterQuery.category = req.query.category; 
        }

        // 2. Filtering by Status (e.g., ?status=Available)
        if (req.query.status) {
            filterQuery.status = req.query.status; 
        }

        // 3. Dynamic Sorting (e.g., ?sort=quantity,desc)
        if (req.query.sort) {
            const [field, order] = req.query.sort.split(',');
            sortOptions[field] = (order === 'desc') ? -1 : 1; 
        } else {
            // Default sort option
            sortOptions.name = 1; 
        }
        
        // --- DEBUG LINE ---
        console.log("Final Filter Query Executed:", filterQuery);
        // -------------------

        const items = await Inventory.find(filterQuery).sort(sortOptions);

        res.status(200).json({ success: true, count: items.length, data: items });
    } catch (error) {
        console.error("GET Inventory Error:", error.message);
        res.status(500).json({ message: 'Server error retrieving inventory.' });
    }
};

// --- POST: Add New Inventory Item ---
export const addItem = async (req, res) => {
    try {
        const ngoId = getLoggedInNgoId(req);
        if (!ngoId) return res.status(401).json({ message: 'Authentication required.' });

        // Include the authenticated ngoId in the item creation
        const newItem = await Inventory.create({ 
            ...req.body,
            ngoId 
        });

        res.status(201).json({ success: true, message: "Inventory item added.", data: newItem });

    } catch (error) {
        console.error("ADD Item Error:", error.message);
        res.status(400).json({ message: 'Failed to add item.', error: error.message });
    }
};


// --- PUT: Update Inventory Item ---
export const updateItem = async (req, res) => {
    try {
        const ngoId = getLoggedInNgoId(req);
        if (!ngoId) return res.status(401).json({ message: 'Authentication required.' });
        
        const updatedItem = await Inventory.findOneAndUpdate(
            { _id: req.params.id, ngoId }, 
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedItem) {
            return res.status(404).json({ message: 'Item not found or unauthorized.' });
        }

        res.status(200).json({ success: true, message: "Inventory item updated.", data: updatedItem });

    } catch (error) {
        console.error("UPDATE Item Error:", error.message);
        res.status(400).json({ message: 'Failed to update item.', error: error.message });
    }
};


// --- DELETE: Delete Inventory Item ---
export const deleteItem = async (req, res) => {
    try {
        const ngoId = getLoggedInNgoId(req);
        if (!ngoId) return res.status(401).json({ message: 'Authentication required.' });

        const result = await Inventory.findOneAndDelete({ 
            _id: req.params.id, 
            ngoId 
        });

        if (!result) {
            return res.status(404).json({ message: 'Item not found or unauthorized.' });
        }

        res.status(204).send(); 

    } catch (error) {
        console.error("DELETE Item Error:", error.message);
        res.status(500).json({ message: 'Failed to delete item.' });
    }
};