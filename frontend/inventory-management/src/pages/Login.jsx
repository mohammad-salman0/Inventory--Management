// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMsg('');

    try {
      const response = await fetch('http://localhost:4000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.role);
        localStorage.setItem('username', data.name);
        navigate('/');
      } else {
        setMsg(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setMsg('Server error. Please try again later.');
    }
  };

  return (
    <div
      style={{
        maxWidth: 400,
        margin: 'auto',
        marginTop: 50,
        padding: 20,
        boxShadow: '0 0 10px rgba(0,0,0,0.1)',
        borderRadius: 8,
        backgroundColor: '#fff',
      }}
    >
      <h2 style={{ marginBottom: 20, color: '#333' }}>Login</h2>
      {msg && <p style={{ color: 'red', marginBottom: 20 }}>{msg}</p>}
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: 15 }}>
          <label htmlFor="email" style={{ fontWeight: '600', display: 'block', marginBottom: 6 }}>
            Email:
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            autoFocus
            style={{
              width: '100%',
              padding: '8px 10px',
              fontSize: '1rem',
              borderRadius: 4,
              border: '1.5px solid #ccc',
              boxSizing: 'border-box',
              transition: 'border-color 0.3s',
            }}
            onFocus={e => (e.target.style.borderColor = '#2980b9')}
            onBlur={e => (e.target.style.borderColor = '#ccc')}
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label htmlFor="password" style={{ fontWeight: '600', display: 'block', marginBottom: 6 }}>
            Password:
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '8px 10px',
              fontSize: '1rem',
              borderRadius: 4,
              border: '1.5px solid #ccc',
              boxSizing: 'border-box',
              transition: 'border-color 0.3s',
            }}
            onFocus={e => (e.target.style.borderColor = '#2980b9')}
            onBlur={e => (e.target.style.borderColor = '#ccc')}
          />
        </div>

        <button
          type="submit"
          style={{
            width: '100%',
            padding: '10px',
            fontSize: '1.1rem',
            fontWeight: '600',
            color: '#fff',
            backgroundColor: '#2980b9',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer',
            transition: 'background-color 0.3s',
          }}
          onMouseOver={e => (e.currentTarget.style.backgroundColor = '#1c5980')}
          onMouseOut={e => (e.currentTarget.style.backgroundColor = '#2980b9')}
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
