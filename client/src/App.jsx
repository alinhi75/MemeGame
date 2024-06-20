import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './Components/HomePage';
import LoginPage from './Components/LoginPage';
import ProfilePage from './Components/ProfilePage';
import GamePageAnonym from './Components/GamePageAnonym';
import NotFoundPage from './Components/NotFound';
import UserGame from './Components/UserGame';
import { AuthProvider } from './Components/AuthComponent';

const App = () => {
  const [username, setUsername] = useState(localStorage.getItem('username') || '');
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');

  const handleLogin = (username) => {
    setIsLoggedIn(true);
    setUsername(username);
    localStorage.setItem('username', username);
    localStorage.setItem('isLoggedIn', true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.setItem('isLoggedIn', false);
  };

  return (
    <AuthProvider>
      <>
        <Routes>
          <Route path="/" element={<HomePage isLoggedIn={isLoggedIn} handleLogout={handleLogout} />} />
          <Route path="/login" element={<LoginPage setIsLoggedIn={handleLogin} />} />
          <Route path="/profile" element={<ProfilePage isLoggedIn={isLoggedIn} handleLogout={handleLogout} />} />
          <Route path="/gameAnonym" element={<GamePageAnonym />} />
          <Route path="/*" element={<NotFoundPage />} />
          <Route path="/usergame" element={<UserGame />} />
        </Routes>
      </>
    </AuthProvider>
  );
};

export default App;

