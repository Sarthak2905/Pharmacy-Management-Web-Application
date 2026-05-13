const dotenv = require('dotenv');
const crypto = require('crypto');

dotenv.config();

function resolveSecret(name) {
  const value = process.env[name];

  if (value) {
    return value;
  }

  if (process.env.NODE_ENV === 'production') {
    throw new Error(`${name} must be configured in production`);
  }

  return crypto.randomBytes(32).toString('hex');
}

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 5000),
  mongoUri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/pharmacy_management',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  jwtSecret: resolveSecret('JWT_SECRET'),
  jwtRefreshSecret: resolveSecret('JWT_REFRESH_SECRET'),
  accessTokenTtl: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
  refreshTokenTtl: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  enableCron: process.env.ENABLE_CRON === 'true',
};

module.exports = env;
