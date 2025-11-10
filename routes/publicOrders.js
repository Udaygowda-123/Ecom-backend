const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

router.post("/orders", async (req, res) => {
  try {
    const { items, shippingAddress, total } = req.body;
    if (!items?.length || !shippingAddress) {
      return res.status(400).json({ message: "Invalid order data" });
    }
    const order = new Order({ items, shippingAddress, total });
    await order.save();
    res.status(201).json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
