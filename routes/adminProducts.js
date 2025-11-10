const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const pc = require('../controllers/productController');

// Admin product routes (auth only)
router.get('/products', auth, pc.list);
router.get('/products/:id', auth, pc.getById);
router.post('/products', auth, pc.create);
router.put('/products/:id', auth, pc.update);
router.delete('/products/:id', auth, pc.delete);

module.exports = router;
