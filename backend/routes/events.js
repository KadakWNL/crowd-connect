const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const authMiddleware = require('../middleware/auth');
const Event = require('../models/Event');
const User = require('../models/User');

router.get('/', async (req, res) => {
  try {
    const events = await Event.find().populate('hostUserId', 'username').sort({ createdAt: -1 });
    res.json(events);
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('hostUserId', 'username email')
      .populate('attendees', 'username email');
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', [
  authMiddleware,
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('date').notEmpty().withMessage('Date is required'),
  body('time').notEmpty().withMessage('Time is required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('locationName').trim().notEmpty().withMessage('Location name is required'),
  body('latitude').isFloat().withMessage('Latitude must be a number'),
  body('longitude').isFloat().withMessage('Longitude must be a number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = await User.findById(req.userId);
    if (!user || !user.isHost) {
      return res.status(403).json({ message: 'Only hosts can create events' });
    }

    const { title, description, date, time, category, locationName, latitude, longitude } = req.body;

    const event = new Event({
      title,
      description,
      date,
      time,
      category,
      locationName,
      latitude,
      longitude,
      hostUserId: req.userId
    });

    await event.save();
    await event.populate('hostUserId', 'username');

    res.status(201).json(event);
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.hostUserId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to edit this event' });
    }

    const { title, description, date, time, category, locationName, latitude, longitude } = req.body;

    event.title = title || event.title;
    event.description = description || event.description;
    event.date = date || event.date;
    event.time = time || event.time;
    event.category = category || event.category;
    event.locationName = locationName || event.locationName;
    event.latitude = latitude !== undefined ? latitude : event.latitude;
    event.longitude = longitude !== undefined ? longitude : event.longitude;

    await event.save();
    await event.populate('hostUserId', 'username');

    res.json(event);
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.hostUserId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this event' });
    }

    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Attend/Unattend event
router.post('/:id/attend', authMiddleware, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if user is already attending
    const isAttending = event.attendees.includes(req.userId);
    
    if (isAttending) {
      // Unattend: remove user from attendees
      event.attendees = event.attendees.filter(
        attendeeId => attendeeId.toString() !== req.userId
      );
      await event.save();
      return res.json({ 
        message: 'Successfully removed from attendees',
        isAttending: false,
        attendeeCount: event.attendees.length
      });
    } else {
      // Attend: add user to attendees
      event.attendees.push(req.userId);
      await event.save();
      return res.json({ 
        message: 'Successfully added to attendees',
        isAttending: true,
        attendeeCount: event.attendees.length
      });
    }
  } catch (error) {
    console.error('Attend/unattend event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
