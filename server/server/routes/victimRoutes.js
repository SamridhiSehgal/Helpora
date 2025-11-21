import express from 'express';
import * as victimController from '../controllers/victimController.js';

const router = express.Router();

// Public route for submitting aid requests
router.route('/request')
    // POST: Submit New Aid Request
    .post(victimController.submitAidRequest); 

// Route for checking status (example of a parameterized route)
router.route('/request/:id/status')
    .get(victimController.getRequestStatus);

export default router;