const express = require('express');
const router = express.Router();
const Milestone = require('../models/Milestone');

// POST: Create a new milestone
router.post('/', async (req, res) => {
  const { tradeId, title, description, dueDate } = req.body;
  try {
    const milestone = new Milestone({ tradeId, title, description, dueDate });
    await milestone.save();
    res.status(201).json(milestone);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET: All milestones by tradeId
router.get('/:tradeId', async (req, res) => {
  try {
    const milestones = await Milestone.find({ tradeId: req.params.tradeId });
    res.json(milestones);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PATCH: Toggle complete
router.patch('/:id/toggle', async (req, res) => {
  try {
    const milestone = await Milestone.findById(req.params.id);
    milestone.completed = !milestone.completed;
    await milestone.save();
    res.json(milestone);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
