const Category = require('../models/Category');
const Medicine = require('../models/Medicine');
const { toObjectId } = require('../utils/objectId');
const { getPagination } = require('../utils/pagination');
const { buildSearchRegex } = require('../utils/safeRegex');

function sanitizeMedicinePayload(payload) {
  const result = {};

  if (payload.name !== undefined) result.name = String(payload.name).trim();
  if (payload.genericName !== undefined) result.genericName = String(payload.genericName).trim();
  if (payload.brandName !== undefined) result.brandName = String(payload.brandName).trim();
  if (payload.categoryId !== undefined && payload.categoryId !== '') result.categoryId = toObjectId(payload.categoryId, 'categoryId');
  if (payload.manufacturer !== undefined) result.manufacturer = String(payload.manufacturer).trim();
  if (payload.batchNumber !== undefined) result.batchNumber = String(payload.batchNumber).trim();
  if (payload.barcode !== undefined) result.barcode = String(payload.barcode).trim();
  if (payload.expiryDate !== undefined) result.expiryDate = new Date(payload.expiryDate);
  if (payload.purchasePrice !== undefined) result.purchasePrice = Number(payload.purchasePrice);
  if (payload.sellingPrice !== undefined) result.sellingPrice = Number(payload.sellingPrice);
  if (payload.mrp !== undefined) result.mrp = Number(payload.mrp);
  if (payload.gstRate !== undefined) result.gstRate = Number(payload.gstRate);
  if (payload.stockQuantity !== undefined) result.stockQuantity = Number(payload.stockQuantity);
  if (payload.reorderLevel !== undefined) result.reorderLevel = Number(payload.reorderLevel);
  if (payload.unitType !== undefined) result.unitType = String(payload.unitType).trim();
  if (payload.locationInStore !== undefined) result.locationInStore = String(payload.locationInStore).trim();
  if (payload.isActive !== undefined) result.isActive = Boolean(payload.isActive);

  return result;
}

function sanitizeCategoryPayload(payload) {
  return {
    name: String(payload.name).trim(),
    description: payload.description ? String(payload.description).trim() : '',
    ...(payload.isActive !== undefined ? { isActive: Boolean(payload.isActive) } : {}),
  };
}

async function listMedicines(query) {
  const { page, limit, skip } = getPagination(query);
  const filter = {};

  if (query.categoryId) {
    filter.categoryId = toObjectId(query.categoryId, 'categoryId');
  }

  if (query.isActive !== undefined) {
    filter.isActive = query.isActive === 'true';
  }

  if (query.search) {
    const safeSearch = buildSearchRegex(query.search);
    filter.$or = [
      { name: safeSearch },
      { genericName: safeSearch },
      { brandName: safeSearch },
      { barcode: safeSearch },
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
  const medicine = await Medicine.create({ ...sanitizeMedicinePayload(payload), createdBy: userId });
  return medicine.populate('categoryId', 'name');
}

async function updateMedicine(id, payload) {
  const medicine = await Medicine.findByIdAndUpdate(
    toObjectId(id),
    sanitizeMedicinePayload(payload),
    { new: true, runValidators: true },
  ).populate('categoryId', 'name');
  if (!medicine) {
    const error = new Error('Medicine not found');
    error.statusCode = 404;
    throw error;
  }
  return medicine;
}

async function deleteMedicine(id) {
  const medicine = await Medicine.findByIdAndDelete(toObjectId(id));
  if (!medicine) {
    const error = new Error('Medicine not found');
    error.statusCode = 404;
    throw error;
  }
  return medicine;
}

async function getMedicine(id) {
  const medicine = await Medicine.findById(toObjectId(id)).populate('categoryId', 'name');
  if (!medicine) {
    const error = new Error('Medicine not found');
    error.statusCode = 404;
    throw error;
  }
  return medicine;
}

async function searchMedicines(search) {
  const safeSearch = buildSearchRegex(search);
  return Medicine.find({
    $or: [
      { name: safeSearch },
      { genericName: safeSearch },
      { brandName: safeSearch },
      { barcode: safeSearch },
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
  return Category.create(sanitizeCategoryPayload(payload));
}

async function updateCategory(id, payload) {
  const category = await Category.findByIdAndUpdate(
    toObjectId(id),
    sanitizeCategoryPayload(payload),
    { new: true, runValidators: true },
  );
  if (!category) {
    const error = new Error('Category not found');
    error.statusCode = 404;
    throw error;
  }
  return category;
}

async function deleteCategory(id) {
  const category = await Category.findByIdAndDelete(toObjectId(id));
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
