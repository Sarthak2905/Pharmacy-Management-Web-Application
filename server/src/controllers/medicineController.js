const asyncHandler = require('../utils/asyncHandler');
const medicineService = require('../services/medicineService');

const listMedicines = asyncHandler(async (req, res) => {
  const data = await medicineService.listMedicines(req.query);
  res.json({ success: true, data });
});

const getMedicine = asyncHandler(async (req, res) => {
  const data = await medicineService.getMedicine(req.params.id);
  res.json({ success: true, data });
});

const createMedicine = asyncHandler(async (req, res) => {
  const data = await medicineService.createMedicine(req.body, req.user._id);
  res.status(201).json({ success: true, message: 'Medicine created successfully', data });
});

const updateMedicine = asyncHandler(async (req, res) => {
  const data = await medicineService.updateMedicine(req.params.id, req.body);
  res.json({ success: true, message: 'Medicine updated successfully', data });
});

const deleteMedicine = asyncHandler(async (req, res) => {
  await medicineService.deleteMedicine(req.params.id);
  res.json({ success: true, message: 'Medicine deleted successfully' });
});

const searchMedicines = asyncHandler(async (req, res) => {
  const data = await medicineService.searchMedicines(req.query.q || '');
  res.json({ success: true, data });
});

const lowStock = asyncHandler(async (req, res) => {
  const data = await medicineService.listLowStock();
  res.json({ success: true, data });
});

const expiring = asyncHandler(async (req, res) => {
  const data = await medicineService.listExpiring(req.query.days || 7);
  res.json({ success: true, data });
});

module.exports = {
  listMedicines,
  getMedicine,
  createMedicine,
  updateMedicine,
  deleteMedicine,
  searchMedicines,
  lowStock,
  expiring,
};
