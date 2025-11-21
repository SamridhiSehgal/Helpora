// routes/aidRequestRoute.js
import express from "express";
import crypto from "crypto";
import RequestModel from "../models/aidRequest.js";

const router = express.Router();

// Create a new aid request
router.post("/create", async (req, res) => {
  try {
    console.log("POST /create body received:", req.body);  // <-- log incoming data

    const { victimName, contactPhone, description, requiredResources, location, priorityLevel } = req.body;

    // Validate required fields
    if (!victimName || !requiredResources || !location?.coordinates) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Generate a tracking token
    const trackingToken = crypto.randomBytes(4).toString("hex");

    // Create AidRequest instance
    const aidRequest = new RequestModel({
      victimName,
      victimPhone: contactPhone,
      description,
      trackingToken,
      requiredResources,
      location,
      priorityLevel,
    });

    await aidRequest.save();  // <-- save after creating it

    res.status(201).json({ request: aidRequest });
  } catch (err) {
    console.error("Error saving aid request:", err);
    res.status(500).json({ error: "Failed to create aid request" });
  }
});

// GET all aid requests
router.get("/", async (req, res) => {
  try {
    const requests = await RequestModel.find().populate("victimId");
    res.json(requests);
  } catch (err) {
    console.error("Error fetching all aid requests:", err);
    res.status(500).json({ error: "Failed to fetch aid requests." });
  }
});

// GET by id & token
router.get("/:id/:trackingToken", async (req, res) => {
  try {
    const { id, trackingToken } = req.params;
    const request = await RequestModel.findOne({ _id: id, trackingToken });
    if (!request) return res.status(404).json({ error: "No request found for this token." });
    res.json(request);
  } catch (err) {
    console.error("Error fetching aid request by token:", err);
    res.status(500).json({ error: "Failed to fetch aid request." });
  }
});

// Mark as fulfilled
router.patch("/:id/fulfill", async (req, res) => {
  try {
    const { id } = req.params;
    const request = await RequestModel.findById(id);
    if (!request) return res.status(404).json({ error: "Request not found." });

    request.requestStatus = "Fulfilled";
    await request.save();

    res.json({ message: "Request marked as fulfilled", request });
  } catch (err) {
    console.error("Error in fulfill route:", err);
    res.status(500).json({ error: "Failed to mark request as fulfilled." });
  }
});

export default router;
