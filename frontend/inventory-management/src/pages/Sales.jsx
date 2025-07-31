// src/pages/Sales.jsx
import React, { useEffect, useState } from 'react';

const Sales = () => {
  const token = localStorage.getItem('token');
  const [sales, setSales] = useState([]);
  const [form, setForm] = useState({
    productName: '',
    quantity: '',
    totalPrice: '',
  });
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetch('http://localhost:4000/sales', {
      headers: { Authorization: 'Bearer ' + token }
    })
      .then(res => res.json())
      .then(data => data.data && setSales(data.data))
      .catch(() => setMsg('Failed to fetch sales'));
  }, [token]);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    if (!form.productName || !form.quantity || !form.totalPrice) {
      setMsg('All fields are required');
      return;
    }
    try {
      const res = await fetch('http://localhost:4000/sales', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify({
          productName: form.productName,
          quantity: Number(form.quantity),
          totalPrice: Number(form.totalPrice),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setSales(prev => [...prev, data.data]);
        setForm({ productName: '', quantity: '', totalPrice: '' });
        setMsg('Sale recorded');
      } else {
        setMsg(data.error || 'Failed to record sale');
      }
    } catch {
      setMsg('Server error recording sale');
    }
  };

  return (
    <div>
      <h2>Sales</h2>
      {msg && <p>{msg}</p>}
      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <input name="productName" placeholder="Product Name" value={form.productName} onChange={handleChange} required />
        <input name="quantity" type="number" min="1" placeholder="Quantity" value={form.quantity} onChange={handleChange} required />
        <input name="totalPrice" type="number" step="0.01" min="0" placeholder="Total Price" value={form.totalPrice} onChange={handleChange} required />
        <button type="submit">Record Sale</button>
      </form>

      <h3>Sales Records</h3>
      {sales.length === 0 ? <p>No sales recorded.</p> : (
        <table border="1" cellPadding="6" cellSpacing="0" style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Quantity</th>
              <th>Total Price</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {sales.map(sale => (
              <tr key={sale._id}>
                <td>{sale.productName}</td>
                <td>{sale.quantity}</td>
                <td>{sale.totalPrice.toFixed(2)}</td>
                <td>{new Date(sale.date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Sales;
