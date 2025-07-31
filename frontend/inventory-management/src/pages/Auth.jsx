import React, { useState } from 'react';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const endpoint = isLogin ? 'login' : 'register';
    const url = `http://localhost:4000/auth/${endpoint}`;

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(isLogin ? 'Login successful!' : 'Registration successful!');
        // Store token or redirect here if needed
      } else {
        setMessage(data.message || 'Something went wrong.');
      }
    } catch (err) {
      console.error(err);
      setMessage('Server error.');
    }
  };

  return (
    <div>
      <h2>{isLogin ? 'Login' : 'Register'}</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Email: </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label>Password: </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit">
          {isLogin ? 'Login' : 'Register'}
        </button>
      </form>

      <button onClick={toggleMode}>
        {isLogin ? 'Switch to Register' : 'Switch to Login'}
      </button>

      {message && <p>{message}</p>}
    </div>
  );
};

export default Auth;
