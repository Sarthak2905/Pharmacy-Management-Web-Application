const { body } = require('express-validator');

const medicineValidator = [
  body('name').trim().notEmpty().withMessage('Medicine name is required'),
  body('expiryDate').isISO8601().withMessage('Valid expiry date is required'),
  body('purchasePrice').isFloat({ min: 0 }).withMessage('Purchase price must be 0 or greater'),
  body('sellingPrice').isFloat({ min: 0 }).withMessage('Selling price must be 0 or greater'),
  body('stockQuantity').optional().isFloat({ min: 0 }).withMessage('Stock quantity must be 0 or greater'),
  body('gstRate').optional().isFloat({ min: 0 }).withMessage('GST rate must be 0 or greater'),
];

const categoryValidator = [body('name').trim().notEmpty().withMessage('Category name is required')];

module.exports = { medicineValidator, categoryValidator };
