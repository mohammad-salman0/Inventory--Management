// models/Order.js

const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  products: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1 },
  }],
  customerName: { type: String, required: true },
  customerContact: { type: String, required: true },
  orderDate: { type: Date, default: Date.now },
  status: { type: String, default: 'pending', enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'] },
});

module.exports = mongoose.model('Order', orderSchema);
