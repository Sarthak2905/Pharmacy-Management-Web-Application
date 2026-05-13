const asyncHandler = require('../utils/asyncHandler');
const User = require('../models/User');
const { sanitizeUser } = require('../services/authService');
const { toObjectId } = require('../utils/objectId');

const listUsers = asyncHandler(async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  res.json({ success: true, data: users.map(sanitizeUser) });
});

const updateUserRole = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    toObjectId(req.params.id),
    { role: String(req.body.role).trim() },
    { new: true, runValidators: true },
  );
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }
  return res.json({ success: true, message: 'User role updated successfully', data: sanitizeUser(user) });
});

const updateUserStatus = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    toObjectId(req.params.id),
    { isActive: Boolean(req.body.isActive) },
    { new: true, runValidators: true },
  );
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }
  return res.json({ success: true, message: 'User status updated successfully', data: sanitizeUser(user) });
});

module.exports = { listUsers, updateUserRole, updateUserStatus };
