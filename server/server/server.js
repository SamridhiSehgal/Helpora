// // server.js (main entry point)

// import express from 'express';
// import 'dotenv/config';
// import connectDb from './config/db.js'; // Assuming this exports a function to connect
// import dashboardRoutes from './routes/dashboardRoutes.js';
// // --- Import all structured route files ---
// import { ngoAuthRouter, victimAuthRouter } from './routes/auth.routes.js';
// import ngoRoutes from './routes/ngoRoutes.js';

// import resourceRoutes from './routes/resourceRoutes.js';
// import shelterRoutes from './routes/shelterRoutes.js';
// import volunteerRoutes from './routes/volunteerRoutes.js';
// import beneficiaryRoutes from './routes/beneficiaryRoutes.js'; 
// import inventoryRoutes from './routes/inventoryRoutes.js';
// // FIX: Add the Inventory Routes import
// import victimRoutes from './routes/victimRoutes.js';

// const app = express();
// const port = process.env.PORT || 4000;

// // --- Middleware setup ---
// app.use(express.json()); // To parse JSON bodies
// app.use('/victim', victimRoutes);
// // --- Route Mounting Function ---
// const configureRoutes = () => {
//     // 1. Authentication Routes
//     app.use('/ngo', ngoAuthRouter); 
//     app.use('/victim', victimAuthRouter); 
    
//     // 2. Protected NGO Routes (Management/Operations)
//     app.use('/ngo', ngoRoutes); 
//     app.use('/ngo', resourceRoutes);
//     app.use('/ngo', shelterRoutes);
//     app.use('/ngo', volunteerRoutes);
//     app.use('/ngo', inventoryRoutes);
//     // FIX: Mount the new Inventory Routes
//     app.use('/ngo', inventoryRoutes); 
//     app.use('/ngo', dashboardRoutes);
//     // 3. Operational/Auxiliary Routes
//     app.use('/ngo', beneficiaryRoutes); 
    
// };

// // Configure routes
// configureRoutes();

// // Connect to DB first, then start server
// const start = async () => {
//     try {
//         // NOTE: Ensure your connectDb function is correctly implemented and works
//         await connectDb(); 
        
//         app.listen(port, () => {
//             console.log(`Server running on http://localhost:${port}`);
//         });
//     } catch (err) {
//         console.error('Failed to start server due to connection error:', err && err.message);
//         process.exit(1);
//     }
// };

// start();