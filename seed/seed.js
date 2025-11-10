require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Product = require('../models/Product');
const bcrypt = require('bcryptjs');

(async () => {
  try {
    await connectDB();

    // Create admin if missing
    const adminEmail = 'admin@example.com';
    let admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      const hashed = await bcrypt.hash('Admin@12345', 10);
      admin = new User({ name: 'Admin', email: adminEmail, password: hashed, role: 'admin' });
      await admin.save();
      console.log('✅ Admin created');
    } else {
      console.log('ℹ️ Admin already exists');
    }

    // Sample product data
    const sampleProducts = [
      {
        name: 'Wireless Headphones',
        slug: 'wireless-headphones',
        category: 'Electronics',
        weight: 0.3,
        price: 4999,
        stock: 100,
        images: ['https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1600&q=80'],
        description: 'High-quality wireless headphones with deep bass and noise cancellation.',
      },
      {
        name: 'Classic Sneakers',
        slug: 'classic-sneakers',
        category: 'Footwear',
        weight: 0.8,
        price: 2499,
        stock: 50,
        images: ['https://images.unsplash.com/photo-1519744792095-2f2205e87b6f?w=800'],
        description: 'Lightweight and comfortable everyday sneakers for men and women.',
      },
      {
        name: 'Cotton T-Shirt',
        slug: 'cotton-tshirt',
        category: 'Apparel',
        weight: 0.2,
        price: 699,
        stock: 200,
        images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80'],
        description: 'Soft 100% cotton t-shirt available in multiple colors.',
      },
    ];

    // Clear old products and insert fresh
    await Product.deleteMany({});
    await Product.insertMany(sampleProducts);

    console.log('✅ Sample products inserted');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
})();
