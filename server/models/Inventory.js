import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema({
    // --- Ownership and Identification ---
    ngoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'NGO',
        required: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    
    // --- Resource Details ---
    category: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 0,
    },
    unit: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        default: 'Available',
        enum: ['Available', 'Low Stock', 'Reserved', 'Out of Stock'],
    },
    expiryDate: Date,
    
    // --- GeoJSON Location for Proximity Matching ---
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
}, { timestamps: true }); // ⬅️ CORRECT LOCATION FOR TIMESTAMPS AND CLOSING PARENTHESIS

// ⬅️ CRITICAL FIX: Explicitly define the 2dsphere index for Geo-queries ($geoNear)
inventorySchema.index({ location: '2dsphere' });
const Inventory = mongoose.model('Inventory', inventorySchema);
export default Inventory