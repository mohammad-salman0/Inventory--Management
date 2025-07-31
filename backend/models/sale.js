// models/Sale.js

const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  totalPrice: { type: Number, required: true, min: 0 },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Sale', saleSchema);
