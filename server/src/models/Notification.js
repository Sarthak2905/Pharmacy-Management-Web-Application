const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['low_stock', 'expiry_7_days', 'expiry_30_days', 'payment_due'],
      required: true,
    },
    title: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    medicineId: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine' },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true },
);

notificationSchema.index({ isRead: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
