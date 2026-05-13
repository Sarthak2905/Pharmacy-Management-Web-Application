const asyncHandler = require('../utils/asyncHandler');
const Bill = require('../models/Bill');
const Customer = require('../models/Customer');
const { getPagination } = require('../utils/pagination');

const listCustomers = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const filter = req.query.q
    ? {
        $or: [
          { name: { $regex: req.query.q, $options: 'i' } },
          { phone: { $regex: req.query.q, $options: 'i' } },
          { email: { $regex: req.query.q, $options: 'i' } },
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
  const data = await Customer.create(req.body);
  res.status(201).json({ success: true, message: 'Customer created successfully', data });
});

const getCustomer = asyncHandler(async (req, res) => {
  const data = await Customer.findById(req.params.id);
  if (!data) {
    return res.status(404).json({ success: false, message: 'Customer not found' });
  }
  return res.json({ success: true, data });
});

const updateCustomer = asyncHandler(async (req, res) => {
  const data = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!data) {
    return res.status(404).json({ success: false, message: 'Customer not found' });
  }
  return res.json({ success: true, message: 'Customer updated successfully', data });
});

const getCustomerBills = asyncHandler(async (req, res) => {
  const data = await Bill.find({ customerId: req.params.id }).sort({ createdAt: -1 });
  res.json({ success: true, data });
});

const searchCustomers = asyncHandler(async (req, res) => {
  const q = req.query.q || '';
  const data = await Customer.find({
    $or: [
      { name: { $regex: q, $options: 'i' } },
      { phone: { $regex: q, $options: 'i' } },
      { email: { $regex: q, $options: 'i' } },
    ],
  }).limit(20);
  res.json({ success: true, data });
});

const payDue = asyncHandler(async (req, res) => {
  const amount = Number(req.body.amount || 0);
  const customer = await Customer.findById(req.params.id);
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
