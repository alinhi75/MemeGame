// import React from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// // import './HomePage.css'; // Import CSS file for styling

// const HomePage = ({ isLoggedIn }) => {
//   const navigate = useNavigate();

//   const handleAnonymousPlay = () => {
//     navigate('/game');
//   };

//   return (
//     <div className="homepage-container">
//       <header className="homepage-header">
//         <div className="logo">🖼️</div>
//         <h1>What Do You Meme?</h1>
//         <nav>
//           <Link to="/">Home</Link>
//           {isLoggedIn && <Link to="/profile">Profile</Link>}
//           {isLoggedIn ? (
//             <Link to="/logout">Logout</Link>
//           ) : (
//             <Link to="/login">Login</Link>
//           )}
//         </nav>
//       </header>
//       <main className="homepage-main">
//         <h2>Welcome to the Game</h2>
//         <div className="button-group">
//           <Link to="/login" className="btn btn-primary">
//             Login to Play
//           </Link>
//           link button to the game page
          
//           {/* porvide button which navigate to gamepage */}
//             <button className="btn btn-primary" onClick={handleAnonymousPlay}>
//                 Play as Anonymous
//             </button>
//         </div>
//       </main>
//       <footer className="homepage-footer">
//         © 2024 Meme Game Inc. | <Link to="/privacy-policy">Privacy Policy</Link>
//       </footer>
//     </div>
//   );
// };

// export default HomePage;


import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Navbar, Nav, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const HomePage = ({ isLoggedIn }) => {
  const navigate = useNavigate();

  const handleAnonymousPlay = () => {
    navigate('/game');
  };

  return (
    <div className="homepage-container">
      {/* Navbar */}
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand>
            
            <span role="img" aria-label="Game Logo">
              <img src="../../public/What-do-You-Meme.jpg" width={200} height={100} alt="Game Logo" />
              </span> What Do You Meme?
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
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Main Content */}
      <Container className="homepage-main text-center mt-5">
        <h2>Welcome to the Game</h2>
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
        </div>
      </Container>

      {/* Footer */}
      <footer className="homepage-footer text-center mt-5">
        <Container>
          <p>© 2024 Meme Game Inc. | <Link to="/privacy-policy">Privacy Policy</Link></p>
        </Container>
      </footer>
    </div>
  );
};

export default HomePage;
