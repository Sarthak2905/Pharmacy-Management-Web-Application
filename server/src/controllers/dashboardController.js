const Bill = require('../models/Bill');
const Medicine = require('../models/Medicine');
const Notification = require('../models/Notification');
const reportService = require('../services/reportService');

const getStats = async (req, res) => {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const [salesAgg, medicineCount, lowStockCount, recentBills] = await Promise.all([
    Bill.aggregate([
      {
        $group: {
          _id: null,
          totalSales: { $sum: '$grandTotal' },
          todayRevenue: {
            $sum: {
              $cond: [{ $gte: ['$createdAt', todayStart] }, '$grandTotal', 0],
            },
          },
        },
      },
    ]),
    Medicine.countDocuments(),
    Medicine.countDocuments({ $expr: { $lte: ['$stockQuantity', '$reorderLevel'] } }),
    Bill.find().sort({ createdAt: -1 }).limit(5),
  ]);

  res.json({
    success: true,
    data: {
      totalSales: salesAgg[0]?.totalSales || 0,
      todaysRevenue: salesAgg[0]?.todayRevenue || 0,
      totalMedicines: medicineCount,
      lowStockMedicines: lowStockCount,
      recentBills,
    },
  });
};

const getRecentBills = async (req, res) => {
  const data = await Bill.find().sort({ createdAt: -1 }).limit(10);
  res.json({ success: true, data });
};

const getRevenueToday = async (req, res) => {
  const bills = await reportService.getDailySalesReport();
  const revenue = bills.reduce((sum, bill) => sum + bill.grandTotal, 0);
  res.json({ success: true, data: { revenue, bills: bills.length } });
};

const getAlerts = async (req, res) => {
  const data = await Notification.find().sort({ createdAt: -1 }).limit(10);
  res.json({ success: true, data });
};

module.exports = { getStats, getRecentBills, getRevenueToday, getAlerts };
