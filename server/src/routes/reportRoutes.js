const express = require('express');
const reportController = require('../controllers/reportController');
const authMiddleware = require('../middlewares/authMiddleware');
const createRateLimiter = require('../middlewares/rateLimitMiddleware');

const router = express.Router();

router.use(createRateLimiter());
router.use(authMiddleware);
router.get('/daily-sales', reportController.dailySales);
router.get('/monthly-sales', reportController.monthlySales);
router.get('/top-selling-medicines', reportController.topSellingMedicines);
router.get('/revenue-analytics', reportController.revenueAnalytics);

module.exports = router;
