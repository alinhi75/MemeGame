import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import session from 'express-session';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local'
import { Sequelize, DataTypes } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import { login, logout } from './user-dao.mjs';
import bycrypt from 'bcrypt';
import { getMemeById, getAllMemes, createMeme, updateMeme, getRandomMeme } from './Meme-dao.mjs';
import gameDao from './Meme-dao.mjs';
import CaptionDao from './Caption-dao.mjs';
import UserDao from './user-dao.mjs';


const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

// Passport setup based on user-data.js
passport.use(new LocalStrategy(async(username, password, done) => {
    try {
        const token = await login(username, password);
        return done(null, token);
    } catch (error) {
        return done(null, false, { message: error.message });
    }
}));

passport.serializeUser((token, done) => {
    done(null, token);
});

passport.deserializeUser(async(token, done) => {
    try {
        const user = await logout(token);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});




// login based on user-dao.js and api.js    
app.post('/api/login', async(req, res) => {
    const { username, password } = req.body;
    try {
        const token = await UserDao.login(username, password);
        res.json({ token });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


app.post('/api/logout', async(req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ message: 'Not authenticated' });
    }
    await req.user.update({ token: null });
    req.logout();
    res.json({ message: 'Logged out successfully' });
});

app.get('/api/user', async(req, res) => {
    try {
        const users = await findAll({ attributes: ['id', 'username'] });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while fetching user list.' });
    }
});

// Game endpoints
app.get('/api/game/start-anonymous', async(req, res) => {
    try {
        const newGame = await Game.create({ userId: null });
        // Logic to set up the first round of the game
        res.json(newGame);
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while starting the anonymous game.' });
    }
});

app.get('/api/game/start', async(req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ message: 'Not authenticated' });
    }
    try {
        const newGame = await Game.create({ userId: req.user.id });
        // Logic to set up the first round of the game
        res.json(newGame);
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while starting the game.' });
    }
});
app.get('/api/random-meme', async(req, res) => {

    try {
        const meme = await gameDao.getRandomMeme();
        // Explicitly set the Content-Type header
        res.status(200).json(meme);
    } catch (error) {
        console.error('Error fetching random meme:', error);
        res.status(500).json({ message: 'An error occurred while fetching the random meme.' });
    }
});
app.get('/api/caption', async(req, res) => {
    try {
        const caption = await CaptionDao.getRandomCaption();
        res.status(200).json(caption);
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while fetching the caption.' });
    }
});


app.get('/api/game/:gameId/round/:roundNumber', async(req, res) => {
    try {
        const { gameId, roundNumber } = req.params;
        const round = await Round.findOne({ where: { gameId, roundNumber } });
        if (!round) {
            return res.status(404).json({ message: 'Round not found.' });
        }
        res.json(round);
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while fetching the round data.' });
    }
});

app.post('/api/game/:gameId/round/:roundNumber/submit', async(req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ message: 'Not authenticated' });
    }
    try {
        const { gameId, roundNumber } = req.params;
        const { selectedCaption } = req.body;
        const round = await Round.findOne({ where: { gameId, roundNumber } });
        if (!round) {
            return res.status(404).json({ message: 'Round not found.' });
        }
        round.selectedCaption = selectedCaption;
        round.score = calculateScore(selectedCaption); // Replace with your scoring logic
        await round.save();
        res.json(round);
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while submitting the round.' });
    }
});

app.get('/api/game/:gameId/result', async(req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ message: 'Not authenticated' });
    }
    try {
        const { gameId } = req.params;
        const game = await Game.findByPk(gameId, {
            include: [{ model: Round }],
        });
        if (!game) {
            return res.status(404).json({ message: 'Game not found.' });
        }
        res.json(game);
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while fetching the game result.' });
    }
});




// Admin endpoints

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});