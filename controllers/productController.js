const Product = require('../models/Product');

// GET /api/admin/products?page=1&limit=10&search=abc
exports.list = async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const search = req.query.search ? { name: { $regex: req.query.search, $options: 'i' } } : {};
  const filter = { deleted: false, ...search };
  const total = await Product.countDocuments(filter);
  const products = await Product.find(filter)
    .skip((page-1)*limit)
    .limit(limit)
    .sort({ createdAt: -1 });
  res.json({ products, total, page, pages: Math.ceil(total/limit) });
};

exports.getById = async (req, res) => {
  const p = await Product.findById(req.params.id);
  if (!p) return res.status(404).json({ message: 'Not found' });
  res.json(p);
};

exports.create = async (req, res) => {
  const { name, slug, category, weight, price, stock, images, description } = req.body;
  if (!name || !slug || !category || !price) return res.status(400).json({ message: 'Missing required fields' });
  const product = new Product({ name, slug, category, weight, price, stock, images, description });
  await product.save();
  res.status(201).json(product);
};

exports.update = async (req, res) => {
  const p = await Product.findById(req.params.id);
  if (!p) return res.status(404).json({ message: 'Not found' });
  Object.assign(p, req.body);
  await p.save();
  res.json(p);
};

exports.delete = async (req, res) => {
  const p = await Product.findById(req.params.id);
  if (!p) return res.status(404).json({ message: 'Not found' });
  // soft delete
  p.deleted = true;
  await p.save();
  res.json({ message: 'Deleted' });
};
