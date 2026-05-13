const express = require('express');
const inventoryController = require('../controllers/inventoryController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

const router = express.Router();

router.use(authMiddleware);
router.get('/summary', inventoryController.getSummary);
router.get('/movements', inventoryController.getMovements);
router.post('/adjustments', roleMiddleware('admin', 'manager'), inventoryController.adjustStock);
router.post('/restock', roleMiddleware('admin', 'manager'), (req, res, next) => {
  req.body.type = 'purchase';
  req.body.quantityChange = Math.abs(Number(req.body.quantityChange || 0));
  next();
}, inventoryController.adjustStock);

module.exports = router;
