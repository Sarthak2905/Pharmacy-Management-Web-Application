const Medicine = require('../models/Medicine');
const Notification = require('../models/Notification');
const logger = require('../utils/logger');

async function syncExpiryAlerts() {
  const now = new Date();
  const sevenDays = new Date();
  sevenDays.setDate(now.getDate() + 7);
  const thirtyDays = new Date();
  thirtyDays.setDate(now.getDate() + 30);

  const [expiry7, expiry30, lowStock] = await Promise.all([
    Medicine.find({ expiryDate: { $gte: now, $lte: sevenDays } }),
    Medicine.find({ expiryDate: { $gt: sevenDays, $lte: thirtyDays } }),
    Medicine.find({ $expr: { $lte: ['$stockQuantity', '$reorderLevel'] } }),
  ]);

  const notifications = [
    ...expiry7.map((medicine) => ({
      type: 'expiry_7_days',
      title: `${medicine.name} is expiring soon`,
      message: `${medicine.name} batch ${medicine.batchNumber || '-'} will expire within 7 days.`,
      medicineId: medicine._id,
    })),
    ...expiry30.map((medicine) => ({
      type: 'expiry_30_days',
      title: `${medicine.name} expires within 30 days`,
      message: `${medicine.name} batch ${medicine.batchNumber || '-'} will expire within 30 days.`,
      medicineId: medicine._id,
    })),
    ...lowStock.map((medicine) => ({
      type: 'low_stock',
      title: `${medicine.name} is low on stock`,
      message: `${medicine.name} has ${medicine.stockQuantity} units left.`,
      medicineId: medicine._id,
    })),
  ];

  if (notifications.length) {
    await Notification.insertMany(notifications, { ordered: false }).catch(() => undefined);
  }

  logger.info(`Expiry alert sync completed with ${notifications.length} notifications considered.`);
}

module.exports = { syncExpiryAlerts };
