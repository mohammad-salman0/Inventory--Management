// routes/inventoryRoutes.js

const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const auth = require('../middleware/auth');

// GET inventory list with optional low-stock filter
router.get('/', auth(['admin', 'staff']), async (req, res) => {
  try {
    // Optional query param to filter low stock
    const lowStockThreshold = parseInt(req.query.lowStockThreshold) || 5;

    const products = await Product.find();
    const inventory = products.map((p) => ({
      _id: p._id,
      name: p.name,
      sku: p.sku,
      price: p.price,
      quantity: p.quantity,
      category: p.category,
      imageUrl: p.imageUrl,
      lowStock: p.quantity <= lowStockThreshold,
    }));
    res.json({ message: 'Inventory fetched', data: inventory });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch inventory' });
  }
});

module.exports = router;
