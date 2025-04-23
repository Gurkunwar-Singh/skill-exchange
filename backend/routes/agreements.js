// routes/agreements.js
const express = require('express');
const router = express.Router();
const Agreement = require('../models/Agreement');

router.post('/', async (req, res) => {
  try {
    const { serviceTitle, terms } = req.body;
    const agreement = new Agreement({ serviceTitle, terms });
    await agreement.save();
    res.status(201).json(agreement);
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to save agreement' });
  }
});

router.get('/:id/download', async (req, res) => {
  
  const agreement = await Agreement.findById(req.params.id);
  res.setHeader('Content-Disposition', 'attachment; filename=agreement.txt');
  res.send(`Service: ${agreement.serviceTitle}\n\nTerms:\n${agreement.terms}`);
});

module.exports = router;
