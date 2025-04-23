const Profile = require('../models/Profile'); 

const createUserProfile = async (req, res) => {
    const { name, email, bio, skills } = req.body;
    const user = await Profile.findOne({ email, isVerified: true });

    if (!user) return res.status(400).json({ message: 'User not verified' });

    user.name = name;
    user.bio = bio;
    user.skills = skills;
    await user.save();

    res.json({ message: 'Profile created successfully' });
};

module.exports = { createUserProfile };