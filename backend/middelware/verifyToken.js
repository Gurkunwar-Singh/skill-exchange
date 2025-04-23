const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Ensure you import the User model

const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.header("Authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Access Denied. No Token Provided." });
        }

        const token = authHeader.split(" ")[1]; // Extract token from `Bearer <token>`
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Ensure this matches your token signing secret

        const user = await User.findById(decoded.id); // Find user in DB
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        req.user = user; // Attach user to request
        console.log("User Authenticated:", user); // Debugging
        next();
    } catch (error) {
        console.error("Token Verification Error:", error.message);
        return res.status(403).json({ message: "Invalid Token" });
    }
};

module.exports = verifyToken;
