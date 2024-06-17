import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ProfilePage.css'; // Assuming you have a CSS file for custom styles

const ProfilePage = ({ userId }) => {
  const [gameHistory, setGameHistory] = useState([]);
  const [error, setError] = useState('');
  const [logout, setLogout] = useState(false);
  const [playGame, setPlayGame] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const [userResponse, gameResponse] = await Promise.all([
          axios.get(`http://localhost:3001/api/users/${userId}`),
          axios.get(`http://localhost:3001/api/users/${userId}/games`)
        ]);
        setUserInfo(userResponse.data);
        setGameHistory(gameResponse.data);
        calculateTotalScore(gameResponse.data);
      } catch (err) {
        setError('Failed to fetch data. Please try again.');
      }
    };
    fetchUserData();
  }, [userId]);

  const calculateTotalScore = (games) => {
    let total = 0;
    games.forEach(game => {
      total += game.totalScore;
    });
    setTotalScore(total);
  };

  const handleLogout = () => {
    setLogout(true);
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const handlePlayGame = () => {
    setPlayGame(true);
    window.location.href = '/game';
  };

  return (
    <div className="profile-page-container container">
      {userInfo && (
        <div className="user-info text-center my-4">
          <img src={userInfo.profilePicture} alt="Profile" className="profile-picture img-thumbnail" />
          <h2>{userInfo.name}</h2>
          <p>{userInfo.email}</p>
        </div>
      )}
      <h2>Your Game History</h2>
      {error && <p className="error-message text-danger">{error}</p>}
      <div className="game-history-list">
        {gameHistory.length === 0 ? (
          <p>No games played yet.</p>
        ) : (
          gameHistory.map((game, index) => (
            <div key={index} className="card game-history-item mb-3">
              <div className="card-body">
                <h3 className="card-title">Game {index + 1} - Total Score: {game.totalScore}</h3>
                <ul className="list-group list-group-flush">
                  {game.rounds.map((round, idx) => (
                    <li key={idx} className="list-group-item">
                      <img src={round.memeImage} alt="Meme" className="meme-image img-thumbnail" />
                      <p>Selected Caption: {round.selectedCaption}</p>
                      <p>Score: {round.score}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))
        )}
      </div>
      <h3>Total Score of All Games: {totalScore}</h3>
      <div className="action-buttons text-center">
        <button className="btn btn-primary m-2" onClick={handlePlayGame}>Play Game</button>
        <button className="btn btn-secondary m-2" onClick={handleLogout}>Logout</button>
        <button className='btn btn-primary m-2' onClick={() => window.location.href = '/leaderboard'}>Leaderboard</button>
        <button className='btn btn-primary m-2' onClick={() => window.location.href = '/'}>Homepage</button>
      </div>
    </div>
  );
};

export default ProfilePage;
