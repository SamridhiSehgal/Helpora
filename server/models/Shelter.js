import mongoose from 'mongoose';

const shelterSchema = new mongoose.Schema({
    // Link the shelter to the NGO that manages it
    ngoId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'NGO'
    },
    
    // Name of the shelter (e.g., 'Community Hall A', 'School Gym')
    name: {
        type: String,
        required: true,
        trim: true,
    },

    // Total capacity of the shelter (for smart allocation)
    totalCapacity: {
        type: Number,
        required: true,
        min: 0,
    },

    // Current occupancy (for calculating remaining capacity)
    currentOccupancy: {
        type: Number,
        default: 0,
        min: 0,
        // Custom validator to ensure occupancy doesn't exceed total capacity
        validate: {
            validator: function(v) {
                return v <= this.totalCapacity;
            },
            message: 'Current occupancy cannot exceed total capacity.'
        }
    },

    // Operational status of the shelter
    status: {
        type: String,
        enum: ['Open', 'Closed', 'Full', 'Pending'],
        default: 'Open',
        required: true,
    },
    
    // Contact information for the shelter site
    contactPhone: String,

    // GeoJSON location for map integration (Google Maps API)
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
    }
}, { timestamps: true });
{shelterSchema.index({ location: '2dsphere' });}
export default mongoose.model('Shelter', shelterSchema);