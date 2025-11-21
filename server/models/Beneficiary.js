// models/Beneficiary.js

import mongoose from 'mongoose';

const beneficiarySchema = new mongoose.Schema({
    ngoId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    caseFileNumber: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    currentLocation: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: { type: [Number], required: true }, // [longitude, latitude]
    },
    needsShelter: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ['Pending', 'Aided', 'Closed'],
        default: 'Pending'
    },
}, { timestamps: true });

export default mongoose.model('Beneficiary', beneficiarySchema);