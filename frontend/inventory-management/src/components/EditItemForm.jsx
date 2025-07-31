import { useState } from 'react';

function EditItemForm({ item, onSave, onClose }) {
  const [name, setName] = useState(item.name);
  const [quantity, setQuantity] = useState(item.quantity);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...item, name, quantity: Number(quantity) });
  };

  return (
    <div className="modal">
      <form className="edit-item-form" onSubmit={handleSubmit}>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <input
          type="number"
          value={quantity}
          onChange={e => setQuantity(e.target.value)}
          required
          min="1"
        />
        <button type="submit">Save</button>
        <button onClick={onClose} type="button">Cancel</button>
      </form>
    </div>
  );
}

export default EditItemForm;
