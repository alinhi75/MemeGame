import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate,Outlet} from 'react-router-dom';
import HomePage from './Components/HomePage';
import LoginPage from './Components/LoginPage';
import ProfilePage from './Components/ProfilePage';
import GamePageAnonym from './Components/GamePageAnonym';
import NotFoundPage from './Components/NotFound';
import { Container, Navbar } from 'react-bootstrap';
import { userAPI,adminAPI,gameAPI } from '../API/api';
import UserGame from './Components/UserGame';

const App = () => {
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState(localStorage.getItem('username') || '');

  const handleLogin = (username) => {
    setIsLoggedIn(true);
    setUsername(username);
    localStorage.setItem('username', username); // Store the username in localStorage
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    localStorage.removeItem('token');
    localStorage.removeItem('username');
  };

  return (
    
          
          <Routes>
          <Route path="/" element={<HomePage setIsLoggedIn={isLoggedIn} />} />
          <Route path="/login" element={<LoginPage setIsLoggedIn={handleLogin} />} />
          <Route path="/profile" element={<ProfilePage onLogout={() => setIsLoggedIn(false)} />} />
          <Route path='/gameAnonym' element={<GamePageAnonym/>}/>
          <Route path="/*" element = {<NotFoundPage/>} />
          <Route path='/usergame' element={<UserGame/>}/>
          {/* <Route path='/result' element={<GamePage/>}/> */}
          </Routes>
        
    
  );
};

export default App;
