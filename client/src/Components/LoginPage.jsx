import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userAPI,gameAPI,adminAPI } from '../../API/api';
import 'bootstrap/dist/css/bootstrap.min.css';


const LoginPage = ({ setIsLoggedIn }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();


  const handleLogin = async (e) => {
    e.preventDefault();
    let response;
    try {
        response = await fetch('http://localhost:3001/api/login', { 
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        
        if (response.ok) {
            const data = await response.json();
            if (data.token) {
                localStorage.setItem('token', data.token);
                setIsLoggedIn(true);
                navigate('/profile');
            } else if (data.message) {
                setError(data.message);
            } else {
                setError('An error occurred. Please try again later.');
            }
        } else {
            setError('An error occurred. Please try again later.');
        }
    } catch (err) {
        console.error(err);
        setError('An error occurred. Please try again later.');
    }
};


  return (
    <div className="login-page-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin} className="login-form">
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="btn btn-primary" onSubmit={handleLogin}>Login</button>
        {/* // Home button */}
        <button type="submit" className="btn btn-primary" onClick={()=>navigate('/')}>Home</button>
      </form>
    </div>
  );
};

export default LoginPage;
