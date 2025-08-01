// routes/productRoutes.js

const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const InventoryMovement = require('../models/InventoryManagement');
const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const { Parser } = require('json2csv');

// Helper to log movement
async function logProductMovement(productId, type, qty) {
  await InventoryMovement.create({ productId, movementType: type, quantityChanged: qty });
}

// GET all products -- open or restricted to logged in users
router.get('/', auth(['admin', 'staff']), async (req, res) => {
  try {
    const products = await Product.find();
    res.json({ message: 'Products fetched successfully', data: products });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// POST add product -- admin only
router.post('/', auth(['admin']), async (req, res) => {
  const { name, sku, price, quantity, category, imageUrl } = req.body;
  if (!name || !sku || price == null || quantity == null) {
    return res.status(400).json({ error: 'Name, SKU, price, and quantity are required' });
  }
  if (price < 0 || quantity < 0) {
    return res.status(400).json({ error: 'Price and quantity must be non-negative' });
  }
  try {
    const existing = await Product.findOne({ sku });
    if (existing) return res.status(400).json({ error: 'SKU must be unique' });

    const product = new Product({ name, sku, price, quantity, category, imageUrl });
    await product.save();
    await logProductMovement(product._id, 'add', quantity);

    res.status(201).json({ message: 'Product added successfully', data: product });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT update product - admin only
router.put('/:id', auth(['admin']), async (req, res) => {
  const productId = req.params.id;
  if (!mongoose.isValidObjectId(productId)) {
    return res.status(400).json({ error: 'Invalid product ID' });
  }
  try {
    const oldProduct = await Product.findById(productId);
    if (!oldProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check SKU uniqueness if sku changed
    if (req.body.sku && req.body.sku !== oldProduct.sku) {
      const skuExists = await Product.findOne({ sku: req.body.sku });
      if (skuExists) {
        return res.status(400).json({ error: 'SKU must be unique' });
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(productId, req.body, { new: true });

    // Detect quantity change to log movement
    const qtyDiff = (req.body.quantity || updatedProduct.quantity) - oldProduct.quantity;
    if (qtyDiff !== 0) {
      const movementType = qtyDiff > 0 ? 'add' : 'remove';
      await logProductMovement(productId, movementType, Math.abs(qtyDiff));
    }
    res.json({ message: 'Product updated successfully', data: updatedProduct });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE product - admin only
router.delete('/:id', auth(['admin']), async (req, res) => {
  const productId = req.params.id;
  if (!mongoose.isValidObjectId(productId)) {
    return res.status(400).json({ error: 'Invalid product ID' });
  }
  try {
    const product = await Product.findByIdAndDelete(productId);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    await logProductMovement(productId, 'remove', product.quantity);
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// GET export CSV - admin or staff
router.get('/export/csv', auth(['admin', 'staff']), async (req, res) => {
  try {
    const products = await Product.find();
    const fields = ['name', 'sku', 'price', 'quantity', 'category'];
    const parser = new Parser({ fields });
    const csv = parser.parse(products);
    res.header('Content-Type', 'text/csv');
    res.attachment('inventory.csv');
    res.send(csv);
  } catch (err) {
    res.status(500).json({ error: 'Failed to export CSV' });
  }
});

module.exports = router;
