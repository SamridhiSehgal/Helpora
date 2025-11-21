import mongoose from 'mongoose';

const victimSchema = new mongoose.Schema({
    // Personal Information
    name: {
        type: String,
        required: true,
        trim: true,
    },
    contactPhone: String,
    email: {
    type: String,
    // Add unique: true to match the error, and sparse: true to allow multiple nulls
    unique: true, 
    sparse: true 
},
    // Resource Request Information
    resourcesRequested: {
        type: [String], // e.g., ['Food', 'Medicine', 'Water']
        required: true,
    },
    urgencyLevel: {
        type: String,
        enum: ['Low', 'Medium', 'High', 'Critical'],
        default: 'Medium',
    },
    
    // GeoJSON location of the victim (CRITICAL for proximity matching)
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point',
            required: true,
        },
        coordinates: { // Stores coordinates as [longitude, latitude]
            type: [Number],
            required: true,
            validate: {
                validator: function(v) {
                    return v && v.length === 2;
                },
                message: 'Coordinates must contain two numbers: [longitude, latitude]'
            }
        }
    },

    // Status of the request in the system
    requestStatus: {
        type: String,
        enum: ['Pending', 'Assigned', 'InProgress', 'Fulfilled', 'Canceled'],
        default: 'Pending',
    },

    // ID of the assigned NGO/Shelter (for tracking)
    assignedNgoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'NGO',
    }

}, { timestamps: true });
{victimSchema.index({ location: '2dsphere' });}
export default mongoose.model('Victim', victimSchema);