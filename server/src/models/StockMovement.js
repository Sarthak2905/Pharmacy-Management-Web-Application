const mongoose = require('mongoose');

const stockMovementSchema = new mongoose.Schema(
  {
    medicineId: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine', required: true },
    type: {
      type: String,
      enum: ['purchase', 'sale', 'adjustment', 'return', 'expired'],
      required: true,
    },
    quantityChange: { type: Number, required: true },
    quantityBefore: { type: Number, required: true, min: 0 },
    quantityAfter: { type: Number, required: true, min: 0 },
    referenceType: {
      type: String,
      enum: ['bill', 'manual', 'supplier'],
      default: 'manual',
    },
    referenceId: { type: mongoose.Schema.Types.Mixed },
    notes: { type: String, trim: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true },
);

stockMovementSchema.index({ medicineId: 1, createdAt: -1 });

module.exports = mongoose.model('StockMovement', stockMovementSchema);
