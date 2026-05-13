const asyncHandler = require('../utils/asyncHandler');
const inventoryService = require('../services/inventoryService');

const getSummary = asyncHandler(async (req, res) => {
  const data = await inventoryService.getInventorySummary();
  res.json({ success: true, data });
});

const getMovements = asyncHandler(async (req, res) => {
  const data = await inventoryService.getStockMovements();
  res.json({ success: true, data });
});

const adjustStock = asyncHandler(async (req, res) => {
  const data = await inventoryService.adjustStock(req.body, req.user._id);
  res.json({ success: true, message: 'Stock updated successfully', data });
});

module.exports = { getSummary, getMovements, adjustStock };
