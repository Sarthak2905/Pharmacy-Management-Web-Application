const Category = require('../models/Category');
const Medicine = require('../models/Medicine');
const { getPagination } = require('../utils/pagination');

async function listMedicines(query) {
  const { page, limit, skip } = getPagination(query);
  const filter = {};

  if (query.categoryId) {
    filter.categoryId = query.categoryId;
  }

  if (query.isActive !== undefined) {
    filter.isActive = query.isActive === 'true';
  }

  if (query.search) {
    filter.$or = [
      { name: { $regex: query.search, $options: 'i' } },
      { genericName: { $regex: query.search, $options: 'i' } },
      { brandName: { $regex: query.search, $options: 'i' } },
      { barcode: { $regex: query.search, $options: 'i' } },
    ];
  }

  const [items, total] = await Promise.all([
    Medicine.find(filter)
      .populate('categoryId', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Medicine.countDocuments(filter),
  ]);

  return {
    items,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
}

async function createMedicine(payload, userId) {
  const medicine = await Medicine.create({ ...payload, createdBy: userId });
  return medicine.populate('categoryId', 'name');
}

async function updateMedicine(id, payload) {
  const medicine = await Medicine.findByIdAndUpdate(id, payload, { new: true, runValidators: true }).populate('categoryId', 'name');
  if (!medicine) {
    const error = new Error('Medicine not found');
    error.statusCode = 404;
    throw error;
  }
  return medicine;
}

async function deleteMedicine(id) {
  const medicine = await Medicine.findByIdAndDelete(id);
  if (!medicine) {
    const error = new Error('Medicine not found');
    error.statusCode = 404;
    throw error;
  }
  return medicine;
}

async function getMedicine(id) {
  const medicine = await Medicine.findById(id).populate('categoryId', 'name');
  if (!medicine) {
    const error = new Error('Medicine not found');
    error.statusCode = 404;
    throw error;
  }
  return medicine;
}

async function searchMedicines(search) {
  return Medicine.find({
    $or: [
      { name: { $regex: search, $options: 'i' } },
      { genericName: { $regex: search, $options: 'i' } },
      { brandName: { $regex: search, $options: 'i' } },
      { barcode: { $regex: search, $options: 'i' } },
    ],
  })
    .limit(20)
    .sort({ stockQuantity: -1 });
}

async function listLowStock() {
  return Medicine.find({ $expr: { $lte: ['$stockQuantity', '$reorderLevel'] } }).sort({ stockQuantity: 1 });
}

async function listExpiring(days) {
  const now = new Date();
  const futureDate = new Date();
  futureDate.setDate(now.getDate() + Number(days || 7));

  return Medicine.find({ expiryDate: { $gte: now, $lte: futureDate } }).sort({ expiryDate: 1 });
}

async function listCategories() {
  return Category.find().sort({ name: 1 });
}

async function createCategory(payload) {
  return Category.create(payload);
}

async function updateCategory(id, payload) {
  const category = await Category.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
  if (!category) {
    const error = new Error('Category not found');
    error.statusCode = 404;
    throw error;
  }
  return category;
}

async function deleteCategory(id) {
  const category = await Category.findByIdAndDelete(id);
  if (!category) {
    const error = new Error('Category not found');
    error.statusCode = 404;
    throw error;
  }
  return category;
}

module.exports = {
  listMedicines,
  createMedicine,
  updateMedicine,
  deleteMedicine,
  getMedicine,
  searchMedicines,
  listLowStock,
  listExpiring,
  listCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
