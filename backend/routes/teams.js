const express = require('express');
const router = express.Router();
const TeamRequest = require('../models/TeamRequest');
const Idea = require('../models/Idea');
const Notification = require('../models/Notification');
const { protect } = require('../middleware/auth');
const roleMiddleware = require('../middleware/roles');
router.post('/request/:ideaId', protect, roleMiddleware(['student']), async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.ideaId);
    if (!idea || idea.status !== 'approved') return res.status(404).json({ message: 'Cannot join' });
    if (idea.owner.toString() === req.user._id.toString() || idea.teamMembers.includes(req.user._id)) {
      return res.status(400).json({ message: 'Already owner or member' });
    }
    const existing = await TeamRequest.findOne({ idea: idea._id, requester: req.user._id });
    if (existing) return res.status(400).json({ message: 'Request already sent' });
    const request = new TeamRequest({
      idea: idea._id,
      requester: req.user._id
    });
    await request.save();
    const notif = new Notification({
      user: idea.owner,
      message: `${req.user.name} requested to join your idea "${idea.title}".`
    });
    await notif.save();
    res.status(201).json(request);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});
router.get('/requests/:ideaId', protect, async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.ideaId);
    if (!idea || idea.owner.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Access denied' });
    const requests = await TeamRequest.find({ idea: idea._id }).populate('requester', 'name');
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});
router.put('/approve/:requestId', protect, async (req, res) => {
  try {
    const request = await TeamRequest.findById(req.params.requestId).populate('idea');
    if (!request || request.idea.owner.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Access denied' });
    request.status = 'approved';
    await request.save();
    request.idea.teamMembers.push(request.requester);
    await request.idea.save();
    const notif = new Notification({
      user: request.requester,
      message: `Your join request for "${request.idea.title}" has been approved.`
    });
    await notif.save();
    res.json(request);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});
router.put('/deny/:requestId', protect, async (req, res) => {
  try {
    const request = await TeamRequest.findById(req.params.requestId).populate('idea');
    if (!request || request.idea.owner.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Access denied' });
    request.status = 'rejected';
    await request.save();
    const notif = new Notification({
      user: request.requester,
      message: `Your join request for "${request.idea.title}" has been rejected.`
    });
    await notif.save();
    res.json(request);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});
module.exports = router;