import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from './App.jsx'
//import react bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthProvider } from './AuthContext.jsx';

const router = createBrowserRouter([{path: "/*", element:<App/>}]);
ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>,
);
