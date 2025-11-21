// routes/beneficiaryRoutes.js (Content for the separate file)

import express from 'express';
// Assuming these are imported correctly from middleware/authMiddleware.js
import { checkRole } from '../middleware/authMiddleware.js'; 
import * as beneficiaryController from '../controllers/beneficiaryController.js'; 
import { ngoAuth } from '../middleware/authMiddleware.js'; 

const router = express.Router();

// Apply base authentication to all routes in this router
router.use(ngoAuth); 

router.route('/beneficiaries')
    // POST: Create a new aid request/profile (Staff/Admin only)
    .post(checkRole('Staff'), beneficiaryController.createBeneficiary)
    // GET: Retrieve all cases (Staff/Admin only)
    .get(checkRole('Staff'), beneficiaryController.getAllBeneficiaries);

export default router;