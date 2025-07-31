const API_BASE = 'http://localhost:4000/sales';

const getToken = () => localStorage.getItem('token') || '';

/**
 * Fetch all sales records
 */
export const fetchSales = async () => {
  try {
    const res = await fetch(API_BASE, {
      headers: { Authorization: `Bearer ${getToken()}` }
    });
    if (!res.ok) throw new Error('Failed to fetch sales');
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error('Sales fetch error:', error);
    return [];
  }
};

/**
 * Create a new sale record
 * @param {Object} sale - { productName, quantity, totalPrice }
 */
export const createSale = async (sale) => {
  try {
    const res = await fetch(API_BASE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`
      },
      body: JSON.stringify(sale)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create sale');
    return data.data;
  } catch (error) {
    console.error('Create sale error:', error);
    throw error;
  }
};

/**
 * Fetch sales report filtered by type and date
 * @param {string} reportType - 'daily' or 'weekly'
 * @param {string} date - ISO date string (YYYY-MM-DD)
 */
export const getSalesReport = async (reportType, date) => {
  try {
    const params = new URLSearchParams({ type: reportType, date }).toString();
    const res = await fetch(`${API_BASE}/report?${params}`, {
      headers: { Authorization: `Bearer ${getToken()}` }
    });
    if (!res.ok) throw new Error('Failed to fetch sales report');
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error('Sales report fetch error:', error);
    return [];
  }
};

/**
 * Export sales report as CSV or PDF, triggers download
 * @param {string} format - 'csv' or 'pdf'
 * @param {string} reportType - 'daily' or 'weekly'
 * @param {string} date - ISO date string (YYYY-MM-DD)
 */
export const exportSalesReport = async (format, reportType, date) => {
  try {
    if (!['csv', 'pdf'].includes(format)) throw new Error('Unsupported export format');
    const params = new URLSearchParams({ type: reportType, date }).toString();
    const res = await fetch(`${API_BASE}/export/${format}?${params}`, {
      headers: { Authorization: `Bearer ${getToken()}` }
    });
    if (!res.ok) throw new Error('Failed to export sales report');

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sales_report_${reportType}_${date}.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Export sales report error:', error);
    throw error;
  }
};
