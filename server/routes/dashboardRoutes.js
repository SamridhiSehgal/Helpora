import express from 'express';
import * as dashboardController from '../controllers/dashboardController.js';
import { ngoAuth } from '../middleware/authMiddleware.js'; 

const router = express.Router();

// Apply base NGO authentication (checks token validity) to ALL routes
router.use(ngoAuth); 

// Route to get all summary data for the dashboard
router.route('/dashboard/summary')
    // GET: Dashboard Summary
    .get(dashboardController.getDashboardSummary); 

export default router;