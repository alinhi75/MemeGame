import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Alert, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [IsLoggedIn,setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Function to handle login and create a session for the user

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/api/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
        credentials: 'include', // Include credentials to allow session cookies
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }
  
      const data = await response.json();
  
      // Store authentication state in localStorage
      localStorage.setItem('isLoggedIn', true); // Store as boolean true
      localStorage.setItem('username', data.username);
  
      // Propagate isLoggedIn state to App.js
      setIsLoggedIn(true);
  
      // Navigate to the profile page with state
      navigate('/profile', { state: { username: data.username } });
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'An error occurred. Please try again later.');
    }
  };
  

  return (
    <div className="login-page">
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <Row className="w-100">
          <Col md={{ span: 6, offset: 3 }}>
            <Card className="p-4 shadow-lg">
              <h2 className="text-center mb-4">Welcome Back!</h2>
              <Form onSubmit={handleLogin}>
                <Form.Group controlId="username">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    required
                  />
                </Form.Group>
                <Form.Group controlId="password" className="mt-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                  />
                </Form.Group>
                {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
                <Button variant="primary" type="submit" className="w-100 mt-4">
                  Login
                </Button>
                <Button variant="secondary" onClick={() => navigate('/')} className="w-100 mt-2">
                  Home
                </Button>
                <Button variant="secondary" onClick={() => navigate('/gameAnonym')} className="w-100 mt-2">
                  Play As a Guest
                </Button>
              </Form>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default LoginPage;

