const express = require('express');
const dashboardController = require('../controllers/dashboardController');
const authMiddleware = require('../middlewares/authMiddleware');
const createRateLimiter = require('../middlewares/rateLimitMiddleware');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

router.use(createRateLimiter());
router.use(authMiddleware);
router.get('/stats', asyncHandler(dashboardController.getStats));
router.get('/recent-bills', asyncHandler(dashboardController.getRecentBills));
router.get('/revenue-today', asyncHandler(dashboardController.getRevenueToday));
router.get('/alerts', asyncHandler(dashboardController.getAlerts));

module.exports = router;
