const express = require('express');
const billingController = require('../controllers/billingController');
const authMiddleware = require('../middlewares/authMiddleware');
const createRateLimiter = require('../middlewares/rateLimitMiddleware');
const validateMiddleware = require('../middlewares/validateMiddleware');
const { createBillValidator } = require('../validators/billingValidators');

const router = express.Router();

router.use(createRateLimiter());
router.use(authMiddleware);
router.get('/', billingController.listBills);
router.post('/', createBillValidator, validateMiddleware, billingController.createBill);
router.get('/:id', billingController.getBill);
router.get('/:id/invoice', billingController.getInvoice);
router.get('/:id/pdf', billingController.getInvoicePdf);
router.post('/:id/print', billingController.markPrinted);
router.post('/:id/send-whatsapp', billingController.sendWhatsapp);

module.exports = router;
