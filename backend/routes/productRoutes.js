const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { Parser } = require('json2csv');
const PDFDocument = require('pdfkit');

// Get all products
router.get('/', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// Add a product
router.post('/', async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.json({ message: 'Product added' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update product
router.put('/:id', async (req, res) => {
  await Product.findByIdAndUpdate(req.params.id, req.body);
  res.json({ message: 'Product updated' });
});

// Delete product

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});


// Export as CSV
router.get('/export/csv', async (req, res) => {
  try {
    const products = await Product.find();
    const fields = ['name', 'sku', 'price', 'quantity', 'category'];
    const parser = new Parser({ fields });
    const csv = parser.parse(products);

    res.header('Content-Type', 'text/csv');
    res.attachment('inventory.csv');
    return res.send(csv);
  } catch (err) {
    res.status(500).json({ error: 'Failed to export CSV' });
  }
});


module.exports = router;
