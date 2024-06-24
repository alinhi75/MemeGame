import React from 'react';
import { Route, Navigate } from 'react-router-dom';

const PrivateRoute = ({ element: Component, ...rest }) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'; // Check if logged in

  return (
    <Route
      {...rest}
      element={isLoggedIn ? <Component /> : <Navigate to="/login" replace />}
    />
  );
};

export default PrivateRoute;
