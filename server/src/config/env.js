const dotenv = require('dotenv');

dotenv.config();

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 5000),
  mongoUri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/pharmacy_management',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  jwtSecret: process.env.JWT_SECRET || 'change-me-access-secret',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'change-me-refresh-secret',
  accessTokenTtl: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
  refreshTokenTtl: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  enableCron: process.env.ENABLE_CRON === 'true',
};

module.exports = env;
