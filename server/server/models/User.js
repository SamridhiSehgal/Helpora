// models/User.js (Simplified Example)
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { 
        type: String, 
        enum: ['Admin', 'Staff', 'Volunteer'], // Key field for RBAC
        required: true 
    }
}, { timestamps: true });

// Method to compare password hash on login
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', userSchema);