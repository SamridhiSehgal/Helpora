import mongoose from "mongoose";
const ngoSchema=new mongoose.Schema
({
    name:{type:String,required:true},
    email:{type:String,required:true},
    password:{type:String,required:true},
    phone:{type:String},
    address:{type:String,required:true},
    city: { type: String },
    state: { type: String },
    zip: { type: String },  
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        role: {
        type: String,
        enum: ['Admin', 'Staff', 'Volunteer'],
        default: 'Admin' // Assuming the initial registrant is the Admin
    },
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: true
        }
    },
    regno:{type:String,required:true},
})
const   ngoModel=mongoose.model('ngo',ngoSchema);
export default ngoModel;