// middleware/auth.js

const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = (roles = []) => async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Authorization header missing' });
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Token missing' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) return res.status(401).json({ error: 'User not found' });

    if (roles.length && !roles.includes(user.role)) {
      return res.status(403).json({ error: 'Access denied: insufficient permissions' });
    }

    req.user = user; // attach user object to request for downstream use
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};
