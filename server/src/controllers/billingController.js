const asyncHandler = require('../utils/asyncHandler');
const billingService = require('../services/billingService');
const invoiceService = require('../services/invoiceService');

const createBill = asyncHandler(async (req, res) => {
  const data = await billingService.createBill(req.body, req.user._id);
  res.status(201).json({ success: true, message: 'Bill created successfully', data });
});

const listBills = asyncHandler(async (req, res) => {
  const data = await billingService.listBills();
  res.json({ success: true, data });
});

const getBill = asyncHandler(async (req, res) => {
  const data = await billingService.getBillById(req.params.id);
  res.json({ success: true, data });
});

const getInvoice = asyncHandler(async (req, res) => {
  const html = await invoiceService.generateInvoiceHtml(req.params.id);
  res.type('html').send(html);
});

const getInvoicePdf = asyncHandler(async (req, res) => {
  const buffer = await invoiceService.generateInvoiceDownload(req.params.id);
  res.setHeader('Content-Disposition', `attachment; filename="invoice-${req.params.id}.html"`);
  res.type('html').send(buffer);
});

const markPrinted = asyncHandler(async (req, res) => {
  const data = await billingService.markBillPrinted(req.params.id);
  res.json({ success: true, message: 'Bill marked as printed', data });
});

const sendWhatsapp = asyncHandler(async (req, res) => {
  const data = await billingService.getBillById(req.params.id);
  res.json({ success: true, message: 'WhatsApp integration is planned for phase 3', data });
});

module.exports = { createBill, listBills, getBill, getInvoice, getInvoicePdf, markPrinted, sendWhatsapp };
