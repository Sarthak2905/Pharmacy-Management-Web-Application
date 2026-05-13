const Medicine = require('../models/Medicine');
const StockMovement = require('../models/StockMovement');

async function getInventorySummary() {
  const [totalMedicines, lowStockCount, totalStockUnits] = await Promise.all([
    Medicine.countDocuments({ isActive: true }),
    Medicine.countDocuments({ $expr: { $lte: ['$stockQuantity', '$reorderLevel'] } }),
    Medicine.aggregate([{ $group: { _id: null, total: { $sum: '$stockQuantity' } } }]),
  ]);

  return {
    totalMedicines,
    lowStockCount,
    totalStockUnits: totalStockUnits[0]?.total || 0,
  };
}

async function getStockMovements() {
  return StockMovement.find().populate('medicineId', 'name batchNumber').populate('createdBy', 'name role').sort({ createdAt: -1 }).limit(100);
}

async function adjustStock({ medicineId, quantityChange, notes, type = 'adjustment' }, userId) {
  const medicine = await Medicine.findById(medicineId);
  if (!medicine) {
    const error = new Error('Medicine not found');
    error.statusCode = 404;
    throw error;
  }

  const quantityBefore = medicine.stockQuantity;
  const quantityAfter = quantityBefore + Number(quantityChange);
  if (quantityAfter < 0) {
    const error = new Error('Stock cannot become negative');
    error.statusCode = 400;
    throw error;
  }

  medicine.stockQuantity = quantityAfter;
  await medicine.save();

  await StockMovement.create({
    medicineId,
    type,
    quantityChange,
    quantityBefore,
    quantityAfter,
    referenceType: 'manual',
    notes,
    createdBy: userId,
  });

  return medicine;
}

module.exports = { getInventorySummary, getStockMovements, adjustStock };
