import React, { useEffect, useState } from 'react';
import axios from 'axios';
// import './ProfilePage.css'; // Import CSS file for styling
import 'bootstrap/dist/css/bootstrap.min.css';


const ProfilePage = ({ userId }) => {
  const [gameHistory, setGameHistory] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchGameHistory = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/users/${userId}/games`);
        setGameHistory(response.data);
      } catch (err) {
        setError('Failed to fetch game history. Please try again.');
      }
    };
    fetchGameHistory();
  }, [userId]);

  

  return (
    <div className="profile-page-container">
      <h2>Your Game History</h2>
      {error && <p className="error-message">{error}</p>}
      <div className="game-history-list">
        {gameHistory.length === 0 ? (
          <p>No games played yet.</p>
        ) : (
          gameHistory.map((game, index) => (
            <div key={index} className="game-history-item">
              <h3>Game {index + 1} - Total Score: {game.totalScore}</h3>
              <ul>
                {game.rounds.map((round, idx) => (
                  <li key={idx}>
                    <img src={round.memeImage} alt="Meme" className="meme-image" />
                    <p>Selected Caption: {round.selectedCaption}</p>
                    <p>Score: {round.score}</p>
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
