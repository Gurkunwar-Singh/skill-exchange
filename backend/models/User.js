const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  skills: [{ type: String }], // List of skills
  bio: { type: String, maxlength: 300 },
});

module.exports = mongoose.model('User', userSchema);
