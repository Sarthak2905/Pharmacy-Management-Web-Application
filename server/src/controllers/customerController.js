const asyncHandler = require('../utils/asyncHandler');
const Bill = require('../models/Bill');
const Customer = require('../models/Customer');
const { toObjectId } = require('../utils/objectId');
const { getPagination } = require('../utils/pagination');
const { buildSearchRegex } = require('../utils/safeRegex');

function sanitizeCustomerPayload(payload) {
  return {
    name: String(payload.name).trim(),
    ...(payload.phone !== undefined ? { phone: String(payload.phone).trim() } : {}),
    ...(payload.email !== undefined ? { email: String(payload.email).trim().toLowerCase() } : {}),
    ...(payload.address !== undefined ? { address: String(payload.address).trim() } : {}),
    ...(payload.gender !== undefined ? { gender: String(payload.gender).trim() } : {}),
    ...(payload.dateOfBirth !== undefined ? { dateOfBirth: payload.dateOfBirth ? new Date(payload.dateOfBirth) : null } : {}),
    ...(payload.notes !== undefined ? { notes: String(payload.notes).trim() } : {}),
  };
}

const listCustomers = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const safeQuery = req.query.q ? buildSearchRegex(req.query.q) : null;
  const filter = req.query.q
    ? {
        $or: [
          { name: safeQuery },
          { phone: safeQuery },
          { email: safeQuery },
        ],
      }
    : {};

  const [items, total] = await Promise.all([
    Customer.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Customer.countDocuments(filter),
  ]);

  res.json({
    success: true,
    data: {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    },
  });
});

const createCustomer = asyncHandler(async (req, res) => {
  const data = await Customer.create(sanitizeCustomerPayload(req.body));
  res.status(201).json({ success: true, message: 'Customer created successfully', data });
});

const getCustomer = asyncHandler(async (req, res) => {
  const data = await Customer.findById(toObjectId(req.params.id));
  if (!data) {
    return res.status(404).json({ success: false, message: 'Customer not found' });
  }
  return res.json({ success: true, data });
});

const updateCustomer = asyncHandler(async (req, res) => {
  const data = await Customer.findByIdAndUpdate(
    toObjectId(req.params.id),
    sanitizeCustomerPayload(req.body),
    { new: true, runValidators: true },
  );
  if (!data) {
    return res.status(404).json({ success: false, message: 'Customer not found' });
  }
  return res.json({ success: true, message: 'Customer updated successfully', data });
});

const getCustomerBills = asyncHandler(async (req, res) => {
  const data = await Bill.find({ customerId: toObjectId(req.params.id, 'customerId') }).sort({ createdAt: -1 });
  res.json({ success: true, data });
});

const searchCustomers = asyncHandler(async (req, res) => {
  const safeQuery = buildSearchRegex(req.query.q || '');
  const data = await Customer.find({
    $or: [
      { name: safeQuery },
      { phone: safeQuery },
      { email: safeQuery },
    ],
  }).limit(20);
  res.json({ success: true, data });
});

const payDue = asyncHandler(async (req, res) => {
  const amount = Number(req.body.amount || 0);
  const customer = await Customer.findById(toObjectId(req.params.id));
  if (!customer) {
    return res.status(404).json({ success: false, message: 'Customer not found' });
  }

  customer.outstandingDue = Math.max(customer.outstandingDue - amount, 0);
  await customer.save();
  return res.json({ success: true, message: 'Customer due updated successfully', data: customer });
});

module.exports = {
  listCustomers,
  createCustomer,
  getCustomer,
  updateCustomer,
  getCustomerBills,
  searchCustomers,
  payDue,
};
