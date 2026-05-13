const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    genericName: { type: String, trim: true },
    brandName: { type: String, trim: true },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    manufacturer: { type: String, trim: true },
    batchNumber: { type: String, trim: true },
    barcode: { type: String, trim: true },
    expiryDate: { type: Date, required: true },
    purchasePrice: { type: Number, required: true, min: 0 },
    sellingPrice: { type: Number, required: true, min: 0 },
    mrp: { type: Number, min: 0 },
    gstRate: { type: Number, default: 0, min: 0 },
    stockQuantity: { type: Number, default: 0, min: 0 },
    reorderLevel: { type: Number, default: 10, min: 0 },
    unitType: { type: String, default: 'strip', trim: true },
    locationInStore: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true },
);

medicineSchema.index({ name: 'text', genericName: 'text', brandName: 'text', barcode: 'text' });
medicineSchema.index({ barcode: 1 });
medicineSchema.index({ expiryDate: 1 });
medicineSchema.index({ categoryId: 1 });

module.exports = mongoose.model('Medicine', medicineSchema);
