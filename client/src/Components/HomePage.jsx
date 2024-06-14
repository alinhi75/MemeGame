import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
// import './HomePage.css'; // Import CSS file for styling

const HomePage = ({ isLoggedIn }) => {
  const navigate = useNavigate();

  const handleAnonymousPlay = () => {
    navigate('/game');
  };

  return (
    <div className="homepage-container">
      <header className="homepage-header">
        <div className="logo">🖼️</div>
        <h1>What Do You Meme?</h1>
        <nav>
          <Link to="/">Home</Link>
          {isLoggedIn && <Link to="/profile">Profile</Link>}
          {isLoggedIn ? (
            <Link to="/logout">Logout</Link>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </nav>
      </header>
      <main className="homepage-main">
        <h2>Welcome to the Game</h2>
        <div className="button-group">
          <Link to="/login" className="btn btn-primary">
            Login to Play
          </Link>
          link button to the game page
          
          {/* porvide button which navigate to gamepage */}
            <button className="btn btn-primary" onClick={handleAnonymousPlay}>
                Play as Anonymous
            </button>
        </div>
      </main>
      <footer className="homepage-footer">
        © 2024 Meme Game Inc. | <Link to="/privacy-policy">Privacy Policy</Link>
      </footer>
    </div>
  );
};

export default HomePage;
