const mongoose = require('mongoose');

const billItemSchema = new mongoose.Schema(
  {
    medicineId: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine', required: true },
    medicineNameSnapshot: { type: String, required: true },
    batchNumberSnapshot: { type: String },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
    gstRate: { type: Number, default: 0, min: 0 },
    lineSubtotal: { type: Number, required: true, min: 0 },
    lineTax: { type: Number, required: true, min: 0 },
    lineTotal: { type: Number, required: true, min: 0 },
  },
  { _id: false },
);

const billSchema = new mongoose.Schema(
  {
    billNumber: { type: String, required: true, unique: true },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
    cashierId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: { type: [billItemSchema], validate: [(items) => items.length > 0, 'Bill items are required'] },
    subtotal: { type: Number, required: true, min: 0 },
    totalTax: { type: Number, required: true, min: 0 },
    discountAmount: { type: Number, default: 0, min: 0 },
    grandTotal: { type: Number, required: true, min: 0 },
    paymentMethod: {
      type: String,
      enum: ['cash', 'card', 'upi', 'mixed'],
      default: 'cash',
    },
    paymentStatus: {
      type: String,
      enum: ['paid', 'partial', 'due'],
      default: 'paid',
    },
    amountPaid: { type: Number, default: 0, min: 0 },
    amountDue: { type: Number, default: 0, min: 0 },
    invoicePdfUrl: { type: String },
    printedAt: { type: Date },
  },
  { timestamps: true },
);

billSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Bill', billSchema);
