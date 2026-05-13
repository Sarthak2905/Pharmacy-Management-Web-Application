const app = require('./app');
const connectDB = require('./config/db');
const env = require('./config/env');
const logger = require('./utils/logger');
const { seedAdminIfNeeded } = require('./services/authService');

async function startServer() {
  try {
    await connectDB();
    const seededAdmin = await seedAdminIfNeeded();
    if (seededAdmin) {
      logger.info('Default admin created: admin@pharmacy.local / Admin@123');
    }

    app.listen(env.port, () => {
      logger.info(`Server listening on port ${env.port}`);
    });
  } catch (error) {
    logger.error('Failed to start server', error);
    process.exit(1);
  }
}

startServer();
