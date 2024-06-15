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
            const response = await api.post('login', { username, password });
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
            if (!response) {
                throw new Error('No response from server');
            }
            return response.data;
        } catch (error) {
            throw error.response ? data ? message : 'An error occurred while fetching user list.' : 'An error occurred while fetching user list.';
        }
    },
    // Add other user-related API calls here
};

// Game API endpoints
const gameAPI = {
    startAnonymousGame: async(token) => {
        try {
            const response = await api.get('/game/start', { headers: { Authorization: `Bearer ${token}` } });
            if (!response) {
                throw new Error('No response from server');
            }
            return response.data;
        } catch (error) {
            throw error.response.data.message || 'An error occurred while starting the game.';
        }
    },
    getMeme: async(memeId) => {
        try {
            const response = await api.get(`/meme/${memeId}`);
            return response.data;
        } catch (error) {
            throw error.response.data.message || 'An error occurred while fetching the meme data.';
        }
    },
    getGameResult: async(gameId, token) => {
        try {
            const response = await api.get(`/game/${gameId}/result`, { headers: { Authorization: `Bearer ${token}` } });
            return response.data;
        } catch (error) {
            throw error.response.data.message || 'An error occurred while fetching the game result.';
        }
    },
    submitRound: async(gameId, roundNumber, selectedCaption, token) => {
        try {
            const response = await api.post(`/game/${gameId}/round/${roundNumber}/submit`, { selectedCaption }, { headers: { Authorization: `Bearer ${token}` } });
            return response.data;
        } catch (error) {
            throw error.response.data.message || 'An error occurred while submitting the round.';
        }
    },
    getRound: async(gameId, roundNumber) => {
        try {
            const response = await api.get(`/game/${gameId}/round/${roundNumber}`);
            return response.data;
        } catch (error) {
            throw error.response.data.message || 'An error occurred while fetching the round data.';
        }
    },
    startRegisteredGame: async(token) => {
        try {
            const response = await api.get('/game/start', { headers: { Authorization: `Bearer ${token}` } });
            return response.data;
        } catch (error) {
            throw error.response.data.message || 'An error occurred while starting the game.';
        }
    },
    getCaption: async() => {
        try {
            const response = await api.get('/caption');
            return response.data;
        } catch (error) {
            throw error.response.data.message || 'An error occurred while fetching captions.';
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