import express from 'express';
// Import ALL CONTROLLER functions from the single controller file
import { 
    loginNgo, 
    registerNgo, 
    loginVictim, 
    registerVictim 
} from '../controllers/authController.js';

const ngoAuthRouter = express.Router();
const victimAuthRouter = express.Router();

// --- NGO Authentication Routes ---
// The final URL will be: /api/v1/ngo/login
ngoAuthRouter.post('/login', loginNgo); 
ngoAuthRouter.post('/register', registerNgo);

// --- Victim Authentication Routes ---
// The final URL will be: /api/v1/victim/login
victimAuthRouter.post('/login', loginVictim);
victimAuthRouter.post('/register', registerVictim);

export { ngoAuthRouter, victimAuthRouter };