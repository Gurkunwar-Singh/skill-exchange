const express = require("express");
const User = require("../models/User"); // Import User model
const router = express.Router();
const authenticateToken = require("../middelware/authenticateToken"); // Your JWT middleware
const { createUserProfile } = require('../controllers/usertController');

router.get("/user", authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password"); // Exclude password
        if (!user) return res.status(404).json({ error: "User not found" });

        res.json({_id: user._id,
            name: user.name,    // ✅ Add name
            email: user.email,
            skills: user.skills || [] });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

router.post('/create-profile', createUserProfile);

module.exports = router;
