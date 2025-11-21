// /server/routes/ngoRoutes.js

import express from 'express';
// --- KEEP THIS IMPORT ---
import * as ngoController from '../controllers/ngoresource.js'; 
import { verifyToken, checkRole } from '../middleware/authMiddleware.js';

// All model imports (like ShelterModel) MUST be removed from here.

const router = express.Router(); 

// Middleware array to enforce JWT validation and 'ngo' role
const requireNgo = [
    verifyToken('JWT_SECRET_Ngo'), 
    checkRole('ngo'),
];

// NGO Resource Management Endpoints (Protected)

// 1. POST /ngo/resources
router.post('/resources', requireNgo, ngoController.updateResources);

// 2. POST /ngo/shelter-capacity
router.post('/shelter-capacity', requireNgo, ngoController.updateShelterCapacity);

// 3. GET /ngo/requests
router.get('/requests', requireNgo, ngoController.getAssignedRequests);
// 4. GET /ngo/dashboard
// *** NEW ROUTE FOR DYNAMIC DASHBOARD ***
// This route will use the NGO ID found in the JWT (extracted by verifyToken)
router.get('/dashboard', requireNgo, ngoController.getDashboardData);
// 4. POST /ngo/requests/fulfill/:requestId
// If you implement a `fulfillRequest` controller in the future, register it here.
// Example:
// router.post('/requests/fulfill/:requestId', requireNgo, ngoController.fulfillRequest);
export default router;