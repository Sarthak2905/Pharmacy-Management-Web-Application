const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const createRateLimiter = require('../middlewares/rateLimitMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

const router = express.Router();

router.use(createRateLimiter());
router.use(authMiddleware, roleMiddleware('admin'));
router.get('/', userController.listUsers);
router.patch('/:id/role', userController.updateUserRole);
router.patch('/:id/status', userController.updateUserStatus);

module.exports = router;
