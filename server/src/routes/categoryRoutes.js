const express = require('express');
const categoryController = require('../controllers/categoryController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const validateMiddleware = require('../middlewares/validateMiddleware');
const { categoryValidator } = require('../validators/medicineValidators');

const router = express.Router();

router.use(authMiddleware);
router.get('/', categoryController.listCategories);
router.post('/', roleMiddleware('admin', 'manager'), categoryValidator, validateMiddleware, categoryController.createCategory);
router.patch('/:id', roleMiddleware('admin', 'manager'), categoryValidator, validateMiddleware, categoryController.updateCategory);
router.delete('/:id', roleMiddleware('admin', 'manager'), categoryController.deleteCategory);

module.exports = router;
