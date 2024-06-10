import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { check, validationResult } from 'express-validator';
import passport from 'passport';
import localStrategy from 'passport-local';
import session from 'express-session';

// init
const app = express();
const port = 3001;

// middleware
app.use(express.json());
app.use(morgan('dev'));

const corsOptions = {
    origin: 'http://localhost:5173',
    optionsSuccessStatus: 200,
    credentials: true
};
app.use(cors(corsOptions));

// passport :setup local strategy
passport.use(new localStrategy({ usernameField: 'email', passwordField: 'password' },
    (email, password, done) => {
        console.log('passport local strategy');
        if (email === 'admin' && password === 'admin') {
            return done(null, { email: 'admin' });
        } else {
            return done(null, false);
        }
    }
));

// passport :serialize user
passport.serializeUser((user, done) => {
    console.log('passport serialize user');
    done(null, user.email);
});
// passport :deserialize user
passport.deserializeUser((email, done) => {
    console.log('passport deserialize user');
    done(null, { email });
});

const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    return res.status(401).json({ message: 'Unauthorized' });
}

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.authenticate('session'));