const { body } = require('express-validator');

const createBillValidator = [
  body('items').isArray({ min: 1 }).withMessage('At least one medicine is required'),
  body('items.*.medicineId').notEmpty().withMessage('Medicine ID is required'),
  body('items.*.quantity').isFloat({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('discountAmount').optional().isFloat({ min: 0 }).withMessage('Discount must be 0 or greater'),
  body('amountPaid').optional().isFloat({ min: 0 }).withMessage('Amount paid must be 0 or greater'),
  body('paymentMethod').optional().isIn(['cash', 'card', 'upi', 'mixed']).withMessage('Invalid payment method'),
];

module.exports = { createBillValidator };
