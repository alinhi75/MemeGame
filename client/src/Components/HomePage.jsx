import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Navbar, Nav, Button,Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const HomePage = ({ isLoggedIn }) => {
  const navigate = useNavigate();

  const handleAnonymousPlay = () => {
    navigate('/gameAnonym');
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
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Username</th>
              <th>Total Score</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>John Doe</td>
              <td>100</td>
            </tr>
            <tr>
              <td>2</td>
              <td>Jane Doe</td>
              <td>95</td>
            </tr>
            <tr>
              <td>3</td>
              <td>Anonymous</td>
              <td>90</td>
            </tr>
            <tr>
              <td>4</td>
              <td>Anonymous</td>
              <td>85</td>
            </tr>
            <tr>
              <td>5</td>
              <td>Anonymous</td>
              <td>80</td>
            </tr>
            
            
          </tbody>
        </Table>
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
