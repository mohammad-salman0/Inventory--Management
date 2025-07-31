// routes/inventoryRoutes.js
const express = require('express');
const router = express.Router();

let inventory = []; // temporary in-memory DB
let id = 1;

router.get('/', (req, res) => {
  res.json(inventory);
});

router.post('/', (req, res) => {
  const { name, price, quantity } = req.body;
  if (!name || !price || !quantity) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  const newItem = { id: id++, name, price, quantity };
  inventory.push(newItem);
  res.status(201).json(newItem);
});

// DELETE from in-memory inventory
router.delete('/:id', (req, res) => {
  const itemId = parseInt(req.params.id);
  const index = inventory.findIndex(item => item.id === itemId);

  if (index === -1) {
    return res.status(404).json({ error: 'Item not found' });
  }

  inventory.splice(index, 1);
  res.json({ message: 'Item deleted' });
});


module.exports = router;
