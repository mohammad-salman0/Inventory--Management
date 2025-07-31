const mongoose = require('mongoose');

const movementSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  movementType: String, 
  quantityChanged: Number,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('InventoryMovement', movementSchema);
