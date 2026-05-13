const asyncHandler = require('../utils/asyncHandler');
const medicineService = require('../services/medicineService');

const listCategories = asyncHandler(async (req, res) => {
  const data = await medicineService.listCategories();
  res.json({ success: true, data });
});

const createCategory = asyncHandler(async (req, res) => {
  const data = await medicineService.createCategory(req.body);
  res.status(201).json({ success: true, message: 'Category created successfully', data });
});

const updateCategory = asyncHandler(async (req, res) => {
  const data = await medicineService.updateCategory(req.params.id, req.body);
  res.json({ success: true, message: 'Category updated successfully', data });
});

const deleteCategory = asyncHandler(async (req, res) => {
  await medicineService.deleteCategory(req.params.id);
  res.json({ success: true, message: 'Category deleted successfully' });
});

module.exports = { listCategories, createCategory, updateCategory, deleteCategory };
