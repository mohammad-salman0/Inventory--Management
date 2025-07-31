const express = require('express');
const router = express.Router();
const Sale = require('../models/Sale');
const { Parser } = require('json2csv');
const PDFDocument = require('pdfkit');

// Helper: date range
function getDateRange(type, date) {
  const startDate = new Date(date);
  startDate.setHours(0, 0, 0, 0);
  const endDate = new Date(startDate);

  if (type === 'daily') {
    endDate.setDate(startDate.getDate() + 1);
  } else if (type === 'weekly') {
    endDate.setDate(startDate.getDate() + 7);
  } else {
    throw new Error('Invalid type. Use daily or weekly.');
  }

  return { startDate, endDate };
}

// ✅ GET: Fetch all sales
router.get('/', async (req, res) => {
  try {
    const sales = await Sale.find().sort({ date: -1 });
    res.json(sales);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch sales' });
  }
});

// ✅ POST: Create sale
router.post('/', async (req, res) => {
  const { productName, quantity, totalPrice } = req.body;

  if (!productName || !quantity || !totalPrice) {
    return res.status(400).json({ error: 'All fields (productName, quantity, totalPrice) are required' });
  }

  try {
    const sale = new Sale({ productName, quantity, totalPrice, date: new Date() });
    await sale.save();
    res.json({ message: 'Sale recorded', sale });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ GET: JSON report (daily/weekly)
router.get('/report', async (req, res) => {
  const { type, date } = req.query;

  if (!type || !date) {
    return res.status(400).json({ error: 'type and date are required' });
  }

  try {
    const { startDate, endDate } = getDateRange(type, date);
    const sales = await Sale.find({ date: { $gte: startDate, $lt: endDate } });
    res.json(sales);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ GET: Export CSV
router.get('/export/csv', async (req, res) => {
  const { type, date } = req.query;

  if (!type || !date) {
    return res.status(400).json({ error: 'type and date are required' });
  }

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

// ✅ GET: Export PDF
router.get('/export/pdf', async (req, res) => {
  const { type, date } = req.query;

  if (!type || !date) {
    return res.status(400).json({ error: 'type and date are required' });
  }

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
          `${i + 1}) Product: ${sale.productName} | Qty: ${sale.quantity} | Total: ₹${sale.totalPrice} | Date: ${new Date(sale.date).toLocaleDateString()}`
        );
      });
    }

    doc.end();
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate PDF report' });
  }
});

module.exports = router;
