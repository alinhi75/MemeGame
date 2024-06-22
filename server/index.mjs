import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import session from 'express-session';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local'
import gameDao from './Meme-dao.mjs';
import CaptionDao from './Caption-dao.mjs';
import UserDao from './user-dao.mjs';
import ScoreDao from './Game-dao.mjs';
import userDao from './user-dao.mjs';


const app = express();
const port = 3001;


app.use(express.json());
// app.use(express.urlencoded({ extended: false }));

const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200,
    credentials: true,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, httpOnly: true, maxAge: 3600000 }
}));

app.use(passport.initialize());
app.use(passport.session());



//passport setup local strategy
passport.use(new LocalStrategy(async(username, password, done) => {
    try {
        const token = await UserDao.login(username, password);
        return done(null, token);
    } catch (error) {
        return done(null, false, { message: error.message });
    }
}));
// passport setup serialize  user
passport.serializeUser((token, done) => {
    done(null, token);
});
// passport setup deserialize user
passport.deserializeUser(async(token, done) => {
    try {
        const user = await userDao.validateToken(token);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});
// passport authenticate session

app.use(passport.authenticate('session'));
// Login and Authentication

app.post('/api/sessions', async(req, res) => {
    const { username, password } = req.body;
    try {
        const user = await userDao.login(username, password);
        req.session.user = user; // Store user in session
        res.status(201).json(user);
    } catch (err) {
        res.status(401).json({ message: err.message });
    }
});

const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.status(401).json({ message: 'Unauthorized' });
    }
};
// get user profile based on our Authentication

app.get('/api/profile', isAuthenticated, (req, res) => {
    res.json(req.session.user);
});


// check if the user is authenticated

app.get('/api/sessions', (req, res) => {
    if (req.isAuthenticated()) {
        return res.status(200).json(req.user);
    }
    return res.status(401).json({ message: 'Not authenticated' });
});
// delete the session and logout
app.delete('/api/sessions', (req, res) => {
    req.logout(() => {
        res.end();
    });
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


// logout based on user-dao.js and api.js

app.post('/api/logout', async(req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ message: 'Not authenticated' });
    }
    await req.user.update({ token: null });
    req.logout();
    res.json({ message: 'Logged out successfully' });
});
// get user data by username after login

app.get('/api/users/:username', async(req, res) => {
    try {
        const user = await UserDao.getUserByUsername(req.params.username);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while fetching the user.' });
    }
});

// get user game history

app.get('/api/users/:username/games', async(req, res) => {
    try {
        const games = await ScoreDao.getGameHistory(req.params.username);
        res.json(games);
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while fetching the user game history.' });
    }
});
// recording the game history of the user

app.post('/api/record-game', async(req, res) => {
    const { round, username, score, caption, rightcaption, image_path } = req.body;

    if (round === undefined || !username || score === undefined || !caption || !image_path) {
        return res.status(400).send('Missing required fields');
    }

    try {
        const game = await ScoreDao.recordGame(round, username, score, caption, rightcaption, image_path);
        res.status(201).json(game);
    } catch (error) {
        console.error('Error in /api/record-game:', error);
        res.status(500).send('Error recording game');
    }
});
// Random meme endpoint

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
// get Random Captions for the game

app.get('/api/caption', async(req, res) => {
    try {
        const caption = await CaptionDao.getRandomCaptions();
        res.status(200).json(caption);
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while fetching the caption.' });
    }
});
// get correct caption for the meme

app.get('/api/correct-caption/:memeId', async(req, res) => {
    try {
        const correctCaptionId = await CaptionDao.getCorrectCaptionForMeme(req.params.memeId);
        res.status(200).json(correctCaptionId.captionid_match);
    } catch (error) {
        console.error('Error in /api/correct-caption/:memeId:', error);
        res.status(500).send('Error fetching correct caption');
    }
});
// get the leaderboard

app.get('/api/leaderboard', async(req, res) => {
    try {
        const leaderboard = await ScoreDao.getHighScores();
        res.status(200).json(leaderboard);
    } catch (error) {
        console.error('Error in /api/leaderboard:', error);
        res.status(500).send('Error fetching leaderboard');
    }
});


// Start the server

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});