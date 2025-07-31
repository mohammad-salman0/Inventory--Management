// routes/userRoutes.js

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const auth = require('../middleware/auth');

// Get all users - admin only
router.get('/', auth(['admin']), async (req, res) => {
  try {
    const users = await User.find({}, '-password');
    res.json({ users });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Update user (optional)

module.exports = router;
