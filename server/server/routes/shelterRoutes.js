import express from 'express';
import * as shelterController from '../controllers/shelterController.js';
import { ngoAuth, checkRole } from '../middleware/authMiddleware.js'; // Use your existing middleware

const router = express.Router();

// Apply base NGO authentication (checks token validity) to ALL routes in this file
router.use(ngoAuth); 

// --- BASE COLLECTION ROUTES ---
router.route('/shelters')
    // GET: Get All Shelters (Read with Advanced Filtering)
    .get(shelterController.getShelters) 
    
    // POST: Create New Shelter
    .post(checkRole('Staff'), shelterController.createShelter); 
    

// --- PARAMETERIZED ROUTES ---
router.route('/shelters/:id')
    // PUT: Update Shelter (Uses placeholder)
    .put(checkRole('Staff'), shelterController.updateShelter) 
    
    // DELETE: Delete Shelter (Uses placeholder)
    .delete(checkRole('Admin'), shelterController.deleteShelter);
router.route('/shelters/:id/allocate')
.put(checkRole('Staff'), shelterController.allocateShelterSpace);
router.route('/shelters/:id/deallocate')
.put(checkRole('Staff'), shelterController.deallocateShelterSpace);
export default router;