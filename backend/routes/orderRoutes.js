// routes/orderRoutes.js

const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const InventoryMovement = require('../models/InventoryManagement');
const mongoose = require('mongoose');
const auth = require('../middleware/auth');

// Helper to log product movement
async function logProductMovement(productId, type, qty) {
  await InventoryMovement.create({ productId, movementType: type, quantityChanged: qty });
}

// POST create order - admin/staff
router.post('/', auth(['admin', 'staff']), async (req, res) => {
  try {
    const { products, customerName, customerContact } = req.body;

    if (!products || !Array.isArray(products) || products.length === 0 || !customerName || !customerContact) {
      return res.status(400).json({ error: 'Products, customer name and contact are required' });
    }

    // Validate product quantity availability
    for (let item of products) {
      const product = await Product.findById(item.productId);
      if (!product) return res.status(400).json({ error: `Product not found: ${item.productId}` });
      if (product.quantity < item.quantity) {
        return res.status(400).json({ error: `Insufficient stock for ${product.name}` });
      }
    }

    const order = new Order({ products, customerName, customerContact, status: 'pending' });
    await order.save();

    // Reduce stock for each product and log movement
    for (let item of products) {
      await Product.findByIdAndUpdate(item.productId, { $inc: { quantity: -item.quantity } });
      await logProductMovement(item.productId, 'remove', item.quantity);
    }

    res.status(201).json({ message: 'Order placed successfully', order });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

// GET all orders - admin/staff
router.get('/', auth(['admin', 'staff']), async (req, res) => {
  try {
    const orders = await Order.find().populate('products.productId');
    res.json({ message: 'Orders fetched', data: orders });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// PUT update order status - admin/staff
router.put('/:id/status', auth(['admin', 'staff']), async (req, res) => {
  const orderId = req.params.id;
  const { status } = req.body;
  const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }
  if (!mongoose.isValidObjectId(orderId)) {
    return res.status(400).json({ error: 'Invalid order ID' });
  }

  try {
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    // If cancelling order, revert stock quantities
    if (status === 'cancelled' && order.status !== 'cancelled') {
      for (let item of order.products) {
        await Product.findByIdAndUpdate(item.productId, { $inc: { quantity: item.quantity } });
        await logProductMovement(item.productId, 'add', item.quantity);
      }
    }

    order.status = status;
    await order.save();

    res.json({ message: 'Order status updated', order });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update status' });
  }
});

module.exports = router;
