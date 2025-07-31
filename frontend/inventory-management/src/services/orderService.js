const API_BASE = 'http://localhost:4000/orders';

const getToken = () => localStorage.getItem('token') || '';

/**
 * Fetch all orders
 */
export const fetchOrders = async () => {
  try {
    const res = await fetch(API_BASE, {
      headers: { Authorization: `Bearer ${getToken()}` }
    });
    if (!res.ok) throw new Error('Failed to fetch orders');
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error('Orders fetch error:', error);
    return [];
  }
};

/**
 * Create a new order 
 * @param {Object} orderData - { products: [{productId, quantity}], customerName, customerContact }
 */
export const createOrder = async (orderData) => {
  try {
    const res = await fetch(API_BASE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`
      },
      body: JSON.stringify(orderData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create order');
    return data.order || data;
  } catch (error) {
    console.error('Create order error:', error);
    throw error;
  }
};

/**
 * Update order status
 * @param {string} orderId
 * @param {string} newStatus - 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
 */
export const updateOrderStatus = async (orderId, newStatus) => {
  try {
    const res = await fetch(`${API_BASE}/${orderId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`
      },
      body: JSON.stringify({ status: newStatus })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update order status');
    return data.order || data;
  } catch (error) {
    console.error('Update order status error:', error);
    throw error;
  }
};
