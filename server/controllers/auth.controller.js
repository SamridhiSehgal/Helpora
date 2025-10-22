import validator from "validator";
import bcrypt from "bcryptjs"; // Or just 'bcrypt' if you prefer
import jwt from "jsonwebtoken";
import ngoModel from "../models/ngo.model.js";
import victimModel from "../models/victim.model.js";

// Helper function to create JWT token (assuming you have a JWT_SECRET in .env)
const createTokenNgo = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET_Ngo, {
        expiresIn: "1h", // Token expires in 1 hour
    });
};
// Helper function to create JWT token (assuming you have a JWT_SECRET in .env)
const createTokenVictim = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET_Victim, {
        expiresIn: "1h", // Token expires in 1 hour
    });
};

// ===========================================
// NGO Controllers
// ===========================================

// Route for NGO login
const loginNgo = async (req, res) => {
    try{
        const{email,password}=req.body;
        //checking ngo exists or not
        const ngo=await ngoModel.findOne({email});
        if(!ngo){
            return res.json({success:false,message:"NGO not found"});
        }
        //comparing password
        const isMatch=await bcrypt.compare(password,ngo.password);
        if(!isMatch){
            return res.json({success:false,message:"Invalid credentials"});
        }
        const token=createTokenNgo(ngo.id);
        res.json({success:true,token,message:"NGO logged in successfully"});
    }
    catch(error){
    }
};
// Route for victim login
const loginVictim = async (req, res) => {
    try{
        const {email,password}=req.body;
        //checking ngo exists or not
        const victim=await victimModel.findOne({email});
        if(!victim){
            return res.json({success:false,message:"Victim not found"});
        }
        //comparing password
        const isMatch=await bcrypt.compare(password,victim.password);
        if(!isMatch){
            return res.json({success:false,message:"Invalid credentials"});
        }
        const token=createTokenVictim(victim.id);
        res.json({success:true,token,message:"Victim logged in successfully"}); 
    }
    catch(error){
    console.log(error);
    res.json({success:false,message:"Server error"});

    }
};
// Route for NGO registration
const registerNgo = async (req, res) => {
    try{
        const {name,email,password,phone,address,city,state,zip,location,regno}=req.body;
        ///checking ngo already exits or not
        const ngoexists=await ngoModel.findOne({email});
        if(ngoexists){
            return res.json({success:false,message:"NGO already exists"});
        }
        //validating email format and strong password
        if(!validator.isEmail(email)){
                return res.json({success:false,message:"Invalid email format"});
        }
        if(password.length<8)
        {
            return res.json({success:false,message:"Password is not string enough"});
        }
        //hasing ngipassword
        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt);
        //creating new ngo
        const newNgo=new ngoModel({
            name,
            email,
            password:hashedPassword,
            phone,
            address,
            city,
            state,
            zip,
            location,
            regno

        })
        const ngo=await newNgo.save();
        const token=createTokenNgo(ngo.id);
        res.json({success:true,token,message:"NGO registerees"});
    }
    catch(error){
    console.log(error);
    res.json({success:false,message:"Server error"});
}
}  ;
  
// ===========================================
// Victim Controllers
// ===========================================

// Route for victim login
const registerVictim = async (req, res) => {
     try{
        const {name,email,password,phone,address,city,state,zip,location,regno}=req.body;
        ///checking ngo already exits or not
        const victimexists=await victimModel.findOne({email});
        if(victimexists){
            return res.json({success:false,message:"Victim already exists"});
        }
         //validating email format and strong password
        if(!validator.isEmail(email)){
                return res.json({success:false,message:"Invalid email format"});
        }
        
        if(password.length<8)
        {
            return res.json({success:false,message:"Password is not string enough"});
        }
        //hasing victimpassword
        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt);
         //creating new victim
        const newVictim=new victimModel({
            name,
            email,
            password:hashedPassword,
            phone,
            address,
            city,
            state,
            zip,
            location,
          

        })
         const victim=await newVictim.save();
        const token=createTokenVictim(victim.id);
        res.json({success:true,token,message:"Victim registered successfully"});
    }
catch(error){
    console.log(error);
    res.json({success:false,message:"Server error"});}
}  ;

export { loginNgo, registerNgo, loginVictim, registerVictim };