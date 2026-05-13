const Bill = require('../models/Bill');
const { buildInvoiceMarkup, generateInvoiceBuffer } = require('../utils/invoicePdf');

async function getBillInvoice(billId) {
  const bill = await Bill.findById(billId).populate('customerId', 'name phone').populate('cashierId', 'name');
  if (!bill) {
    const error = new Error('Bill not found');
    error.statusCode = 404;
    throw error;
  }

  return bill;
}

async function generateInvoiceHtml(billId) {
  const bill = await getBillInvoice(billId);
  return buildInvoiceMarkup(bill);
}

async function generateInvoiceDownload(billId) {
  const bill = await getBillInvoice(billId);
  return generateInvoiceBuffer(bill);
}

module.exports = { getBillInvoice, generateInvoiceHtml, generateInvoiceDownload };
