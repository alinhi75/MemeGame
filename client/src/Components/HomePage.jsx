import React,{useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Navbar, Nav, Button,Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const HomePage = ({ isLoggedIn }) => {
  const navigate = useNavigate();
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState([]);

  const handleAnonymousPlay = () => {
    navigate('/gameAnonym');
  };
  const fetchLeaderboardData = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/leaderboard');
      if (!response.ok) {
        throw new Error('Failed to fetch leaderboard data');
      }
      const data = await response.json();
      setLeaderboardData(data);
      setShowLeaderboard(true);
    } catch (err) {
      setError('Failed to fetch leaderboard data. Please try again.');
    }
  };
  fetchLeaderboardData();

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
            </Nav>
            <Nav>
              {isLoggedIn ? (
                <Nav.Link as={Link} to="/logout">Logout</Nav.Link>
              ) : (
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
              )}
              <Nav.Link as={Link} to="/gameAnonym">Play Game</Nav.Link>
              {/* <Nav.Link as={Link} to="/leaderboard">Leaderboard</Nav.Link> */}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Main Content */}
      <Container className="homepage-main text-center mt-5">
        <h2>Welcome to the Game</h2><br/>
        <p className="lead">
          Ready to play? Choose your path below:
        </p>
        <div className="button-group">
          <Button as={Link} to="/login" variant="primary" className="m-2">
            Login to Play
          </Button>
          <Button variant="primary" className="m-2" onClick={handleAnonymousPlay}>
            Play as Anonymous
          </Button>
        </div><br/>
        <h2>Top Player</h2><br/>
        
          <div className="leaderboard-table">
            <h2>Leaderboard</h2>
            <table className="table">
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
            </table>
            {/* <button className='btn btn-danger m-2' onClick={() => setShowLeaderboard(false)}>Cancel</button> */}
          </div>
        
      </Container>

      {/* Footer */}
      <footer className="homepage-footer text-center mt-5">
        <Container>
          <p>© 2024 Meme Game Inc</p>
        </Container>
      </footer>
    </div>
  );
};

export default HomePage;
