const express = require('express');
const router = express.Router();
const Idea = require('../models/Idea');
const Notification = require('../models/Notification');
const { protect } = require('../middleware/auth');
const roleMiddleware = require('../middleware/roles');


// LEADERBOARD
router.get('/leaderboard', protect, async (req, res) => {
  try {
    const ideas = await Idea.find({ status: 'approved' })
      .sort({ averageRating: -1, createdAt: -1 })
      .limit(20)
      .populate('owner', 'name email');

    res.json(ideas);
  } catch (err) {
    console.error('LEADERBOARD error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET ALL IDEAS (filtered by role)
router.get('/', protect, async (req, res) => {
  try {
    let query = {};

    if (req.user.role === 'student') {
      query = { status: 'approved' };
    } else if (req.user.role === 'mentor') {
      query = { status: { $in: ['pending', 'approved'] } };
    } else if (req.user.role === 'admin') {
      query = {};
    }

    const ideas = await Idea.find(query)
      .populate('owner', 'name email')
      .sort({ createdAt: -1 });

    res.json(ideas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET MY IDEAS
router.get('/my', protect, async (req, res) => {
  try {
    const ideas = await Idea.find({ owner: req.user._id })
      .populate('owner', 'name email')
      .populate('teamMembers', 'name email')
      .sort({ createdAt: -1 });
    res.json(ideas);
  } catch (err) {
    console.error('GET /my error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET SINGLE IDEA
router.get('/:id', protect, async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id)
      .populate('owner', 'name email')
      .populate('teamMembers', 'name email');

    if (!idea) return res.status(404).json({ message: 'Idea not found' });

    // Students can only see their own pending ideas
    if (
      idea.status === 'pending' &&
      req.user.role === 'student' &&
      !idea.owner._id.equals(req.user._id)
    ) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(idea);
  } catch (err) {
    console.error('GET /:id error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// CREATE IDEA
router.post('/', protect, roleMiddleware(['student']), async (req, res) => {
  const { title, description, category, tags, technologies } = req.body;

  if (!title || !description) {
    return res.status(400).json({ message: 'Title and description are required' });
  }

  try {
    const idea = new Idea({
      title,
      description,
      category,
      tags: Array.isArray(tags) ? tags : [],
      technologies: Array.isArray(technologies) ? technologies : [],
      owner: req.user._id,
      status: 'pending',
      averageRating: 0,
      ratingsCount: 0
    });

    await idea.save();
    await idea.populate('owner', 'name email');

    res.status(201).json(idea);
  } catch (err) {
    console.error('POST /ideas error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// UPDATE IDEA
router.put('/:id', protect, roleMiddleware(['student']), async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id);
    if (!idea) return res.status(404).json({ message: 'Idea not found' });

    if (
      idea.owner.toString() !== req.user._id.toString() ||
      idea.status !== 'pending'
    ) {
      return res.status(403).json({ message: 'Cannot edit' });
    }

    // Only allow updating certain fields
    const updates = req.body;
    if (updates.title) idea.title = updates.title;
    if (updates.description) idea.description = updates.description;
    if (updates.category) idea.category = updates.category;
    if (updates.tags) idea.tags = Array.isArray(updates.tags) ? updates.tags : [];
    if (updates.technologies) idea.technologies = Array.isArray(updates.technologies) ? updates.technologies : [];

    await idea.save();
    await idea.populate('owner', 'name email');

    res.json(idea);
  } catch (err) {
    console.error('PUT /:id error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE IDEA
router.delete('/:id', protect, roleMiddleware(['student', 'admin']), async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id);
    if (!idea) return res.status(404).json({ message: 'Idea not found' });

    if (
      req.user.role === 'student' &&
      (idea.owner.toString() !== req.user._id.toString() || idea.status !== 'pending')
    ) {
      return res.status(403).json({ message: 'Cannot delete' });
    }

    await Idea.deleteOne({ _id: req.params.id }); // Use deleteOne for safety
    res.json({ message: 'Idea deleted' });
  } catch (err) {
    console.error('DELETE /:id error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// APPROVE IDEA
router.put('/approve/:id', protect, roleMiddleware(['mentor', 'admin']), async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id);
    if (!idea) return res.status(404).json({ message: 'Idea not found' });

    if (idea.status !== 'pending') {
      return res.status(400).json({ message: 'Idea is not pending' });
    }

    idea.status = 'approved';
    idea.averageRating = 0;
    idea.ratingsCount = 0;
    await idea.save();

    const notif = new Notification({
      user: idea.owner,
      message: `Your idea "${idea.title}" has been approved!`,
      type: 'idea_approved'
    });
    await notif.save();

    await idea.populate('owner', 'name email');
    res.json(idea);
  } catch (err) {
    console.error('APPROVE error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// REJECT IDEA
router.put('/reject/:id', protect, roleMiddleware(['mentor', 'admin']), async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id);
    if (!idea) return res.status(404).json({ message: 'Idea not found' });

    if (idea.status !== 'pending') {
      return res.status(400).json({ message: 'Idea is not pending' });
    }

    idea.status = 'rejected';
    await idea.save();

    const notif = new Notification({
      user: idea.owner,
      message: `Your idea "${idea.title}" has been rejected.`,
      type: 'idea_rejected'
    });
    await notif.save();

    await idea.populate('owner', 'name email');
    res.json(idea);
  } catch (err) {
    console.error('REJECT error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;