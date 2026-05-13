const Bill = require('../models/Bill');

async function getDailySalesReport() {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  return Bill.find({ createdAt: { $gte: start } }).sort({ createdAt: -1 });
}

async function getMonthlySalesReport() {
  const start = new Date();
  start.setDate(1);
  start.setHours(0, 0, 0, 0);
  return Bill.find({ createdAt: { $gte: start } }).sort({ createdAt: -1 });
}

async function getTopSellingMedicines() {
  return Bill.aggregate([
    { $unwind: '$items' },
    {
      $group: {
        _id: '$items.medicineId',
        medicineName: { $first: '$items.medicineNameSnapshot' },
        quantitySold: { $sum: '$items.quantity' },
        revenue: { $sum: '$items.lineTotal' },
      },
    },
    { $sort: { quantitySold: -1 } },
    { $limit: 10 },
  ]);
}

async function getRevenueAnalytics() {
  return Bill.aggregate([
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
        },
        totalRevenue: { $sum: '$grandTotal' },
        bills: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ]);
}

module.exports = {
  getDailySalesReport,
  getMonthlySalesReport,
  getTopSellingMedicines,
  getRevenueAnalytics,
};
