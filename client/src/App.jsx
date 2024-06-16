import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate,Outlet} from 'react-router-dom';
import HomePage from './Components/HomePage';
import LoginPage from './Components/LoginPage';
import ProfilePage from './Components/ProfilePage';
import GamePage from './Components/GamePage';
import NotFoundPage from './Components/NotFound';
// import {useHistory,useNavigate} from 'react-router-dom';
// import { Container, Row, Alert } from 'react-bootstrap';
import { Container, Navbar } from 'react-bootstrap';
import { userAPI,adminAPI,gameAPI } from '../API/api';
// import './App.css'; // Import CSS file for styling

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);

  const handleLogin = (userId) => {
    setIsLoggedIn(true);
    setUserId(userId);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserId(null);
  };

  return (
    
          
          <Routes>
          <Route path="/" element={<HomePage isLoggedIn={isLoggedIn} />} />
          <Route path="/login" element={<LoginPage setIsLoggedIn={handleLogin} />} />
          <Route path="/profile" element={isLoggedIn ? <ProfilePage userId={userId} /> : <Navigate to="/login" />} />
          <Route path='/game' element={<GamePage/>}/>
          <Route path="/*" element = {<NotFoundPage/>} />
          <Route path='/result' element={<GamePage/>}/>
          </Routes>
        
    
  );
};

export default App;
