// routes/saleRoutes.js

const express = require('express');
const router = express.Router();
const Sale = require('../models/Sale');
const { Parser } = require('json2csv');
const PDFDocument = require('pdfkit');
const auth = require('../middleware/auth');

// Helper: parse date ranges for daily/weekly report
function getDateRange(type, date) {
  if (!['daily', 'weekly'].includes(type)) {
    throw new Error('Invalid type. Use daily or weekly.');
  }
  const startDate = new Date(date);
  if (isNaN(startDate)) {
    throw new Error('Invalid date format.');
  }
  startDate.setHours(0, 0, 0, 0);
  const endDate = new Date(startDate);
  if (type === 'daily') {
    endDate.setDate(startDate.getDate() + 1);
  } else {
    endDate.setDate(startDate.getDate() + 7);
  }
  return { startDate, endDate };
}

// GET all sales - admin/staff
router.get('/', auth(['admin', 'staff']), async (req, res) => {
  try {
    const sales = await Sale.find().sort({ date: -1 });
    res.json({ message: 'Sales fetched successfully', data: sales });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch sales' });
  }
});

// POST create sale - admin/staff
router.post('/', auth(['admin', 'staff']), async (req, res) => {
  const { productName, quantity, totalPrice } = req.body;
  if (!productName || quantity == null || totalPrice == null) {
    return res.status(400).json({ error: 'Product name, quantity, and total price are required' });
  }
  if (quantity <= 0 || totalPrice < 0) {
    return res.status(400).json({ error: 'Quantity must be positive and total price must be non-negative' });
  }
  try {
    const sale = new Sale({ productName, quantity, totalPrice, date: new Date() });
    await sale.save();
    res.status(201).json({ message: 'Sale recorded successfully', data: sale });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET sales report by daily/weekly range
router.get('/report', auth(['admin', 'staff']), async (req, res) => {
  const { type, date } = req.query;
  if (!type || !date) return res.status(400).json({ error: 'Type and date are required' });
  try {
    const { startDate, endDate } = getDateRange(type, date);
    const sales = await Sale.find({ date: { $gte: startDate, $lt: endDate } });
    res.json({ message: `Sales report for ${type} period`, data: sales });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET export CSV sales report
router.get('/export/csv', auth(['admin', 'staff']), async (req, res) => {
  const { type, date } = req.query;
  if (!type || !date) return res.status(400).json({ error: 'Type and date required' });

  try {
    const { startDate, endDate } = getDateRange(type, date);
    const sales = await Sale.find({ date: { $gte: startDate, $lt: endDate } });
    const fields = ['productName', 'quantity', 'totalPrice', 'date'];
    const parser = new Parser({ fields });
    const csv = parser.parse(sales);
    res.header('Content-Type', 'text/csv');
    res.attachment(`sales_report_${type}.csv`);
    res.send(csv);
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate CSV report' });
  }
});

// GET export PDF sales report
router.get('/export/pdf', auth(['admin', 'staff']), async (req, res) => {
  const { type, date } = req.query;
  if (!type || !date) return res.status(400).json({ error: 'Type and date required' });

  try {
    const { startDate, endDate } = getDateRange(type, date);
    const sales = await Sale.find({ date: { $gte: startDate, $lt: endDate } });

    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=sales_report_${type}.pdf`);
    doc.pipe(res);

    doc.fontSize(18).text(`Sales Report (${type})`, { align: 'center' });
    doc.moveDown();

    if (sales.length === 0) {
      doc.fontSize(14).text('No sales found for the selected period.', { align: 'center' });
    } else {
      sales.forEach((sale, i) => {
        doc.fontSize(12).text(
          `${i + 1}) Product: ${sale.productName} | Qty: ${sale.quantity} | Total: ₹${sale.totalPrice} | Date: ${sale.date.toLocaleDateString()}`
        );
      });
    }

    doc.end();
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate PDF report' });
  }
});

module.exports = router;
