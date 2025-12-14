const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const { protect } = require('../middleware/auth');

// MARK ALL AS READ FIRST
router.put('/mark-all-read', protect, async (req, res) => {
  try {
    const result = await Notification.updateMany(
      { user: req.user._id, read: false },
      { $set: { read: true } }
    );
    res.json({ 
      message: 'All notifications marked as read',
      modifiedCount: result.modifiedCount 
    });
  } catch (err) {
    console.error('MARK ALL READ error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// THEN /:id
router.put('/:id', protect, async (req, res) => {
  try {
    const notif = await Notification.findById(req.params.id);
    if (!notif) return res.status(404).json({ message: 'Not found' });
    if (notif.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }
    notif.read = true;
    await notif.save();
    res.json(notif);
  } catch (err) {
    console.error('PUT /:id error:', err);
    if (err.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid notification ID' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// GET ALL
router.get('/', protect, async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET UNREAD COUNT
router.get('/unread/count', protect, async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      user: req.user._id,
      read: false
    });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;