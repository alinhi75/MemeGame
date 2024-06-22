import React, { useEffect, useContext, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './CSS/ProfilePage.css';
import { AuthContext } from '../AuthContext';

const ProfilePage = ({isLoggedIn,handleLogout}) => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const username = location.state?.username || localStorage.getItem('username');
  const [gameHistory, setGameHistory] = useState([]);
  const [error, setError] = useState('');
  const [totalScore, setTotalScore] = useState(0);
  const [userInfo, setUserInfo] = useState(null);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(1);
 
  // check if user is logged in or not

  useEffect(() => {
    if (!username) {
      setError('Username is not provided.');
      navigate('/');
      return;
    }
    // Fetch user data and game history

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

  // Function to calculate total score of all games
  const calculateTotalScore = (games) => {
    let total = 0;
    games.forEach(game => {
      total += game.score;
    });
    setTotalScore(total);
  };
  // Function to handle logout

  const handleLogoutClick = () => {
    handleLogout();
    navigate('/');
  };
  // handle login Error

  if (!username) {
    return <p>Loading...</p>;
  }

  // Function to fetch leaderboard data

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

  // Function to handle play game

  const handlePlayGame = () => {
    navigate('/UserGame', { state: { username } });
  };
  
  // Pagination logic
  
  const totalPages = Math.ceil(gameHistory.length / itemsPerPage);

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  const goToNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const goToPreviousPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const indexOfLastGame = currentPage * itemsPerPage;
  const indexOfFirstGame = indexOfLastGame - itemsPerPage;
  const currentGames = gameHistory.slice(indexOfFirstGame, indexOfLastGame);

  return (
    <div className="profile-page-container container">
      {userInfo && (
        <div className="user-info text-center my-4">
          <img src='../../public/ProfilePicture.png' alt="Profile" className="profile-picture img-thumbnail" />
          <h2>Welcome, {userInfo.username}</h2>
        </div>
      )}
      <h3>DASHBOARD</h3>
      <h2>Your Game History</h2>
      {error && <p className="error-message text-danger">{error}</p>}
      <div className="game-history-list">
        {currentGames.length === 0 ? (
          <p>No games played yet.</p>
        ) : (
          currentGames.map((game, index) => (
            <div key={index} className="card game-history-item mb-3">
              <div className="card-body">
                <h3 className="card-title">Game {indexOfFirstGame + index + 1} - Total Score: {game.score}</h3>
                <p>Round: {game.round}</p>
                <img id='meme_image' src={game.image_path} alt="Game" className="game-image img-thumbnail" /><br /><br />
                <p className={`caption-selected ${game.score === 0 ? 'incorrect' : ''}`}>Caption Selected: {game.caption}</p>
                {game.score === 0 && <p id='correct_selected'>Correct Caption: {game.rightcaption}</p>}
              </div>
            </div>
          ))
        )}
      </div>
      <div className="pagination-buttons text-center mt-3">
        <nav aria-label="Page navigation example">
          <ul className="pagination justify-content-center">
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => goToPreviousPage()} tabIndex="-1" aria-disabled="true">Previous</button>
            </li>
            {Array.from({ length: totalPages }, (_, index) => (
              <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                <button className="page-link" onClick={() => goToPage(index + 1)}>{index + 1}</button>
              </li>
            ))}
            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => goToNextPage()}>Next</button>
            </li>
          </ul>
        </nav>
      </div>
      <h3>Total Score of All Games: {totalScore}</h3>
      <div className="action-buttons text-center">
        <button className="btn btn-primary m-2" onClick={handlePlayGame}>Play Game</button>
        <button className="btn btn-secondary m-2" onClick={handleLogoutClick}>Logout</button>
        <button className='btn btn-primary m-2' onClick={fetchLeaderboardData}>Leaderboard</button>
        <button className='btn btn-primary m-2' onClick={() => navigate('/')}>Homepage</button>
        {showLeaderboard && (
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
            <button className='btn btn-danger m-2' onClick={() => setShowLeaderboard(false)}>Cancel</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;

