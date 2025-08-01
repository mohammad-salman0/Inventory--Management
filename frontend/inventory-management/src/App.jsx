// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Header from './components/Header';
import Sidebar from './components/Sidebar';

import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import Orders from './pages/Orders';
import Sales from './pages/Sales';
import Reports from './pages/Reports';
import Login from './pages/Login';
import Register from './pages/Register';

const App = () => {
  const token = localStorage.getItem('token');
  const isAuthenticated = Boolean(token);

  return (
    <Router>
      {isAuthenticated && <Header />}

      <div style={{ display: 'flex' }}>
        {isAuthenticated && <Sidebar />}
        <main style={{ flexGrow: 1, padding: '20px' }}>
          <Routes>
            <Route
              path="/login"
              element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}
            />
            <Route
              path="/register"
              element={isAuthenticated ? <Navigate to="/" replace /> : <Register />}
            />

            {isAuthenticated ? (
              <>
                <Route path="/" element={<Dashboard />} />
                <Route path="/inventory" element={<Inventory />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/sales" element={<Sales />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </>
            ) : (
              <Route path="*" element={<Navigate to="/login" replace />} />
            )}
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
