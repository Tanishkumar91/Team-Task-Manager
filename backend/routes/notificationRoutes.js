const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const { protect } = require('../middleware/auth');

// GET /api/notifications - Get user notifications
router.get('/', protect, async (req, res) => {
    try {
        const notifications = await Notification.find({ recipient: req.user._id })
            .sort({ createdAt: -1 })
            .limit(20)
            .populate('sender', 'name')
            .populate('relatedProject', 'title');
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PATCH /api/notifications/:id/read - Mark notification as read
router.get('/read-all', protect, async (req, res) => {
    try {
        await Notification.updateMany({ recipient: req.user._id }, { isRead: true });
        res.json({ message: 'All marked as read' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
