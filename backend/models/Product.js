const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  sku: String,
  quantity: Number,
  price: Number,
  category: String,
  imageUrl: String
});

module.exports = mongoose.model('Product', productSchema);
