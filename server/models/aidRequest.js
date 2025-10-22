import mongoose from 'mongoose';

// Defines a request for aid made by a victim and tracks its fulfillment
const aidRequestSchema = new mongoose.Schema({
    // Link to the user who made the request (The Seeker)
    victim: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Victim', 
        required: true 
    },
    
    // Resource being requested (e.g., "Food Kits", "Medical Staff")
    resourceType: { 
        type: String, 
        required: true, 
        trim: true,
        uppercase: true,
        // This must match entries in InventoryItem.itemType or StaffCapacity.staffType
    },
    
    // Quantity or count requested
    quantityRequested: { 
        type: Number, 
        required: true, 
        min: 1 
    },
    
    // Status of the request lifecycle
    status: {
        type: String,
        enum: ['PENDING', 'PROCESSING', 'FULFILLED', 'CANCELLED', 'UNAVAILABLE'],
        default: 'PENDING',
        required: true
    },
    
    // NGO assigned to fulfill the request (null if pending or unassigned)
    ngoAssigned: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'NGO', 
        default: null 
    },

    // The location where the aid is needed 
    location: {
        type: {
            type: String,
            enum: ['Point'], 
            default: 'Point',
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: true
        }
    },

    // Timestamp when the NGO accepted the request
    assignmentDate: {
        type: Date,
        default: null
    },

    // Additional details about the need
    description: { 
        type: String, 
        trim: true 
    },
}, { timestamps: true });

// Create a geospatial index to allow quick matching of requests to nearby NGOs
aidRequestSchema.index({ location: '2dsphere' });

const AidRequestModel = mongoose.model('AidRequest', aidRequestSchema);
export default AidRequestModel;
