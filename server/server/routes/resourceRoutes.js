// routes/resourceRoutes.js
import express from 'express';
import * as resourceController from '../controllers/resourceController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();
// Require NGO token by default
const requireNgo = verifyToken('JWT_SECRET_Ngo');

// Dashboard Retrieval and Create
router.route('/resources')
    .get(requireNgo, resourceController.getResources)   // GET all (for dashboard)
    .post(requireNgo, resourceController.createResource); // POST (add new inventory/project)

// Update
router.route('/resources/:id')
    .put(requireNgo, resourceController.updateResource); // PUT (update resource/inventory item)

export default router;