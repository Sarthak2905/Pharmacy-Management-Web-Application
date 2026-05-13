const asyncHandler = require('../utils/asyncHandler');
const authService = require('../services/authService');

const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body);
  res.json({ success: true, message: 'Login successful', data: result });
});

const me = asyncHandler(async (req, res) => {
  res.json({ success: true, data: req.user });
});

const refresh = asyncHandler(async (req, res) => {
  const token = req.body.refreshToken || req.cookies.refreshToken;
  const result = await authService.refresh(token);
  res.json({ success: true, message: 'Token refreshed', data: result });
});

const logout = asyncHandler(async (req, res) => {
  await authService.logout(req.user._id);
  res.json({ success: true, message: 'Logout successful' });
});

const registerStaff = asyncHandler(async (req, res) => {
  const user = await authService.registerStaff(req.body);
  res.status(201).json({ success: true, message: 'Staff registered successfully', data: user });
});

module.exports = { login, me, refresh, logout, registerStaff };
