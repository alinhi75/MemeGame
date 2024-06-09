import passport from 'passport';
import LocalStrategy from 'passport-local';
import bcrypt from 'bcrypt';
import { open } from 'sqlite';
import sqlite3 from 'sqlite3';

// Initialize the database connection
let db;

async function initializeDB() {
    db = await open({
        filename: './database.db',
        driver: sqlite3.Database
    });
}

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

// Middleware to ensure user is authenticated
export function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.status(401).send({ message: 'Not authenticated' });
    }
}

// Initialize database
initializeDB().then(() => {
    console.log('Database initialized for authentication');
}).catch(err => {
    console.error('Failed to initialize database for authentication', err);
});

export default passport;