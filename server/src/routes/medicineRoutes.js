const express = require('express');
const medicineController = require('../controllers/medicineController');
const authMiddleware = require('../middlewares/authMiddleware');
const createRateLimiter = require('../middlewares/rateLimitMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const validateMiddleware = require('../middlewares/validateMiddleware');
const { medicineValidator } = require('../validators/medicineValidators');

const router = express.Router();

router.use(createRateLimiter());
router.use(authMiddleware);
router.get('/', medicineController.listMedicines);
router.get('/search', medicineController.searchMedicines);
router.get('/low-stock', medicineController.lowStock);
router.get('/expiring', medicineController.expiring);
router.get('/:id', medicineController.getMedicine);
router.post('/', roleMiddleware('admin', 'manager'), medicineValidator, validateMiddleware, medicineController.createMedicine);
router.patch('/:id', roleMiddleware('admin', 'manager'), medicineValidator, validateMiddleware, medicineController.updateMedicine);
router.delete('/:id', roleMiddleware('admin', 'manager'), medicineController.deleteMedicine);

module.exports = router;
