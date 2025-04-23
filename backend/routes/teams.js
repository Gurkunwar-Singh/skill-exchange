const express = require('express');
const router = express.Router();
const Team = require('../models/Team'); // Mongoose model for Team
const User = require('../models/User'); // Mongoose model for User

// Create a new team
router.post('/create', async (req, res) => {
  const { name } = req.body;
  const newTeam = new Team({ name, members: [] });
  await newTeam.save();
  res.json(newTeam);
});

// Add a user to a team
router.post('/addMember', async (req, res) => {
  const { teamId, userId } = req.body;

  const team = await Team.findById(teamId);
  const user = await User.findById(userId);

  if (!team || !user) return res.status(404).json({ message: 'Team or User not found' });

  team.members.push(user);
  await team.save();

  res.json(team);
});

// Get all teams
router.get('/', async (req, res) => {
  const teams = await Team.find().populate('members');
  res.json(teams);
});

// Get all users
router.get('/users', async (req, res) => {
  const users = await User.find();
  res.json(users);
});

module.exports = router;
