const Profile = require("../models/Profile");

const getDashboardData = async (req, res) => {
    try {
        if (!req.user || !req.user.email) {
            return res.status(401).json({ message: "Unauthorized: No user found in token" });
        }

        const email = req.user.email;  // Extract email from the token
        console.log("User Email:", email);

        const profile = await Profile.findOne({ email });

        if (!profile) {
            return res.status(404).json({ message: "User profile not found" });
        }

        console.log("Profile Found:", profile);

        
        const matches = await Profile.find({
            skills: { $in: profile.skills }, 
            email: { $ne: email }  
        }).select("name skills email");

        
        const requests = [{ description: "Need help with a Java project" }];

        // Fetch credits (this will be updated with real data)
        const credits = 50;

        res.json({ profile, matches, requests, credits });
    } catch (error) {
        console.error("Error fetching dashboard:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = { getDashboardData };
