const mongoose = require('mongoose');

const agreementSchema = new mongoose.Schema({
  serviceTitle: {
    type: String,
    required: true,
    trim: true
  },
  terms: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Agreement', agreementSchema);
