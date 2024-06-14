import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// import './LoginPage.css'; // Import CSS file for styling
import { userAPI,gameAPI,adminAPI } from '../../API/api';
import 'bootstrap/dist/css/bootstrap.min.css';


const LoginPage = ({ setIsLoggedIn }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Handle login form submission
  const handleLogin = async (e) => {
    e.preventDefault();
    let response = { data: null }; // Default value to prevent undefined access
    try {
      response = await userAPI.login(username, password);
      // response = await axios.post('http://localhost:3000/api/login', { username, password }) || { data: null };
      if (response.data && response.data.userId) {
        setIsLoggedIn(response.data.userId);
        navigate('/profile');
      } else {
        setError('Login failed. Please try again.');
      }
    } catch (error) {
      console.error("Login error:", error); // More detailed error logging
      setError('An error occurred during login. Please try again.');
    }
  };
  const handleLogout

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
