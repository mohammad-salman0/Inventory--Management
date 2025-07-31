// src/pages/Inventory.jsx
import React, { useEffect, useState } from 'react';

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: '',
    sku: '',
    category: '',
    price: '',
    quantity: '',
    imageUrl: '',
  });
  const [msg, setMsg] = useState('');
  const role = localStorage.getItem('role') || 'staff';
  const token = localStorage.getItem('token');

  // Fetch products
  useEffect(() => {
    fetch('http://localhost:4000/products', {
      headers: { Authorization: 'Bearer ' + token }
    })
      .then(res => res.json())
      .then(data => {
        if (data.data) setProducts(data.data);
      })
      .catch(() => setMsg('Failed to fetch products'));
  }, [token]);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Add product (admin only)
  const handleAdd = async (e) => {
    e.preventDefault();
    setMsg('');
    // Basic validation
    if (!form.name || !form.sku || !form.price || !form.quantity) {
      setMsg('Name, SKU, Price, and Quantity are required');
      return;
    }
    try {
      const res = await fetch('http://localhost:4000/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token,
        },
        body: JSON.stringify({
          name: form.name,
          sku: form.sku,
          category: form.category,
          price: parseFloat(form.price),
          quantity: parseInt(form.quantity),
          imageUrl: form.imageUrl,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setProducts(prev => [...prev, data.data]);
        setForm({ name: '', sku: '', category: '', price: '', quantity: '', imageUrl: '' });
        setMsg('Product added successfully');
      } else {
        setMsg(data.error || 'Failed to add product');
      }
    } catch {
      setMsg('Server error adding product');
    }
  };

  // Delete product (admin only)
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      const res = await fetch(`http://localhost:4000/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: 'Bearer ' + token }
      });
      const data = await res.json();
      if (res.ok) {
        setProducts(prev => prev.filter(p => p._id !== id));
        setMsg('Product deleted');
      } else {
        setMsg(data.error || 'Failed to delete product');
      }
    } catch {
      setMsg('Server error deleting product');
    }
  };

  return (
    <div>
      <h2>Inventory</h2>
      {msg && <p>{msg}</p>}

      {role === 'admin' && (
        <form onSubmit={handleAdd} style={{ marginBottom: 20 }}>
          <h3>Add New Product</h3>
          <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
          <input name="sku" placeholder="SKU" value={form.sku} onChange={handleChange} required />
          <input name="category" placeholder="Category" value={form.category} onChange={handleChange} />
          <input name="price" placeholder="Price" type="number" step="0.01" value={form.price} onChange={handleChange} required />
          <input name="quantity" placeholder="Quantity" type="number" value={form.quantity} onChange={handleChange} required />
          <input name="imageUrl" placeholder="Image URL" value={form.imageUrl} onChange={handleChange} />
          <button type="submit">Add Product</button>
        </form>
      )}

      <table border="1" cellPadding="6" cellSpacing="0" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>SKU</th>
            <th>Category</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Image</th>
            {role === 'admin' && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p._id} style={{ backgroundColor: p.quantity <= 5 ? '#ffe6e6' : 'inherit' }}>
              <td>{p.name}</td>
              <td>{p.sku}</td>
              <td>{p.category || '-'}</td>
              <td>{p.price.toFixed(2)}</td>
              <td>{p.quantity}</td>
              <td>{p.imageUrl ? <img src={p.imageUrl} alt={p.name} style={{ width: 50 }} /> : '-'}</td>
              {role === 'admin' && (
                <td>
                  <button onClick={() => handleDelete(p._id)}>Delete</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      <p style={{ marginTop: 10, color: 'red' }}>* Rows highlighted red have low stock (≤5)</p>
    </div>
  );
};

export default Inventory;
