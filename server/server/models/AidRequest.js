import mongoose from 'mongoose';

const aidRequestSchema = new mongoose.Schema({
    victimId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Victim', 
        required: true,
    },
    trackingToken: {
        type: String,
        required: true,
        unique: true, // Ensure no two tokens are the same
        index: true
    },
    
    // Status set by the matching service or NGO staff
    requestStatus: {
        type: String,
        enum: ['Pending', 'Assigned', 'InProgress', 'Fulfilled', 'Canceled'],
        default: 'Pending',
    },
    status: {
        type: String,
        enum: ['pending', 'queued', 'matched', 'fulfilled', 'closed'],
        default: 'pending',
    },
    
    assignedNgoId: {
        type: String, // Stored as a string
        required: false,
    },

    requiredResources: {
        type: Map, 
        of: Number,
        required: true,
    },

    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    
    priorityLevel: {
        type: Number,
        default: 1, 
    },

}, { timestamps: true });

aidRequestSchema.index({ location: '2dsphere' });

const RequestModel = mongoose.model('AidRequest', aidRequestSchema);
export default RequestModel;