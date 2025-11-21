// src/routes/victimRoutes.js

import express from 'express';
// ⬅️ FIX: Ensure you are importing the functions by name.
import { 
    submitAidRequest, 
    getVictimRequests 
} from '../controllers/victimController.js'; 


const router = express.Router();


router.post('/request', submitAidRequest);

// Line 13 should now correctly reference the imported function
router.get('/history', getVictimRequests); 

export default router;