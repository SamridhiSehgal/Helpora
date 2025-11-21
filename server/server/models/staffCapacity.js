import mongoose from 'mongoose';

//human resources - staff capacity
const staffCapacitySchema=new mongoose.Schema({
    ngo:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'NGO',
        required:true
    },
    //type of staff.service(worker,volunteer,medical personnel etc)
     // Type of staff/service (e.g., "Medical Staff", "Counselors", "Drivers")
    staffType: { 
        type: String, 
        required: true, 
        trim: true,
        uppercase: true, // Standardize staff names
    },
    
    // Number of people available for this staff type
    count: { 
        type: Number, 
        required: true, 
        min: 0, 
        default: 0 
    },

    // Optional: Geographic coordinates for the staff's base or availability area
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point',
        },
        coordinates: [Number] // [longitude, latitude]
    },

    // Date/time of the last capacity update
    lastUpdated: { 
        type: Date, 
        default: Date.now 
    },
    
    // Optional: Notes on availability, shift times, or specific skills
    notes: { 
        type: String, 
        trim: true 
    }
});

// Enforces that an NGO can only have one entry for a specific 'staffType'.
staffCapacitySchema.index({ ngo: 1, staffType: 1 }, { unique: true });

const StaffCapacityModel = mongoose.model('StaffCapacity', staffCapacitySchema);
export default StaffCapacityModel;
