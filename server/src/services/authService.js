const bcrypt = require('bcrypt');
const User = require('../models/User');
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../utils/jwt');

function sanitizeUser(user) {
  const object = user.toObject ? user.toObject() : user;
  const { passwordHash, refreshTokenHash, ...safeUser } = object;
  return safeUser;
}

async function login({ email, password }) {
  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  const isValidPassword = await bcrypt.compare(password, user.passwordHash);
  if (!isValidPassword || !user.isActive) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  const accessToken = signAccessToken({ userId: user._id, role: user.role });
  const refreshToken = signRefreshToken({ userId: user._id, role: user.role });
  user.lastLogin = new Date();
  user.refreshTokenHash = await bcrypt.hash(refreshToken, 10);
  await user.save();

  return { user: sanitizeUser(user), accessToken, refreshToken };
}

async function registerStaff(payload) {
  const existingUser = await User.findOne({ email: payload.email.toLowerCase() });
  if (existingUser) {
    const error = new Error('Email is already registered');
    error.statusCode = 409;
    throw error;
  }

  const passwordHash = await bcrypt.hash(payload.password, 10);
  const user = await User.create({
    name: payload.name,
    email: payload.email.toLowerCase(),
    phone: payload.phone,
    passwordHash,
    role: payload.role || 'staff',
  });

  return sanitizeUser(user);
}

async function refresh(token) {
  const payload = verifyRefreshToken(token);
  const user = await User.findById(payload.userId);

  if (!user || !user.refreshTokenHash) {
    const error = new Error('Refresh token is invalid');
    error.statusCode = 401;
    throw error;
  }

  const isValid = await bcrypt.compare(token, user.refreshTokenHash);
  if (!isValid) {
    const error = new Error('Refresh token is invalid');
    error.statusCode = 401;
    throw error;
  }

  const accessToken = signAccessToken({ userId: user._id, role: user.role });
  const refreshToken = signRefreshToken({ userId: user._id, role: user.role });
  user.refreshTokenHash = await bcrypt.hash(refreshToken, 10);
  await user.save();

  return { user: sanitizeUser(user), accessToken, refreshToken };
}

async function logout(userId) {
  await User.findByIdAndUpdate(userId, { $unset: { refreshTokenHash: 1 } });
}

async function seedAdminIfNeeded() {
  const existingUsers = await User.countDocuments();
  if (existingUsers > 0) {
    return null;
  }

  const passwordHash = await bcrypt.hash('Admin@123', 10);
  const admin = await User.create({
    name: 'System Admin',
    email: 'admin@pharmacy.local',
    passwordHash,
    role: 'admin',
  });

  return sanitizeUser(admin);
}

module.exports = { login, registerStaff, refresh, logout, seedAdminIfNeeded, sanitizeUser };
