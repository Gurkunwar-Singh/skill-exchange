const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Import User model
const router = express.Router();

const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Extract token

    if (!token) return res.status(401).json({ error: "Access Denied" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) return res.status(404).json({ error: "User not found" });

        console.log("User Data Sent:", user); // Debugging log
        req.user = user;
        next();
    } catch (err) {
        return res.status(403).json({ error: "Invalid Token" });
    }
};



module.exports = authenticateToken;
