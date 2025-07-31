// src/pages/Orders.jsx
import React, { useEffect, useState } from 'react';

const Orders = () => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    customerName: '',
    customerContact: '',
    items: [{ productId: '', quantity: '' }],
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Fetch orders
    fetch('http://localhost:4000/orders', { headers: { Authorization: 'Bearer ' + token } })
      .then(res => res.json())
      .then(data => data.data && setOrders(data.data))
      .catch(() => setMessage('Failed to load orders'));

    // Fetch products for order items
    fetch('http://localhost:4000/products', { headers: { Authorization: 'Bearer ' + token } })
      .then(res => res.json())
      .then(data => data.data && setProducts(data.data))
      .catch(() => setMessage('Failed to load products'));
  }, [token]);

  // Handle order form change
  const handleFormChange = (field, value, index = null) => {
    if (field === 'items') {
      const newItems = [...form.items];
      newItems[index] = value;
      setForm(prev => ({ ...prev, items: newItems }));
    } else {
      setForm(prev => ({ ...prev, [field]: value }));
    }
  };

  // Add item to order
  const addItem = () => {
    setForm(prev => ({ ...prev, items: [...prev.items, { productId: '', quantity: '' }] }));
  };

  // Remove item
  const removeItem = (index) => {
    setForm(prev => ({ ...prev, items: prev.items.filter((_, i) => i !== index) }));
  };

  // Submit order
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    const payload = {
      customerName: form.customerName.trim(),
      customerContact: form.customerContact.trim(),
      products: form.items.filter(i => i.productId && i.quantity).map(i => ({
        productId: i.productId,
        quantity: Number(i.quantity),
      })),
    };
    if (!payload.customerName || !payload.customerContact || payload.products.length === 0) {
      setMessage('Complete all order details and add at least one item');
      return;
    }

    try {
      const res = await fetch('http://localhost:4000/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        setOrders(prev => [...prev, data.order]);
        setForm({ customerName: '', customerContact: '', items: [{ productId: '', quantity: '' }] });
        setMessage('Order placed successfully');
      } else {
        setMessage(data.error || 'Failed to place order');
      }
    } catch {
      setMessage('Server error placing order');
    }
  };

  // Change order status
  const updateStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`http://localhost:4000/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (res.ok) {
        setOrders(prev => prev.map(o => (o._id === orderId ? data.order : o)));
        setMessage('Status updated');
      } else {
        setMessage(data.error || 'Failed to update status');
      }
    } catch {
      setMessage('Server error updating status');
    }
  };

  const statusOptions = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

  return (
    <div>
      <h2>Orders</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit} style={{ marginBottom: 30 }}>
        <h3>Create New Order</h3>
        <div>
          <input type="text" placeholder="Customer Name" value={form.customerName}
            onChange={e => handleFormChange('customerName', e.target.value)} required />
        </div>
        <div>
          <input type="text" placeholder="Customer Contact" value={form.customerContact}
            onChange={e => handleFormChange('customerContact', e.target.value)} required />
        </div>
        <div>
          <label>Order Items:</label>
          {form.items.map((item, idx) => (
            <div key={idx} style={{ marginBottom: 8, display: 'flex', gap: 10 }}>
              <select value={item.productId} onChange={e => handleFormChange('items', { ...item, productId: e.target.value }, idx)} required>
                <option value="">Select product</option>
                {products.map(p => (
                  <option key={p._id} value={p._id}>{p.name} (Stock: {p.quantity})</option>
                ))}
              </select>
              <input type="number" min="1" placeholder="Quantity" value={item.quantity}
                onChange={e => handleFormChange('items', { ...item, quantity: e.target.value }, idx)} required />
              {form.items.length > 1 && (
                <button type="button" onClick={() => removeItem(idx)}>Remove</button>
              )}
            </div>
          ))}
          <button type="button" onClick={addItem}>Add Item</button>
        </div>
        <button type="submit" style={{ marginTop: 10 }}>Place Order</button>
      </form>

      <h3>Existing Orders</h3>
      {orders.length === 0 ? <p>No orders found.</p> : (
        <table border="1" cellPadding="6" cellSpacing="0" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Customer</th>
              <th>Contact</th>
              <th>Date</th>
              <th>Products</th>
              <th>Status</th>
              {role === 'admin' || role === 'staff' ? <th>Update Status</th> : null}
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id}>
                <td>{order.customerName}</td>
                <td>{order.customerContact}</td>
                <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                <td>
                  <ul style={{ margin: 0, paddingLeft: '20px' }}>
                    {order.products.map(({ productId, quantity }, idx) => (
                      <li key={idx}>{productId?.name || 'Unknown'} x {quantity}</li>
                    ))}
                  </ul>
                </td>
                <td>{order.status}</td>
                {(role === 'admin' || role === 'staff') && (
                  <td>
                    <select value={order.status} onChange={e => updateStatus(order._id, e.target.value)}>
                      {statusOptions.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Orders;
