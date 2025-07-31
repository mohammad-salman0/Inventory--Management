// models/Product.js

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sku: { type: String, required: true, unique: true },
  quantity: { type: Number, required: true, min: 0 },
  price: { type: Number, required: true, min: 0 },
  category: { type: String },
  imageUrl: { type: String },
});

module.exports = mongoose.model('Product', productSchema);
