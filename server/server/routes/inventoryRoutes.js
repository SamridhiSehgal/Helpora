import express from 'express';
import * as inventoryController from '../controllers/inventoryController.js';
import { ngoAuth, checkRole } from '../middleware/authMiddleware.js'; // Use your existing middleware

const router = express.Router();

// Apply base NGO authentication (checks token validity) to ALL routes in this file
router.use(ngoAuth); 

// --- BASE COLLECTION ROUTES ---
// Handles GET /ngo/inventory (Get All with filtering) and POST /ngo/inventory (Create new item)
router.route('/inventory')
    // GET: Get All Inventory Items (Read)
    // Allows any authenticated NGO user (Admin, Staff, Volunteer) to view the list.
    .get(inventoryController.getInventoryItems) 
    
    // POST: Add New Inventory Item (Create)
    // Requires 'Staff' role or higher to modify/add resources.
    .post(checkRole('Staff'), inventoryController.addItem); 
    

// --- PARAMETERIZED ROUTES ---
// Handles actions requiring a specific item ID (/ngo/inventory/:id)
router.route('/inventory/:id')
    // PUT: Update Inventory Item (Update)
    // Requires 'Staff' role or higher to modify resources.
    .put(checkRole('Staff'), inventoryController.updateItem) 
    
    // DELETE: Delete Inventory Item (Delete)
    // Requires 'Admin' role for permanent deletion (high privilege).
    .delete(checkRole('Admin'), inventoryController.deleteItem);


export default router;