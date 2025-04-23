const mongoose = require('mongoose');

const MilestoneSchema = new mongoose.Schema({
  tradeId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Trade' },
  title: { type: String, required: true },
  description: { type: String },
  dueDate: { type: Date },
  completed: { type: Boolean, default: false },
});

const Milestone = mongoose.model('Milestone', MilestoneSchema);

module.exports = Milestone;
