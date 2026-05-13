const mongoose = require('mongoose');
const env = require('./env');
const logger = require('../utils/logger');

async function connectDB() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  await mongoose.connect(env.mongoUri);
  logger.info(`MongoDB connected to ${mongoose.connection.host}`);
  return mongoose.connection;
}

module.exports = connectDB;
