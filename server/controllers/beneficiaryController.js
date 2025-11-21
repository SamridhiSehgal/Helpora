// controllers/beneficiaryController.js

import Beneficiary from '../models/Beneficiary.js';
import mongoose from 'mongoose';

const getLoggedInNgoId = (req) => {
    return req.user ? req.user.ngoId : null;
};

// --- POST: Create New Beneficiary/Aid Request ---
export const createBeneficiary = async (req, res) => {
    try {
        const ngoId = getLoggedInNgoId(req);
        if (!ngoId) return res.status(401).json({ message: 'Authentication required' });

        const beneficiary = await Beneficiary.create({ ...req.body, ngoId });

        res.status(201).json({ 
            message: "Beneficiary case file created.",
            data: beneficiary
        });

    } catch (error) {
        console.error("BENEFICIARY CREATE Error:", error.message);
        res.status(400).json({ 
            message: 'Failed to create beneficiary case file.', 
            error: error.message 
        });
    }
};

// --- GET: Get All Beneficiaries ---
export const getAllBeneficiaries = async (req, res) => {
    try {
        const ngoId = getLoggedInNgoId(req);
        if (!ngoId) return res.status(401).json({ message: 'Authentication required' });

        const beneficiaries = await Beneficiary.find({ ngoId }).sort({ createdAt: -1 });

        res.status(200).json({ count: beneficiaries.length, data: beneficiaries });
    } catch (error) {
        console.error("BENEFICIARY READ Error:", error.message);
        res.status(500).json({ message: 'Server error retrieving beneficiaries.' });
    }
};