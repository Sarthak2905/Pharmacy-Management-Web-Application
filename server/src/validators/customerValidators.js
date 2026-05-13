const { body } = require('express-validator');

const customerValidator = [body('name').trim().notEmpty().withMessage('Customer name is required')];

module.exports = { customerValidator };
