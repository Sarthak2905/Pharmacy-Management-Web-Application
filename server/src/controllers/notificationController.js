const asyncHandler = require('../utils/asyncHandler');
const Notification = require('../models/Notification');

const listNotifications = asyncHandler(async (req, res) => {
  const data = await Notification.find().sort({ createdAt: -1 }).limit(50);
  res.json({ success: true, data });
});

const markRead = asyncHandler(async (req, res) => {
  const data = await Notification.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
  if (!data) {
    return res.status(404).json({ success: false, message: 'Notification not found' });
  }
  return res.json({ success: true, message: 'Notification marked as read', data });
});

module.exports = { listNotifications, markRead };
