import Game from '../models/game.js';
import GameRound from '../models/game-round.js';

// Create a new game
const createGame = async(userId) => {
    try {
        const game = await Game.create({ userId, score: 0 });
        return game;
    } catch (error) {
        console.error('Error creating game:', error);
        throw error;
    }
};

// Find a game by ID
const findGameById = async(gameId) => {
    try {
        const game = await Game.findByPk(gameId);
        return game;
    } catch (error) {
        console.error('Error finding game by ID:', error);
        throw error;
    }
};

// Find games by user ID
const findGamesByUserId = async(userId) => {
    try {
        const games = await Game.findAll({ where: { userId } });
        return games;
    } catch (error) {
        console.error('Error finding games by user ID:', error);
        throw error;
    }
};

// Update game score
const updateGameScore = async(gameId, score) => {
    try {
        const game = await Game.findByPk(gameId);
        if (game) {
            game.score = score;
            await game.save();
        }
        return game;
    } catch (error) {
        console.error('Error updating game score:', error);
        throw error;
    }
};

// Create a new game round
const createGameRound = async(gameId, memeId, selectedCaptionId, isCorrect) => {
    try {
        const gameRound = await GameRound.create({
            gameId,
            memeId,
            selectedCaptionId,
            isCorrect,
        });
        return gameRound;
    } catch (error) {
        console.error('Error creating game round:', error);
        throw error;
    }
};

// Find game rounds by game ID
const findGameRoundsByGameId = async(gameId) => {
    try {
        const gameRounds = await GameRound.findAll({ where: { gameId } });
        return gameRounds;
    } catch (error) {
        console.error('Error finding game rounds by game ID:', error);
        throw error;
    }
};

export {
    createGame,
    findGameById,
    findGamesByUserId,
    updateGameScore,
    createGameRound,
    findGameRoundsByGameId,
};