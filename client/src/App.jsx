// src/App.js
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Components/LoginForm';
import Game from './Components/Game';
import Profile from './Components/Profile';
import Home from './Components/Home';

function App() {
  return (
    <Router>
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/game" element={<Game />} />
          <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;
