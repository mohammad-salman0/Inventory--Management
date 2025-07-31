const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Create new user
router.post('/register', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.json({ message: 'User created successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Login (basic - no token)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, password });
  if (user) res.json({ message: 'Login successful' });
  else res.status(401).json({ error: 'Invalid credentials' });
});

module.exports = router;
