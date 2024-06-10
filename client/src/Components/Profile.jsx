import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Profile() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user data from the server upon component mount
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/user-data', {
          withCredentials: true
        });
        setUserData(response.data);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div>
      <h2>User Profile</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        userData ? (
          <div>
            <p>Username: {userData.username}</p>
            <p>Email: {userData.email}</p>
            {/* Add more user data fields as needed */}
          </div>
        ) : (
          <p>No user data found.</p>
        )
      )}
    </div>
  );
}

export default Profile;
