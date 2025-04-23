const express = require("express");
const router = express.Router();
const ServiceRequest = require("../models/ServiceRequest");
const verifyToken = require("../middelware/verifyToken");


router.post("/service-requests", verifyToken, async (req, res) => {
    try {
        const { description } = req.body;
        if (!description) return res.status(400).json({ message: "Description is required" });

        const newRequest = new ServiceRequest({ requestedBy: req.user.email, description });
        await newRequest.save();

        // Fetch updated request list & broadcast to all users
        const updatedRequests = await ServiceRequest.find();
        req.io.emit("updateRequests", updatedRequests); 

        res.status(201).json({ message: "Service request created", request: newRequest });
    } catch (error) {
        console.error("Error creating service request:", error);
        res.status(500).json({ message: "Server error" });
    }
});

router.get("/service-requests", verifyToken, async (req, res) => {
    try {
        const requests = await ServiceRequest.find();
        res.json(requests);
    } catch (error) {
        console.error("Error fetching service requests:", error);
        res.status(500).json({ message: "Server error" });
    }
});

router.put("/service-requests/:id", verifyToken, async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ["pending", "accepted", "completed"];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        const updatedRequest = await ServiceRequest.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!updatedRequest) {
            return res.status(404).json({ message: "Service request not found" });
        }

        // Fetch updated request list & broadcast
        const updatedRequests = await ServiceRequest.find();
        req.io.emit("updateRequests", updatedRequests);

        res.json({ message: "Service request updated", request: updatedRequest });
    } catch (error) {
        console.error("Error updating service request:", error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
