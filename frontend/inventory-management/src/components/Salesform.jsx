// src/components/SaleForm.jsx

import React, { useState } from 'react';

const SaleForm = ({ onSubmit }) => {
  const [form, setForm] = useState({
    productName: '',
    quantity: '',
    totalPrice: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
    setForm({ productName: '', quantity: '', totalPrice: '' });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Product Name:</label>
        <input
          type="text"
          name="productName"
          value={form.productName}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Quantity:</label>
        <input
          type="number"
          name="quantity"
          value={form.quantity}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Total Price:</label>
        <input
          type="number"
          name="totalPrice"
          value={form.totalPrice}
          onChange={handleChange}
        />
      </div>
      <button type="submit">Add Sale</button>
    </form>
  );
};

export default SaleForm;
