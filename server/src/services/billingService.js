const Bill = require('../models/Bill');
const Customer = require('../models/Customer');
const Medicine = require('../models/Medicine');
const StockMovement = require('../models/StockMovement');
const { calculateLineTotals, roundCurrency } = require('../utils/gstCalculator');
const { toObjectId } = require('../utils/objectId');

function buildBillNumber() {
  return `BILL-${Date.now()}`;
}

function derivePaymentStatus(amountDue, amountPaid) {
  if (amountDue <= 0) {
    return 'paid';
  }
  return amountPaid > 0 ? 'partial' : 'due';
}

async function createBill(payload, userId) {
  const medicineIds = payload.items.map((item) => toObjectId(item.medicineId, 'medicineId'));
  const medicines = await Medicine.find({ _id: { $in: medicineIds } });
  const medicineMap = new Map(medicines.map((medicine) => [String(medicine._id), medicine]));

  const items = [];
  let subtotal = 0;
  let totalTax = 0;

  for (const item of payload.items) {
    const medicine = medicineMap.get(String(item.medicineId));
    if (!medicine) {
      const error = new Error(`Medicine not found for ID ${item.medicineId}`);
      error.statusCode = 404;
      throw error;
    }

    if (medicine.stockQuantity < item.quantity) {
      const error = new Error(`Not enough stock for ${medicine.name}`);
      error.statusCode = 400;
      throw error;
    }

    const lineTotals = calculateLineTotals(item.quantity, medicine.sellingPrice, medicine.gstRate);
    subtotal += lineTotals.lineSubtotal;
    totalTax += lineTotals.lineTax;
    items.push({
      medicineId: medicine._id,
      medicineNameSnapshot: medicine.name,
      batchNumberSnapshot: medicine.batchNumber,
      quantity: Number(item.quantity),
      unitPrice: medicine.sellingPrice,
      gstRate: medicine.gstRate,
      ...lineTotals,
    });
  }

  const discountAmount = roundCurrency(payload.discountAmount || 0);
  const grandTotal = roundCurrency(subtotal + totalTax - discountAmount);
  const amountPaid = roundCurrency(payload.amountPaid ?? grandTotal);
  const amountDue = roundCurrency(Math.max(grandTotal - amountPaid, 0));
  const paymentStatus = payload.paymentStatus || derivePaymentStatus(amountDue, amountPaid);
  const customerId = payload.customerId ? toObjectId(payload.customerId, 'customerId') : undefined;

  for (const lineItem of items) {
    const medicine = medicineMap.get(String(lineItem.medicineId));
    const quantityBefore = medicine.stockQuantity;
    medicine.stockQuantity = quantityBefore - lineItem.quantity;
    await medicine.save();
    await StockMovement.create({
      medicineId: medicine._id,
      type: 'sale',
      quantityChange: -lineItem.quantity,
      quantityBefore,
      quantityAfter: medicine.stockQuantity,
      referenceType: 'bill',
      notes: `Bill ${lineItem.medicineNameSnapshot}`,
      createdBy: userId,
    });
  }

  if (payload.customerId) {
    await Customer.findByIdAndUpdate(customerId, {
      $inc: {
        totalPurchases: grandTotal,
        outstandingDue: amountDue,
      },
    });
  }

  const bill = await Bill.create({
    billNumber: buildBillNumber(),
    customerId,
    cashierId: userId,
    items,
    subtotal: roundCurrency(subtotal),
    totalTax: roundCurrency(totalTax),
    discountAmount,
    grandTotal,
    paymentMethod: payload.paymentMethod || 'cash',
    paymentStatus,
    amountPaid,
    amountDue,
  });

  return Bill.findById(bill._id).populate('customerId', 'name phone').populate('cashierId', 'name');
}

async function listBills() {
  return Bill.find().populate('customerId', 'name phone').populate('cashierId', 'name').sort({ createdAt: -1 }).limit(100);
}

async function getBillById(id) {
  const bill = await Bill.findById(id).populate('customerId', 'name phone').populate('cashierId', 'name');
  if (!bill) {
    const error = new Error('Bill not found');
    error.statusCode = 404;
    throw error;
  }
  return bill;
}

async function markBillPrinted(id) {
  const bill = await Bill.findByIdAndUpdate(id, { printedAt: new Date() }, { new: true }).populate('customerId', 'name phone').populate('cashierId', 'name');
  if (!bill) {
    const error = new Error('Bill not found');
    error.statusCode = 404;
    throw error;
  }
  return bill;
}

module.exports = { createBill, listBills, getBillById, markBillPrinted };
