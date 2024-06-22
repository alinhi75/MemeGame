import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Navbar, Nav, Button, Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './CSS/HomePage.css'; // Import the external CSS file
import { AuthContext } from '../AuthContext';

const HomePage = ({ handleLogout }) => {
  const navigate = useNavigate();
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [username, setUsername] = useState(localStorage.getItem('username') || '');
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');
  const [error, setError] = useState('');

  //Play the game as an anonymous user

  const handleAnonymousPlay = () => {
    navigate('/gameAnonym');
  };

  // Function to handle playing the game as a user if the user is logged in

  const handlePlayGame = () => {
    navigate('/usergame', { state: { username: username } });
  };

  // Fetch leaderboard data from the server

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/leaderboard');
        if (!response.ok) {
          throw new Error('Failed to fetch leaderboard data');
        }
        const data = await response.json();
        setLeaderboardData(data);
      } catch (err) {
        setError('Failed to fetch leaderboard data. Please try again.');
      }
    };

    fetchLeaderboardData();
  }, []);

  // Function to handle logout button when the user is logged in and wants to logout
  //Clear the local storage and set the state to false and clear the session on the server
  
  const handleLogoutClick = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('isLoggedIn');
    setUsername('');
    setIsLoggedIn(false);
    handleLogout(); // Perform logout actions (e.g., clear session on server)
  };

  return (
    <div className="homepage-container">
      {/* Navbar */}
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand>
            <span role="img" aria-label="Game Logo">
              <img src="../../public/What-do-You-Meme.jpg" width={200} height={100} alt="Game Logo" />
            </span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/">Home</Nav.Link>
              {isLoggedIn && <Nav.Link as={Link} to="/profile">Profile</Nav.Link>}
              {isLoggedIn && <p className="text-light mt-2">Welcome, {username}</p>}
            </Nav>
            <Nav>
              {isLoggedIn ? (
                <Button onClick={handleLogoutClick} variant="outline-light">Logout</Button>
              ) : (
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
              )}
              {isLoggedIn ? (
                <Nav.Link onClick={handlePlayGame} as={Link} to="/usergame">Play Game</Nav.Link>
              ) : (
                <Nav.Link as={Link} to="/gameAnonym">Anonymous Game</Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Main Content */}
      <Container className="homepage-main text-center mt-5">
        <h2>Welcome to the Game</h2><br />
        <p className="lead">
          Ready to play? Choose your path below:
        </p>
        <div className="button-group">
          {isLoggedIn ? (<Button as={Link} to="/usergame" variant="primary" className="m-2">Play As User</Button>) : (<Button as={Link} to="/login" variant="primary" className="m-2">Login to Play</Button>)}
          <Button variant="primary" className="m-2" onClick={handleAnonymousPlay}>
            Play As Anonymous
          </Button>
        </div><br />
        <h2>Top Player</h2><br />

        <div className="leaderboard-table">
          <h2>Leaderboard</h2>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Username</th>
                <th>Total Score</th>
              </tr>
            </thead>
            <tbody>
              {leaderboardData.map((entry, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{entry.username}</td>
                  <td>{entry.total_score}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Container>

      {/* Footer */}
      <footer className="homepage-footer text-center mt-5">
        <Container>
          <p>© 2024 Meme Game Inc</p>
          <p>Created By Sayedali Noohi</p>
        </Container>
      </footer>
    </div>
  );
};

export default HomePage;
