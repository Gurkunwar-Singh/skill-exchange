const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    bio: String,
    skills: [String],
    otp: String,
    otpExpires: Date,
    isVerified: { type: Boolean, default: false },
});

module.exports = mongoose.model('Profile', profileSchema);