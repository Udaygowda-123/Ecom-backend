const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const oc = require('../controllers/orderController');

// Admin order routes (auth only)
router.get('/orders', auth, oc.list);
router.get('/orders/:id', auth, oc.getById);
router.put('/orders/:id/status', auth, oc.updateStatus);
router.put('/orders/:id/notes', auth, oc.addNote);
router.post('/orders/export', auth, oc.exportCsv);

module.exports = router;
