// routes/volunteerRoutes.js

import express from 'express';
import * as volunteerController from '../controllers/volunteerController.js';
import { ngoAuth, checkRole } from '../middleware/authMiddleware.js'; // Imports base auth and role checker

const router = express.Router();

// Apply base NGO authentication (checks token validity) to ALL routes in this file
router.use(ngoAuth); 

// --- BASE COLLECTION ROUTES ---
// Handles GET /ngo/volunteers (Get All) and POST /ngo/volunteers (Create new profile)
router.route('/volunteers')
    // POST: Create/Register New Volunteer Profile
    // REQUIRES ADMIN role to create new user accounts for security.
    .post(checkRole('Staff'), volunteerController.createVolunteer)
    
    // GET: Get All Volunteers (Requires Staff role or higher to view the list)
    .get(checkRole('Staff'), volunteerController.getVolunteers);

// --- PARAMETERIZED ROUTES ---
// Handles actions requiring a specific ID (/ngo/volunteers/:id)
router.route('/volunteers/:id')
    // GET: Retrieve a single volunteer profile (No explicit role check, relying on ownership filter in controller)
    .get(volunteerController.getVolunteerById) 
    
    // PUT: Update Volunteer Profile (Requires Staff role to modify data)
    .put(checkRole('Staff'), volunteerController.updateVolunteer) 
    
    // DELETE: Delete Volunteer Profile 
    // REQUIRES ADMIN role for permanent deletion (CRITICAL RBAC TEST POINT)
    .delete(checkRole('Admin'), volunteerController.deleteVolunteer);


export default router;