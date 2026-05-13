const express = require('express');
const notificationController = require('../controllers/notificationController');
const authMiddleware = require('../middlewares/authMiddleware');
const createRateLimiter = require('../middlewares/rateLimitMiddleware');

const router = express.Router();

router.use(createRateLimiter());
router.use(authMiddleware);
router.get('/', notificationController.listNotifications);
router.patch('/:id/read', notificationController.markRead);

module.exports = router;
