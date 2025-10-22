import mongoose from 'mongoose';

const victimSchema = new mongoose.Schema({
    // ... your ngo schema fields
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    address: { type: String, required: true },
    city: { type: String },
    state: { type: String },
    zip: { type: String },  
    location: { type :String }
}, { timestamps: true });

const victimModel = mongoose.model('victim', victimSchema);
export default victimModel; // <--- This line is the fix