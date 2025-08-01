import React, { useEffect, useState } from 'react';
import { fetchInventory } from '../services/inventoryService';
import { fetchSales } from '../services/salesService';

const Dashboard = () => {
  const [inventory, setInventory] = useState([]);
  const [sales, setSales] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const inventoryData = await fetchInventory();
      const salesData = await fetchSales();
      setInventory(inventoryData || []);
      setSales(salesData || []);
    };
    loadData();
  }, []);

  const totalProducts = inventory.length;
  const totalSales = sales.length;

  const lowStockThreshold = 5; // configurable threshold
  const lowStockItems = inventory.filter(item => item.quantity <= lowStockThreshold);

  const recentSales = sales.slice(-5).reverse();

  return (
    <div>
      <h2>Dashboard</h2>

      <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem' }}>
        <div>
          <h3>Total Products</h3>
          <p>{totalProducts}</p>
        </div>
        <div>
          <h3>Total Sales</h3>
          <p>{totalSales}</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '4rem' }}>
        <div>
          <h3>Low Stock Products (≤ {lowStockThreshold})</h3>
          <ul>
            {lowStockItems.length === 0 ? (
              <li>No low-stock items</li>
            ) : (
              lowStockItems.map(item => (
                <li key={item._id}>
                  {item.name} – {item.quantity} pcs
                </li>
              ))
            )}
          </ul>
        </div>

        <div>
          <h3>Recent Sales</h3>
          <ul>
            {recentSales.length === 0 ? (
              <li>No recent sales</li>
            ) : (
              recentSales.map(sale => (
                <li key={sale._id}>
                  {sale.productName} – {sale.quantity} pcs – ₹{sale.totalPrice}
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
