import { useState } from 'react';

function AddItemForm({ onAdd }) {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const newItem = { id: Date.now(), name, quantity: Number(quantity) };
    onAdd(newItem);
    setName('');
    setQuantity('');
  };

  return (
    <form className="add-item-form" onSubmit={handleSubmit}>
      <input
        placeholder="Item Name"
        value={name}
        onChange={e => setName(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Quantity"
        value={quantity}
        onChange={e => setQuantity(e.target.value)}
        required
        min="1"
      />
      <button type="submit">Add Item</button>
    </form>
  );
}

export default AddItemForm;
