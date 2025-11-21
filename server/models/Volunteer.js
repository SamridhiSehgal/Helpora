// models/Volunteer.js

import mongoose from 'mongoose';

const volunteerSchema = new mongoose.Schema({
    userId: { // Links to the user authentication system
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique: true
    },
    ngoId: { // Links to the parent NGO
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    role: {
        type: String,
        enum: ['Admin', 'Staff', 'Volunteer'],
        default: 'Volunteer',
        required: true
    },
    skills: {
        type: [String], // e.g., ['Medical Aid', 'Translation', 'Driving']
        default: []
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    contactPhone: String,
    lastActivity: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

export default mongoose.model('Volunteer', volunteerSchema);