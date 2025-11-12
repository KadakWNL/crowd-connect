const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const User = require('../models/User');
const Event = require('../models/Event');

router.patch('/toggle-host', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isHost = !user.isHost;
    await user.save();

    res.json({
      message: `You are now ${user.isHost ? 'a host' : 'not a host'}`,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        isHost: user.isHost
      }
    });
  } catch (error) {
    console.error('Toggle host error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/my-events', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate('attending');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user.attending);
  } catch (error) {
    console.error('Get my events error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      id: user._id,
      username: user.username,
      email: user.email,
      isHost: user.isHost
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
