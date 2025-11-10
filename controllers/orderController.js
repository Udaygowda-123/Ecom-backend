const Order = require('../models/Order');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const Product = require('../models/Product');

// GET /api/admin/orders
exports.list = async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const { status, search, from, to } = req.query;
  let filter = {};
  if (status) filter.status = status;
  if (search) filter['$or'] = [
    { _id: search },
    { 'shippingAddress.name': { $regex: search, $options: 'i' } },
    { 'shippingAddress.address': { $regex: search, $options: 'i' } }
  ];
  if (from || to) {
    filter.createdAt = {};
    if (from) filter.createdAt.$gte = new Date(from);
    if (to) filter.createdAt.$lte = new Date(to);
  }
  const total = await Order.countDocuments(filter);
  const orders = await Order.find(filter)
    .populate('user', 'email name')
    .populate('items.product', 'name price slug')
    .skip((page-1)*limit)
    .limit(limit)
    .sort({ createdAt: -1 });
  res.json({ orders, total, page, pages: Math.ceil(total/limit) });
};

exports.getById = async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'email name').populate('items.product', 'name price slug');
  if (!order) return res.status(404).json({ message: 'Not found' });
  res.json(order);
};

exports.updateStatus = async (req, res) => {
  const { status } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Not found' });
  order.status = status;
  await order.save();
  res.json(order);
};

exports.addNote = async (req, res) => {
  const { note } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Not found' });
  order.adminNotes = note;
  await order.save();
  res.json(order);
};

exports.exportCsv = async (req, res) => {
  const ids = req.body.ids || [];
  const orders = await Order.find({ _id: { $in: ids } }).populate('user', 'email name');
  // build simple CSV
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=orders.csv');

  const csvLines = ['orderId,customerEmail,total,status,createdAt'];
  orders.forEach(o => {
    csvLines.push(`${o._id},${o.user?.email || ''},${o.total || 0},${o.status},${o.createdAt.toISOString()}`);
  });
  res.send(csvLines.join('\n'));
};
