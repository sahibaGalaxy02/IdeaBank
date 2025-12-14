const express = require('express');
const router = express.Router();
const Rating = require('../models/Rating');
const Idea = require('../models/Idea');
const Notification = require('../models/Notification');
const { protect } = require('../middleware/auth');
const roleMiddleware = require('../middleware/roles');

// GET ALL RATINGS FOR AN IDEA
router.get('/:ideaId', protect, async (req, res) => {
  try {
    const ratings = await Rating.find({ idea: req.params.ideaId })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(ratings);
  } catch (err) {
    console.error('GET /ratings/:ideaId error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// SUBMIT RATING
router.post('/:ideaId', protect, roleMiddleware(['mentor', 'admin']), async (req, res) => {
  const { rating, comment } = req.body;

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Rating must be 1-5' });
  }

  try {
    const idea = await Idea.findById(req.params.ideaId);
    if (!idea) {
      return res.status(404).json({ message: 'Idea not found' });
    }
    if (idea.status !== 'approved') {
      return res.status(400).json({ message: 'Only approved ideas can be rated' });
    }

    // Prevent duplicate
    const existing = await Rating.findOne({ idea: idea._id, user: req.user._id });
    if (existing) {
      return res.status(400).json({ message: 'You have already rated this idea' });
    }

    const newRating = new Rating({
      idea: idea._id,
      user: req.user._id,
      rating,
      comment
    });
    await newRating.save();

    // Recalculate average
    const allRatings = await Rating.find({ idea: idea._id });
    const sum = allRatings.reduce((acc, r) => acc + r.rating, 0);
    idea.averageRating = sum / allRatings.length;
    idea.ratingsCount = allRatings.length;
    await idea.save();

    // Notify owner
    const notif = new Notification({
      user: idea.owner,
      message: `New ${rating} star rating on your idea "${idea.title}"`,
      type: 'feedback_added'
    });
    await notif.save();

    await newRating.populate('user', 'name email');
    res.status(201).json(newRating);
  } catch (err) {
    console.error('POST /ratings error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;