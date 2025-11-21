// src/routes/publicRoutes.js

import express from 'express';
import * as publicController from '../controllers/publicController.js'; // ⬅️ Controller for getPublicRequestStatus

const router = express.Router();

// Define the public status check route: /public/status/:id/:token
router.get('/status/:id/:token', publicController.getPublicRequestStatus);

export default router;