const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Get all products (public)
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find({ deleted: false }).limit(50).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single product by slug (public)
router.get('/products/:slug', async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug, deleted: false });
    if (!product) return res.status(404).json({ message: 'Not found' });
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
