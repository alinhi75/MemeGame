import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={LoginPage} />
        <Route path="/login" component={LoginPage} />
        <PrivateRoute path="/home" component={HomePage} />
        <PrivateRoute path="/profile" component={ProfilePage} />
        <Route component={NotFoundPage} />
      </Switch>
    </Router>
  );
}

export default App;
