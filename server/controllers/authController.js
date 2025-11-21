import validator from "validator";
import bcrypt from "bcryptjs"; 
import jwt from "jsonwebtoken";
import ngoModel from "../models/ngo.model.js";
// Assuming victimModel is required here for Victim actions
import victimModel from "../models/Victim.js"; 


// Helper function to create JWT token for NGO
const createTokenNgo = (id, role = 'Admin') => {
    return jwt.sign({ 
        userId: id, 
        ngoId: id, 
        role: role
    }, process.env.JWT_SECRET_Ngo, {
        expiresIn: "1h",
    });
};

// Helper function to create JWT token for Victim (New Helper)
const createTokenVictim = (id) => {
    return jwt.sign({ 
        userId: id, 
        role: 'victim' 
    }, process.env.JWT_SECRET_Victim, {
        expiresIn: "1h", });
};


// --- NGO Registration Logic ---
export const registerNgo = async (req, res) => { 
    try {
        const { name, email, password, location, regno } = req.body;
        
        // Check 1: NGO already exists
        const ngoexists = await ngoModel.findOne({ email });
        if (ngoexists) {
            return res.status(409).json({ success: false, message: "NGO already exists" });
        }
        
        // Check 2: Validation
        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Invalid email format" });
        }
        if (password.length < 8) {
            return res.status(400).json({ success: false, message: "Password is not strong enough" });
        }
        
        // Hashing password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        // Creating and saving new NGO document
        const newNgo = new ngoModel({
            ...req.body,
            password: hashedPassword,
            role: 'Admin'
        });
        
        const ngo = await newNgo.save(); 
        
        const token = createTokenNgo(ngo._id.toString(), ngo.role);
        res.status(201).json({ success: true, token, message: "NGO registered" });

    } catch (error) {
        console.error("NGO Registration Error:", error);
        res.status(500).json({ success: false, message: "Server error during registration", error: error.message });
    }
}; 

// --- NGO Login Logic ---
export const loginNgo = async (req, res) => {
    try {
        const { email, password } = req.body;
        const ngo = await ngoModel.findOne({ email });
        
        if (!ngo) {
            return res.status(404).json({ success: false, message: "NGO not found" });
        }
        
        const isMatch = await bcrypt.compare(password, ngo.password);
        
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }
        
        const token = createTokenNgo(ngo._id.toString(), ngo.role);
        res.status(200).json({ success: true, token, message: "NGO logged in successfully", userName: ngo.name });
        
    } catch (error) {
        console.error("NGO Login Error:", error);
        res.status(500).json({ success: false, message: "Server error during login" });
    }
};

// --- Victim Login Logic (Missing Function) ---
export const loginVictim = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Assuming you have a model named victimModel
        const victim = await victimModel.findOne({ email }); 

        if (!victim) {
            return res.status(404).json({ success: false, message: "Victim not found" });
        }
        
        // FIX: You need the actual password field from victimModel to compare
        const isMatch = await bcrypt.compare(password, victim.password); 
        
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }
        
        const token = createTokenVictim(victim._id.toString());
        res.status(200).json({ success: true, token, message: "Victim logged in successfully", userName: victim.name }); 
    } catch (error) {
        console.error("Victim Login Error:", error);
        res.status(500).json({ success: false, message: "Server error during victim login" });
    }
};

// --- Victim Registration Logic (Missing Function) ---
export const registerVictim = async (req, res) => {
    try {
        const { name, email, password, location } = req.body;

        const victimexists = await victimModel.findOne({ email });
        if (victimexists) {
            return res.status(409).json({ success: false, message: "Victim already exists" });
        }
        
        if (!validator.isEmail(email) || password.length < 8) {
            return res.status(400).json({ success: false, message: "Invalid email or weak password" });
        }
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const newVictim = new victimModel({
            ...req.body,
            password: hashedPassword,
        });
        
        const victim = await newVictim.save();
        const token = createTokenVictim(victim._id.toString());
        
        res.status(201).json({ success: true, token, message: "Victim registered successfully" });
    } catch (error) {
        console.error("Victim Registration Error:", error);
        res.status(500).json({ success: false, message: "Server error during victim registration", error: error.message });
    }
};