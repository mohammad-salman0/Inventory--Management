// src/components/Sidebar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const role = localStorage.getItem('role') || 'staff';
  const location = useLocation();

  const links = [
    { path: '/', label: 'Dashboard' },
    { path: '/inventory', label: 'Inventory', adminOnly: false },
    { path: '/orders', label: 'Orders', adminOnly: false },
    { path: '/sales', label: 'Sales', adminOnly: false },
    { path: '/reports', label: 'Reports', adminOnly: true },
  ];

  return (
    <nav style={{
      width: '220px',
      backgroundColor: '#f8f9fa',
      padding: '20px',
      height: '100vh',
    }}>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {links.map(({ path, label, adminOnly }) => {
          if (adminOnly && role !== 'admin') return null; // Hide admin-only links
          return (
            <li key={path} style={{ marginBottom: '15px' }}>
              <Link to={path} style={{
                textDecoration: 'none',
                color: location.pathname === path ? '#007bff' : 'black',
                fontWeight: location.pathname === path ? 'bold' : 'normal',
              }}>
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Sidebar;
