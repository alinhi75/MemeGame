// src/components/Profile.js
import { useEffect, useState } from 'react';
import axios from 'axios';

function Profile() {
  const [profile, setProfile] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/user/profile', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setProfile(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    const fetchHistory = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/user/history', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setHistory(response.data);
      } catch (error) {
        console.error('Error fetching history:', error);
      }
    };

    fetchProfile();
    fetchHistory();
  }, []);

  return (
    <div>
      {profile && (
        <div>
          <h1>{profile.username}</h1>
          <p>Total Games Played: {profile.total_games}</p>
          <p>Total Score: {profile.total_score}</p>
        </div>
      )}
      <h2>Game History</h2>
      <ul>
        {history.map((game) => (
          <li key={game.game_id}>
            Game {game.game_id} - Score: {game.total_score}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Profile;
