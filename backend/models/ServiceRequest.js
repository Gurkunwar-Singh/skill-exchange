const mongoose = require("mongoose");

const ServiceRequestSchema = new mongoose.Schema({
    requestedBy: String,
    description: String,
    status: { type: String, enum: ["pending", "accepted", "completed"], default: "pending" },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("ServiceRequest", ServiceRequestSchema);
