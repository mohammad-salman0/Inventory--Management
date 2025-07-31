// models/InventoryManagement.js

const mongoose = require('mongoose');

const movementSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  movementType: { type: String, required: true, enum: ['add', 'remove', 'adjust'] },
  quantityChanged: { type: Number, required: true },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('InventoryMovement', movementSchema);
