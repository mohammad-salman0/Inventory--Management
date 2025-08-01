// src/components/Header.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const headerStyle = {
  backgroundColor: '#007bff',
  color: 'white',
  padding: '10px 20px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
  position: 'sticky',
  top: 0,
  zIndex: 1000,
};

const buttonStyle = {
  backgroundColor: '#dc3545',
  color: 'white',
  border: 'none',
  padding: '8px 14px',
  borderRadius: '4px',
  cursor: 'pointer',
  fontWeight: '600',
  transition: 'background-color 0.3s',
};

const buttonHoverStyle = {
  backgroundColor: '#b52c2c',
};

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Optional: Confirm logout
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('username');
      navigate('/login', { replace: true });
    }
  };

  // Since inline styles can't handle hover directly, we can add a small workaround with React state (optional)
  // for button hover effect if needed. Otherwise, just keep simple style.

  return (
    <header style={headerStyle}>
      <h1 style={{ margin: 0, fontSize: '1.5rem' }}>Inventory & Order Management</h1>
      <button
        onClick={handleLogout}
        style={buttonStyle}
        onMouseEnter={e => (e.currentTarget.style.backgroundColor = buttonHoverStyle.backgroundColor)}
        onMouseLeave={e => (e.currentTarget.style.backgroundColor = buttonStyle.backgroundColor)}
        aria-label="Logout"
      >
        Logout
      </button>
    </header>
  );
};

export default Header;
