// // models/aidRequest.js
// import mongoose from "mongoose";

// import mongoose from "mongoose";

// const aidRequestSchema = new mongoose.Schema({
//   victimId: { type: mongoose.Schema.Types.ObjectId, ref: "Victim" },
//   victimName: { type: String, required: true },
//   victimPhone: { type: String },
//   description: { type: String },
//   trackingToken: { type: String, required: true, unique: true, index: true },
//   requestStatus: {
//     type: String,
//     enum: ["Pending", "Assigned", "InProgress", "Fulfilled", "Canceled"],
//     default: "Pending",
//   },
//   assignedNgoId: { type: String },
//   requiredResources: { type: Map, of: Number, required: true },
//   location: { type: { type: String, enum: ["Point"], default: "Point" }, coordinates: { type: [Number], required: true } },
//   priorityLevel: { type: Number, default: 1 },
// }, { timestamps: true });

// aidRequestSchema.index({ location: "2dsphere" });

// const AidRequest = mongoose.models.AidRequest || mongoose.model("AidRequest", aidRequestSchema);

// // export default AidRequest;


// aidRequestSchema.index({ location: "2dsphere" });

// const RequestModel = mongoose.models.AidRequest || mongoose.model("AidRequest", aidRequestSchema);

// // export default RequestModel;

// router.post("/create", async (req, res) => {
//   try {
//     const {
//       victimId,
//       victimName,
//       victimPhone,
//       description,
//       requiredResources,
//       priorityLevel,
//       location,
//     } = req.body;

//     if (!victimName || !requiredResources || !location?.coordinates) {
//       return res.status(400).json({ error: "Missing required fields." });
//     }

//     const trackingToken = Math.random().toString(36).substring(2, 15);

//     const newRequest = new RequestModel({
//       victimId,
//       victimName,
//       victimPhone,
//       description,
//       requiredResources,
//       priorityLevel,
//       location,
//       trackingToken,
//     });

//     await newRequest.save();
//     res.status(201).json({ message: "Aid request created successfully", request: newRequest });
//   } catch (err) {
//     console.error("Error creating aid request:", err);
//     res.status(500).json({ error: "Failed to create aid request", details: err.message });
//   }
// });

// export default router;

import mongoose from "mongoose";

const aidRequestSchema = new mongoose.Schema({
  victimId: { type: mongoose.Schema.Types.ObjectId, ref: "Victim" },
  victimName: { type: String, required: true },
  victimPhone: { type: String },
  description: { type: String },
  trackingToken: { type: String, required: true, unique: true, index: true },
  requestStatus: {
    type: String,
    enum: ["Pending", "Assigned", "InProgress", "Fulfilled", "Canceled"],
    default: "Pending",
  },
  assignedNgoId: { type: String },
  requiredResources: { type: Map, of: Number, required: true },
  location: { type: { type: String, enum: ["Point"], default: "Point" }, coordinates: { type: [Number], required: true } },
  priorityLevel: { type: Number, default: 1 },
}, { timestamps: true });

aidRequestSchema.index({ location: "2dsphere" });

const AidRequest = mongoose.models.AidRequest || mongoose.model("AidRequest", aidRequestSchema);

export default AidRequest;
