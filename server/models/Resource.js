// models/Resource.js (If used for both Shelters and Inventory)

import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema({
    ngoId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    name: {
        type: String,
        required: [true, 'Resource name is required'],
        trim: true,
    },
    type: {
        type: String, // Tracks if it's 'Shelter' or 'Inventory'
        required: true,
    },
    quantity: {
        type: Number,
        default: 0,
        min: [0, 'Quantity cannot be negative.'] // CRITICAL Inventory Validation
    },
    status: {
        type: String,
        enum: ['Available', 'Depleted', 'Open', 'Full'],
        default: 'Available',
    },
    // Geo-Spatial Fields (Required for Shelters, optional for Inventory)
    location: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: { type: [Number] }, 
    },
}, { timestamps: true });

// CRITICAL: Ensure the 2dsphere index exists if this model is also used for Shelters
resourceSchema.index({ "location.coordinates": "2dsphere" }); 

export default mongoose.model('Resource', resourceSchema);