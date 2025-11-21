// server.js (main entry point)

import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDb from './config/db.js'; // Assuming this exports a function to connect
import dashboardRoutes from './routes/dashboardRoutes.js';
// --- Import all structured route files ---
import { ngoAuthRouter, victimAuthRouter } from './routes/auth.routes.js';
import ngoRoutes from './routes/ngoRoutes.js';
import publicRoutes from './routes/publicRoutes.js';

import resourceRoutes from './routes/resourceRoutes.js';
import shelterRoutes from './routes/shelterRoutes.js';
import volunteerRoutes from './routes/volunteerRoutes.js';
import beneficiaryRoutes from './routes/beneficiaryRoutes.js'; 
import inventoryRoutes from './routes/inventoryRoutes.js';
// FIX: Add the Inventory Routes import
import victimRoutes from './routes/victimRoutes.js';

import aidRequestRoutes from "./routes/aidRequestRoute.js";

const app = express();
const port = process.env.PORT || 4000;


app.use(express.json());

// CORS configuration
app.use(cors({
  origin: "http://localhost:5173",  // your frontend
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"], // allow PATCH
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Routes
app.use("/api/aid-request", aidRequestRoutes);

app.listen(4000, () => console.log("Server running on port 4000"));

// app.use(cors({
//     // Allow requests from your frontend development server
//     origin: 'http://localhost:5173', 
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     credentials: true,
// }));

app.use(express.json());


// --- Middleware setup ---
app.use("/api/aid-request", aidRequestRoutes);

app.use(express.json()); // To parse JSON bodies
app.use('/victim', victimRoutes);
// --- Route Mounting Function ---
const configureRoutes = () => {
    // 1. Authentication Routes
    app.use('/ngo', ngoAuthRouter); 
    app.use('/victim', victimAuthRouter); 
    
    // 2. Protected NGO Routes (Management/Operations)
    app.use('/ngo', ngoRoutes); 
    app.use('/ngo', resourceRoutes);
    app.use('/ngo', shelterRoutes);
    app.use('/ngo', volunteerRoutes);
    app.use('/ngo', inventoryRoutes);
    // FIX: Mount the new Inventory Routes
    app.use('/ngo', inventoryRoutes); 
    app.use('/ngo', dashboardRoutes);
    // 3. Operational/Auxiliary Routes
    app.use('/ngo', beneficiaryRoutes); 
    app.use('/public', publicRoutes);
    
};

// Configure routes
configureRoutes();

// Connect to DB first, then start server
const start = async () => {
    try {
        // NOTE: Ensure your connectDb function is correctly implemented and works
        await connectDb(); 
        
        app.listen(port, () => {
            console.log(`Server running on http://localhost:${port}`);
        });
    } catch (err) {
        console.error('Failed to start server due to connection error:', err && err.message);
        process.exit(1);
    }
};

start();