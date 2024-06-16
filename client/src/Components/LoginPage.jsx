import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
// import loginIllustration from '../../assets/login-illustration.svg'; // Replace with your actual image path

const LoginPage = ({ setIsLoggedIn }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/api/login', {
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
    <Container className="login-page-container">
      <Row className="justify-content-md-center">
        <Col md={6}>
          <div className="text-center mb-4">
            {/* <img src={loginIllustration} alt="Login Illustration" className="img-fluid" style={{ maxHeight: '200px' }} /> */}
          </div>
          <h2 className="text-center">Login</h2>
          <Form onSubmit={handleLogin} className="mt-4">
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
            <Form.Group controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </Form.Group>
            {error && <Alert variant="danger">{error}</Alert>}
            <Button variant="primary" type="submit" className="mr-2">
              Login
            </Button>
            <Button variant="secondary" onClick={() => navigate('/')} className="ml-2">
              Home
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;
