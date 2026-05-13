const express = require('express');
const customerController = require('../controllers/customerController');
const authMiddleware = require('../middlewares/authMiddleware');
const createRateLimiter = require('../middlewares/rateLimitMiddleware');
const validateMiddleware = require('../middlewares/validateMiddleware');
const { customerValidator } = require('../validators/customerValidators');

const router = express.Router();

router.use(createRateLimiter());
router.use(authMiddleware);
router.get('/', customerController.listCustomers);
router.post('/', customerValidator, validateMiddleware, customerController.createCustomer);
router.get('/search', customerController.searchCustomers);
router.get('/:id', customerController.getCustomer);
router.patch('/:id', customerValidator, validateMiddleware, customerController.updateCustomer);
router.get('/:id/bills', customerController.getCustomerBills);
router.post('/:id/pay-due', customerController.payDue);

module.exports = router;
