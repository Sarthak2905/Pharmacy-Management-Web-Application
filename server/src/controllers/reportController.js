const asyncHandler = require('../utils/asyncHandler');
const reportService = require('../services/reportService');

const dailySales = asyncHandler(async (req, res) => {
  const data = await reportService.getDailySalesReport();
  res.json({ success: true, data });
});

const monthlySales = asyncHandler(async (req, res) => {
  const data = await reportService.getMonthlySalesReport();
  res.json({ success: true, data });
});

const topSellingMedicines = asyncHandler(async (req, res) => {
  const data = await reportService.getTopSellingMedicines();
  res.json({ success: true, data });
});

const revenueAnalytics = asyncHandler(async (req, res) => {
  const data = await reportService.getRevenueAnalytics();
  res.json({ success: true, data });
});

module.exports = { dailySales, monthlySales, topSellingMedicines, revenueAnalytics };
