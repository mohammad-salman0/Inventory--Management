const API_BASE = 'http://localhost:4000/products';

// Helper to get token for Authorization header
const getToken = () => localStorage.getItem('token') || '';

/**
 * Fetch all products (inventory)
 */
export const fetchInventory = async () => {
  try {
    const res = await fetch(API_BASE, {
      headers: { Authorization: `Bearer ${getToken()}` }
    });
    if (!res.ok) throw new Error('Failed to fetch inventory');
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error('Inventory fetch error:', error);
    return [];
  }
};

/**
 * Add new product (admin only)
 * @param {Object} product - { name, sku, price, quantity, category, imageUrl }
 */
export const addProduct = async (product) => {
  try {
    const res = await fetch(API_BASE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`
      },
      body: JSON.stringify(product)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to add product');
    return data.data;
  } catch (error) {
    console.error('Add product error:', error);
    throw error;
  }
};

/**
 * Update existing product (admin only)
 * @param {string} id - product ID
 * @param {Object} updates - fields to update
 */
export const updateProduct = async (id, updates) => {
  try {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(updates),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update product');
    return data.data;
  } catch (error) {
    console.error('Update product error:', error);
    throw error;
  }
};

/**
 * Delete product by ID (admin only)
 * @param {string} id
 */
export const deleteProduct = async (id) => {
  try {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${getToken()}` }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to delete product');
    return true;
  } catch (error) {
    console.error('Delete product error:', error);
    throw error;
  }
};
