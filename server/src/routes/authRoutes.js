const express = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');
const createRateLimiter = require('../middlewares/rateLimitMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const validateMiddleware = require('../middlewares/validateMiddleware');
const { loginValidator, registerStaffValidator } = require('../validators/authValidators');

const router = express.Router();
router.use(createRateLimiter({ max: 30 }));

router.post('/login', loginValidator, validateMiddleware, authController.login);
router.post('/refresh', authController.refresh);
router.get('/me', authMiddleware, authController.me);
router.post('/logout', authMiddleware, authController.logout);
router.post('/register-staff', authMiddleware, roleMiddleware('admin'), registerStaffValidator, validateMiddleware, authController.registerStaff);

module.exports = router;
