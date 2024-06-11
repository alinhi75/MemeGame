import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col, Card, Alert } from 'react-bootstrap';
import { userAPI, gameAPI } from '../../API/api'; // Import your API functions here

const Home = () => {
  const [userList, setUserList] = useState([]);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [registerData, setRegisterData] = useState({ username: '', password: '' });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'danger'
  const [anonymousGameStarted, setAnonymousGameStarted] = useState(false);

 

  const handleLogin = async () => {
    try {
      const { username, password } = loginData;
      const token = await userAPI.login(username, password); // Call the login API function
      console.log('Logged in successfully. Token:', token);
      setMessage('Logged in successfully.');
      setMessageType('success');
      // You can redirect the user to another page or perform other actions upon successful login
    } catch (error) {
      console.error('Login failed:', error);
      setMessage('Login failed. Please check your credentials.');
      setMessageType('danger');
      // Handle login failure, e.g., show an error message to the user
    }
  };



  const handleStartAnonymousGame = async () => {
    try {
      // Start an anonymous game
      await gameAPI.startAnonymousGame();
      setAnonymousGameStarted(true);
      console.log('Anonymous game started successfully.');
      // You can redirect the user to the game page or perform other actions upon successful game start
    } catch (error) {
      console.error('Failed to start anonymous game:', error);
      // Handle game start failure, e.g., show an error message to the user
    }
  };

  return (
    <Container className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '100vh', backgroundColor: '#f7f9fc' }}>
      <h1 className="mb-4" style={{ color: '#007bff' }}>Welcome to the Meme Game!</h1>
      <p className="text-muted mb-4">This is the homepage of our awesome meme game application.</p>

      {message && <Alert variant={messageType} className="w-100 text-center">{message}</Alert>}

      <Row className="w-100 mb-4">
        <Col md={{ span: 6, offset: 3 }} lg={{ span: 4, offset: 4 }}>
          <Card className="p-4 shadow-sm" style={{ borderRadius: '10px' }}>
            <Card.Body>
              <Card.Title className="text-center mb-4" style={{ color: '#007bff' }}>Login</Card.Title>
              <Form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
                <Form.Group controlId="formBasicUsername">
                  <Form.Label>Username</Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="Enter username" 
                    value={loginData.username} 
                    onChange={(e) => setLoginData({ ...loginData, username: e.target.value })} 
                    required 
                  />
                </Form.Group>
                <Form.Group controlId="formBasicPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control 
                    type="password" 
                    placeholder="Enter password" 
                    value={loginData.password} 
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })} 
                    required 
                  />
                </Form.Group>
                <Button variant="primary" type="submit" className="w-100 mt-3">
                  Login
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Button 
        variant="info" 
        onClick={handleStartAnonymousGame} 
        disabled={anonymousGameStarted}
        className="start-game-btn mt-3"
      >
        Start Anonymous Game
        {anonymousGameStarted ? 'Anonymous Game Started' : 'Start Anonymous Game'}
      </Button>
    </Container>
  );
};

export default Home;
