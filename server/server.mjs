import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import session from 'express-session';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import { Sequelize, DataTypes } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const port = 3000;

// Database setup
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'database.sqlite',
});

const User = sequelize.define('User', {
    username: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    token: { type: DataTypes.STRING, allowNull: true },
}, { timestamps: false });

const Meme = sequelize.define('Meme', {
    imageUrl: { type: DataTypes.STRING, allowNull: false },
    caption: { type: DataTypes.STRING, allowNull: false },
}, { timestamps: false });

const Game = sequelize.define('Game', {
    userId: { type: DataTypes.INTEGER, allowNull: true },
    totalScore: { type: DataTypes.INTEGER, defaultValue: 0 },
    isCompleted: { type: DataTypes.BOOLEAN, defaultValue: false },
}, { timestamps: true });

const Round = sequelize.define('Round', {
    gameId: { type: DataTypes.INTEGER, allowNull: false },
    memeId: { type: DataTypes.INTEGER, allowNull: false },
    selectedCaption: { type: DataTypes.STRING, allowNull: true },
    score: { type: DataTypes.INTEGER, defaultValue: 0 },
}, { timestamps: true });

Meme.hasMany(Round, { foreignKey: 'memeId' });
Game.hasMany(Round, { foreignKey: 'gameId' });

sequelize.sync();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

// Passport setup
passport.use(new LocalStrategy(
    async(username, password, done) => {
        try {
            const user = await User.findOne({ where: { username } });
            if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
            }
            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                return done(null, false, { message: 'Incorrect password.' });
            }
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }
));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async(id, done) => {
    try {
        const user = await User.findByPk(id);
        done(null, user);
    } catch (error) {
        done(error);
    }
});

// API endpoints
app.post('/api/user/login', (req, res, next) => {
    passport.authenticate('local', async(err, user, info) => {
        if (err) return next(err);
        if (!user) return res.status(400).json({ message: info.message });

        const token = uuidv4();
        await user.update({ token });

        req.login(user, (loginErr) => {
            if (loginErr) return next(loginErr);
            return res.json({ token });
        });
    })(req, res, next);
});

app.post('/api/user/logout', async(req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ message: 'Not authenticated' });
    }
    await req.user.update({ token: null });
    req.logout();
    res.json({ message: 'Logged out successfully' });
});

app.get('/api/user', async(req, res) => {
    try {
        const users = await User.findAll({ attributes: ['id', 'username'] });
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

app.get('/api/meme/:memeId', async(req, res) => {
    try {
        const { memeId } = req.params;
        const meme = await Meme.findByPk(memeId);
        if (!meme) {
            return res.status(404).json({ message: 'Meme not found.' });
        }
        res.json(meme);
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while fetching the meme data.' });
    }
});

// Admin endpoints
app.get('/api/admin/memes', async(req, res) => {
    const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : null;
    const user = await User.findOne({ where: { token } });

    if (!user || !user.isAdmin) {
        return res.status(403).json({ message: 'Forbidden' });
    }

    try {
        const memes = await Meme.findAll();
        res.json(memes);
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while fetching memes.' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});