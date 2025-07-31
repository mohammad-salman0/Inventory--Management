const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');

// Create order and update stock
router.post('/', async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();

    // Reduce stock
    for (let item of order.products) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { quantity: -item.quantity }
      });
    }

    res.json({ message: 'Order placed' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all orders
router.get('/', async (req, res) => {
  const orders = await Order.find().populate('products.productId');
  res.json(orders);
});

module.exports = router;
