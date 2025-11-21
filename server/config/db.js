// config/db.js (Example structure)

import mongoose from 'mongoose';

// Ensure MONGO_URI is available via process.env
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/helpora_db';

const connectDb = async () => {
    mongoose.connection.on('connected', () => {
        console.log("MongoDB connection established.");
    })
    
        await mongoose.connect(`${process.env.MONGO_URI}/helpora_db`)
    
}

export default connectDb;