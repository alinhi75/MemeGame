import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (username, password) => {
    try {
      const response = await fetch('http://localhost:3001/api/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
        credentials: 'include', // Send cookies with the request
      });

      if (response.ok) {
        const user = await response.json();
        setUser(user);
      } else {
        console.error('Login failed');
        // Handle error or set error state
      }
    } catch (error) {
      console.error('Login failed:', error);
      // Handle fetch error or set error state
    }
  };

  const logout = async () => {
    try {
      await fetch('http://localhost:3001/api/sessions', {
        method: 'DELETE',
        credentials: 'include', // Send cookies with the request
      });
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
      // Handle fetch error or set error state
    }
  };

  const checkAuth = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/sessions', {
        credentials: 'include', // Send cookies with the request
      });

      if (response.ok) {
        const user = await response.json();
        setUser(user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Check auth failed:', error);
      setUser(null);
      // Handle fetch error or set error state
    }
  };

  useEffect(() => {
    checkAuth(); // Check authentication status when component mounts
  }, []);

  // Provide the user object and functions to the context
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
