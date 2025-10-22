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
    location: { type :String },
    regno:{type:String,required:true},
})
const   ngoModel=mongoose.model('ngo',ngoSchema);
export default ngoModel;