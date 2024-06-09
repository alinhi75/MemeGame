import express from 'express';
import session from 'express-session';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import bcrypt from 'bcrypt';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import memeRoutes from './meme.mjs';
// Initialize Express App
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS Configuration
app.use(cors({
    origin: 'http://localhost:3000', // React frontend URL
    credentials: true,
}));

// Session Management
app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());
app.use('/api/memes', memeRoutes);

// Database Connection
let db;
(async() => {
    db = await open({
        filename: './DB/db.sqlite',
        driver: sqlite3.Database,
    });
})();

// Passport Configuration
passport.use(new LocalStrategy(async(username, password, done) => {
    try {
        const user = await db.get('SELECT * FROM users WHERE username = ?', username);
        if (!user) {
            return done(null, false, { message: 'Incorrect username.' });
        }
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
    } catch (err) {
        return done(err);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async(id, done) => {
    try {
        const user = await db.get('SELECT * FROM users WHERE id = ?', id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});

// Routes
app.post('/login', passport.authenticate('local'), (req, res) => {
    res.send({ message: 'Logged in successfully' });
});

app.post('/logout', (req, res) => {
    req.logout();
    res.send({ message: 'Logged out successfully' });
});

// Sample protected route
app.get('/profile', (req, res) => {
    if (req.isAuthenticated()) {
        res.send(req.user);
    } else {
        res.status(401).send({ message: 'Not authenticated' });
    }
});

// Initialize the server and database
initializeDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}).catch(err => {
    console.error('Failed to initialize database', err);
});