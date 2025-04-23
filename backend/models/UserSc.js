
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


// User model
const UserSchema = new Schema({
  name: { type: String, required: true },
});

module.exports = mongoose.model('UserSc', UserSchema);
