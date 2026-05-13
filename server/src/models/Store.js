const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    ownerName: { type: String, trim: true },
    subscriptionPlan: { type: String, default: 'starter' },
    address: { type: String, trim: true },
    gstNumber: { type: String, trim: true },
    contactEmail: { type: String, trim: true, lowercase: true },
    status: { type: String, enum: ['trial', 'active', 'paused'], default: 'trial' },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Store', storeSchema);
