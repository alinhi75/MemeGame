import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

const api = axios.create({
    baseURL: API_URL,
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// User API endpoints
const userAPI = {
    login: async(username, password) => {
        try {
            const response = await api.post('/user/login', { username, password });
            return response.data;
        } catch (error) {
            throw error.response.data.message || 'An error occurred during login.';
        }
    },
    logout: async(token) => {
        try {
            const response = await api.post('/user/logout', {}, { headers: { Authorization: `Bearer ${token}` } });
            return response.data;
        } catch (error) {
            throw error.response.data.message || 'An error occurred during logout.';
        }
    },
    getUserList: async() => {
        try {
            const response = await api.get('/user');
            return response.data;
        } catch (error) {
            throw error.response.data.message || 'An error occurred while fetching user list.';
        }
    },
    // Add other user-related API calls here
};

// Game API endpoints
const gameAPI = {
    startGame: async(token) => {
        try {
            const response = await api.get('/game/start', { headers: { Authorization: `Bearer ${token}` } });
            return response.data;
        } catch (error) {
            throw error.response.data.message || 'An error occurred while starting the game.';
        }
    },
    // Add other game-related API calls here
};

// Admin API endpoints
const adminAPI = {
    getAllMemes: async(adminToken) => {
        try {
            const response = await api.get('/admin/memes', { headers: { Authorization: `Bearer ${adminToken}` } });
            return response.data;
        } catch (error) {
            throw error.response.data.message || 'An error occurred while fetching memes.';
        }
    },
    // Add other admin-related API calls here
};

export { userAPI, gameAPI, adminAPI };