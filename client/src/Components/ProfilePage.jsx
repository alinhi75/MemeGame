import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './CSS/ProfilePage.css';

const ProfilePage = ({ onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const username = location.state?.username || null;
  const [gameHistory, setGameHistory] = useState([]);
  const [error, setError] = useState('');
  const [totalScore, setTotalScore] = useState(0);
  const [userInfo, setUserInfo] = useState(null);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState([]);

  useEffect(() => {
    if (!username) {
      setError('Username is not provided.');
      navigate('/');
      return;
    }

    const fetchUserData = async () => {
      try {
        const [userResponse, gameResponse] = await Promise.all([
          fetch(`http://localhost:3001/api/users/${username}`),
          fetch(`http://localhost:3001/api/users/${username}/games`)
        ]);
        const userData = await userResponse.json();
        const gameData = await gameResponse.json();
        
        setUserInfo(userData);
        setGameHistory(gameData);
        calculateTotalScore(gameData);
      } catch (err) {
        setError('Failed to fetch data. Please try again.');
      }
    };
    fetchUserData();
  }, [username, navigate]);

  const calculateTotalScore = (games) => {
    let total = 0;
    games.forEach(game => {
      total += game.score; // Adjusted to match the data structure
    });
    setTotalScore(total);
  };

  const handleLogout = () => {
    onLogout();
    navigate('/');
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

  const handlePlayGame = () => {
    navigate('/UserGame', { state: { username } });
  };

  return (
    <div className="profile-page-container container">
      {userInfo && (
        <div className="user-info text-center my-4">
          <img src='../../public/ProfilePicture.png' alt="Profile" className="profile-picture img-thumbnail" />
          <h2>Welcome, {userInfo.username}</h2>
          {/* <p>{userInfo.email}</p> */}
        </div>
      )}
      <h3>DASHBOARD</h3>
      <h2>Your Game History</h2>
      {error && <p className="error-message text-danger">{error}</p>}
      <div className="game-history-list">
        {gameHistory.length === 0 ? (
          <p>No games played yet.</p>
        ) : (
          gameHistory.map((game, index) => (
            <div key={index} className="card game-history-item mb-3">
              <div className="card-body">
                <h3 className="card-title">Game {index + 1} - Total Score: {game.score}</h3>
                <p>Caption Selected: {game.caption}</p> {/* Display caption here */}
                {/* <p>Game Date: {new Date(game.game_date).toLocaleString()}</p> */}
              </div>
            </div>
          ))
        )}
      </div>
      <h3>Total Score of All Games: {totalScore}</h3>
      <div className="action-buttons text-center">
        <button className="btn btn-primary m-2" onClick={handlePlayGame}>Play Game</button>
        <button className="btn btn-secondary m-2" onClick={handleLogout}>Logout</button>
        <button className='btn btn-primary m-2' onClick={fetchLeaderboardData}>Leaderboard</button>
        <button className='btn btn-primary m-2' onClick={() => navigate('/')}>Homepage</button>
        {showLeaderboard && (
          <div className="leaderboard-table">
            <h2>Leaderboard</h2>
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>User ID</th>
                  <th>Score</th>
                  <th>Game ID</th>
                </tr>
              </thead>
              <tbody>
                {leaderboardData.map((entry, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{entry.user_id}</td>
                    <td>{entry.score}</td>
                    <td>{entry.game_id}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button className='btn btn-danger m-2' onClick={() => setShowLeaderboard(false)}>Cancel</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;

