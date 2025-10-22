import express from 'express';
import mongoose from 'mongoose'; // Assuming mongoose for MongoDB connection
import cors from 'cors'; 
import 'dotenv/config'; // Loads environment variables
import connectDb from './config/db.js'; // Database connection logic
import { ngoRouter, victimRouter } from './routes/auth.routes.js'; // Separated routers

// App Config
const app = express();
// Use port from environment variable, default to 4000
const port = process.env.PORT || 4000; 

// Database Connection
connectDb(); // Connects to MongoDB

// --- MIDDLEWARE ---
// 1. Body Parser (to read JSON data from POST requests)
app.use(express.json());

// 2. CORS (Allows frontend @ localhost:5173 to talk to backend @ localhost:4000)
// Using cors() without parameters allows requests from all origins during local development
app.use(cors()); 

// --- API ENDPOINTS ---
// All NGO authentication/resource routes start with /ngo
app.use('/ngo', ngoRouter);

// All Victim authentication/request routes start with /victim
app.use('/victim', victimRouter); 

// --- LISTEN ---
app.listen(port, () => console.log(`Helpora Backend Server listening on localhost:${port}`));

// Note: If you encounter a CORS error after this, explicitly configure the origin:
/*
app.use(cors({ 
    origin: 'http://localhost:5173', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
*/
