// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// // import './ProfilePage.css'; // Import CSS file for styling
// import 'bootstrap/dist/css/bootstrap.min.css';


// const ProfilePage = ({ userId }) => {
//   const [gameHistory, setGameHistory] = useState([]);
//   const [error, setError] = useState('');
//   const [round, setRound] = useState(1);
//   const [score, setScore] = useState(0);
//   const [message, setMessage] = useState('');
//   const [timer, setTimer] = useState(30); // Timer in seconds
//   const [logout, setLogout] = useState(false);
//   const [playgame,setPlayGame] = useState(false);

//   useEffect(() => {
//     const fetchGameHistory = async () => {
//       try {
//         const response = await axios.get(`http://localhost:3001/api/users/${userId}/games`);
//         setGameHistory(response.data);
//       } catch (err) {
//         setError('Failed to fetch game history. Please try again.');
//       }
//     };
//     fetchGameHistory();
//   }, [userId]);

//   const handleLogout = () => {
//     setLogout(true);
//     navigator.navigate('/login');
//   };
//   const handlePlayGame = () => {
//     setPlayGame(true);
//     navigator.navigate('/game');
//   };
  

  

//   return (
//     <div className="profile-page-container">
//       <h2>Your Game History</h2>
//       {error && <p className="error-message">{error}</p>}
//       <div className="game-history-list">
//         {gameHistory.length === 0 ? (
//           <p>No games played yet.</p>
//         ) : (
//           gameHistory.map((game, index) => (
//             <div key={index} className="game-history-item">
//               <h3>Game {index + 1} - Total Score: {game.totalScore}</h3>
//               <ul>
//                 {game.rounds.map((round, idx) => (
//                   <li key={idx}>
//                     <img src={round.memeImage} alt="Meme" className="meme-image" />
//                     <p>Selected Caption: {round.selectedCaption}</p>
//                     <p>Score: {round.score}</p>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           ))
//         )}
//       </div>
//       <button onClick={handleLogout}>Logout</button>
//       <button onClick={handlePlayGame}>Play Game</button>
//       {/* <button onClick={handleViewResult}>View Result</button> */}

//     </div>
//   );
// };

// export default ProfilePage;


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const ProfilePage = ({ userId }) => {
  const [gameHistory, setGameHistory] = useState([]);
  const [error, setError] = useState('');
  const [logout, setLogout] = useState(false);
  const [playGame, setPlayGame] = useState(false);
  const [totalScore, setTotalScore] = useState(0);

  useEffect(() => {
    const fetchGameHistory = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/users/${userId}/games`);
        setGameHistory(response.data);
        calculateTotalScore(response.data);
      } catch (err) {
        setError('Failed to fetch game history. Please try again.');
      }
    };
    fetchGameHistory();
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
      <h2>Your Game History</h2>
      {error && <p className="error-message text-danger">{error}</p>}
      <div className="game-history-list">
        {gameHistory.length === 0 ? (
          <p>No games played yet.</p>
        ) : (
          gameHistory.map((game, index) => (
            <div key={index} className="game-history-item mb-3">
              <h3>Game {index + 1} - Total Score: {game.totalScore}</h3>
              <ul className="list-group">
                {game.rounds.map((round, idx) => (
                  <li key={idx} className="list-group-item">
                    <img src={round.memeImage} alt="Meme" className="meme-image img-thumbnail" />
                    <p>Selected Caption: {round.selectedCaption}</p>
                    <p>Score: {round.score}</p>
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </div>
      <h3>Total Score of All Games: {totalScore}</h3>
      <button className="btn btn-primary" onClick={handlePlayGame}>Play Game</button>
      <button className="btn btn-secondary" onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default ProfilePage;
