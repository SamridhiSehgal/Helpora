// controllers/volunteerController.js

import Volunteer from '../models/Volunteer.js';
import mongoose from 'mongoose';

const getLoggedInNgoId = (req) => {
    return req.user ? req.user.id : null; // Assumed NGO ID from middleware
};

// --- POST: Create/Register New Volunteer Profile ---
export const createVolunteer = async (req, res) => {
    try {
        const ngoId = getLoggedInNgoId(req);
        if (!ngoId) return res.status(401).json({ message: 'Authentication required' });

        const { userId, role, skills, contactPhone } = req.body;

        // Basic check to ensure the volunteer profile doesn't exist for this userId
        const existingVolunteer = await Volunteer.findOne({ userId });
        if (existingVolunteer) {
             return res.status(409).json({ message: 'Volunteer profile already exists for this user.' });
        }

        const volunteer = await Volunteer.create({ 
            userId, 
            ngoId, 
            role, 
            skills, 
            contactPhone 
        });

        res.status(201).json({ message: "Volunteer profile created.", data: volunteer });

    } catch (error) {
        console.error("VOLUNTEER CREATE Error:", error.message);
        res.status(400).json({ message: 'Failed to create volunteer profile.', error: error.message });
    }
};

// --- GET: Get All Volunteers (Admin/Staff only) ---
export const getVolunteers = async (req, res) => {
    try {
        const ngoId = getLoggedInNgoId(req);
        if (!ngoId) return res.status(401).json({ message: 'Authentication required' });

        // Find all volunteers belonging to the authenticated NGO
        const volunteers = await Volunteer.find({ ngoId }).sort({ lastActivity: -1 });

        res.status(200).json({ count: volunteers.length, data: volunteers });
    } catch (error) {
        console.error("VOLUNTEER READ Error:", error.message);
        res.status(500).json({ message: 'Server error retrieving volunteers.' });
    }
};

// --- GET: Get Volunteer By ID (MISSING FUNCTION) ---
export const getVolunteerById = async (req, res) => {
    try {
        const ngoId = getLoggedInNgoId(req);
        if (!ngoId) return res.status(401).json({ message: 'Authentication required' });

        const volunteer = await Volunteer.findOne({ _id: req.params.id, ngoId });

        if (!volunteer) {
            return res.status(404).json({ message: 'Volunteer not found or unauthorized.' });
        }

        res.status(200).json({ data: volunteer });
    } catch (error) {
        console.error("VOLUNTEER GET BY ID Error:", error.message);
        // CastError for invalid ObjectId will be caught here
        res.status(400).json({ message: 'Invalid Volunteer ID format.' });
    }
};


// --- PUT: Update Volunteer Profile (Skills, Availability, etc.) ---
export const updateVolunteer = async (req, res) => {
    try {
        const ngoId = getLoggedInNgoId(req);
        if (!ngoId) return res.status(401).json({ message: 'Authentication required' });

        const volunteer = await Volunteer.findOneAndUpdate(
            { _id: req.params.id, ngoId }, // Find by ID AND ensure NGO ownership
            { ...req.body, lastActivity: Date.now() },
            { new: true, runValidators: true }
        );

        if (!volunteer) {
            return res.status(404).json({ message: 'Volunteer not found or unauthorized.' });
        }

        res.status(200).json({ message: "Volunteer profile updated.", data: volunteer });
        
    } catch (error) {
        console.error("VOLUNTEER UPDATE Error:", error.message);
        res.status(400).json({ message: 'Failed to update volunteer profile.', error: error.message });
    }
};

// --- DELETE: Delete Volunteer Profile (MISSING FUNCTION) ---
export const deleteVolunteer = async (req, res) => {
    try {
        const ngoId = getLoggedInNgoId(req);
        if (!ngoId) return res.status(401).json({ message: 'Authentication required' });

        const result = await Volunteer.findOneAndDelete({ 
            _id: req.params.id, 
            ngoId // Ensure only the owner NGO can delete
        });

        if (!result) {
            return res.status(404).json({ message: 'Volunteer not found or unauthorized.' });
        }

        // 204 No Content is standard success for DELETE
        res.status(204).send(); 
    } catch (error) {
        console.error("VOLUNTEER DELETE Error:", error.message);
        res.status(500).json({ message: 'Failed to delete volunteer profile.' });
    }
};