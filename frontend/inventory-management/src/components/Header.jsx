// src/components/Header.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    navigate('/login');
  };

  return (
    <header style={{
      backgroundColor: '#007bff',
      color: 'white',
      padding: '10px 20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}>
      <h1>Inventory & Order Management</h1>
      <button onClick={handleLogout} style={{
        backgroundColor: '#dc3545',
        color: 'white',
        border: 'none',
        padding: '8px 12px',
        borderRadius: '4px',
        cursor: 'pointer',
      }}>
        Logout
      </button>
    </header>
  );
};

export default Header;
