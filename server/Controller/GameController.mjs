import { Game, GameRound } from '../Models/game.js';
import Meme from '../Models/meme.js';
import Caption from '../models/caption.js';
import User from 'Models/User.js';

// Start a new game for a logged-in user
const startGame = async(req, res) => {
    try {
        const game = await Game.create({ userId: req.user.id, score: 0 });
        res.json(game);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Get a random meme and 7 random captions, including 2 best-matching captions
const getNextRound = async(req, res) => {
    try {
        // Ensure the game exists and belongs to the user
        const game = await Game.findOne({ where: { id: req.params.gameId, userId: req.user.id } });
        if (!game) {
            return res.status(404).json({ message: 'Game not found' });
        }

        // Fetch a random meme that hasn't been used in the current game
        const usedMemeIds = await GameRound.findAll({
            where: { gameId: game.id },
            attributes: ['memeId']
        }).map(round => round.memeId);

        const meme = await Meme.findOne({
            where: {
                id: {
                    [Op.notIn]: usedMemeIds
                }
            },
            order: sequelize.random()
        });

        if (!meme) {
            return res.status(404).json({ message: 'No more memes available' });
        }

        // Fetch 7 random captions including 2 best-matching captions
        const bestCaptions = await Caption.findAll({
            where: {
                memeId: meme.id
            },
            limit: 2
        });

        const otherCaptions = await Caption.findAll({
            where: {
                id: {
                    [Op.notIn]: bestCaptions.map(c => c.id)
                }
            },
            limit: 5,
            order: sequelize.random()
        });

        const captions = [...bestCaptions, ...otherCaptions].sort(() => 0.5 - Math.random());

        res.json({ meme, captions });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Submit a selected caption for the current round
const submitRound = async(req, res) => {
    try {
        const { gameId, memeId, selectedCaptionId } = req.body;

        // Ensure the game exists and belongs to the user
        const game = await Game.findOne({ where: { id: gameId, userId: req.user.id } });
        if (!game) {
            return res.status(404).json({ message: 'Game not found' });
        }

        // Fetch the meme and selected caption
        const meme = await Meme.findByPk(memeId);
        const selectedCaption = await Caption.findByPk(selectedCaptionId);

        if (!meme || !selectedCaption) {
            return res.status(404).json({ message: 'Meme or Caption not found' });
        }

        // Determine if the selected caption is one of the best-matching captions
        const isCorrect = await Caption.findOne({
            where: {
                memeId: meme.id,
                id: selectedCaptionId
            }
        }) !== null;

        // Create a new game round
        await GameRound.create({
            gameId: game.id,
            memeId: meme.id,
            selectedCaptionId: selectedCaption.id,
            isCorrect
        });

        if (isCorrect) {
            game.score += 5;
            await game.save();
        }

        res.json({ isCorrect });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// End the game and provide a summary of the results
const endGame = async(req, res) => {
    try {
        const { gameId } = req.params;

        // Ensure the game exists and belongs to the user
        const game = await Game.findOne({
            where: { id: gameId, userId: req.user.id },
            include: [{
                model: GameRound,
                include: [Meme, Caption]
            }]
        });

        if (!game) {
            return res.status(404).json({ message: 'Game not found' });
        }

        const summary = game.GameRounds.map(round => ({
            meme: round.Meme.imageUrl,
            selectedCaption: round.Caption.text,
            isCorrect: round.isCorrect
        }));

        res.json({
            score: game.score,
            summary
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

export { startGame, getNextRound, submitRound, endGame };