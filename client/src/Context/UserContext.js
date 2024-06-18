import React, { createContext, useState } from 'react';

// Create a UserContext
export const UserContext = createContext();

// Create a UserContextProvider component
export const UserContextProvider = ({ children }) => {
    // State to hold the logged-in user details
    const [user, setUser] = useState(null); // Initialize with null or default user state

    // Function to set the logged-in user
    const loginUser = (userData) => {
        setUser(userData);
    };

    // Function to log out the user
    const logoutUser = () => {
        setUser(null);
    };

    // Value object to be passed to the Provider component
    const userContextValue = {
        user,
        loginUser,
        logoutUser,
    };

    // Return the UserContext.Provider with its value and children
    return ( <
        UserContext.Provider value = { userContextValue } > { children } <
        /UserContext.Provider>
    );
};