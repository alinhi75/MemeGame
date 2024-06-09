import express from 'express';
import { open } from 'sqlite';
import sqlite3 from 'sqlite3';

const router = express.Router();

// Initialize the database connection
let db;

async function initializeDB() {
    db = await open({
        filename: './database.db',
        driver: sqlite3.Database
    });
}

// Middleware to ensure user is authenticated
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.status(401).send({ message: 'Not authenticated' });
    }
}

// Fetch a random meme with captions
router.get('/random-meme', ensureAuthenticated, async(req, res) => {
    try {
        const meme = await db.get(`
      SELECT * FROM memes
      WHERE id NOT IN (
        SELECT meme_id FROM rounds WHERE game_id IN (
          SELECT id FROM games WHERE user_id = ?
        )
      )
      ORDER BY RANDOM() LIMIT 1
    `, req.user.id);

        if (!meme) {
            return res.status(404).send({ message: 'No memes available' });
        }

        const captions = await db.all(`
      SELECT c.id, c.text FROM captions c
      JOIN meme_captions mc ON c.id = mc.caption_id
      WHERE mc.meme_id = ?
      ORDER BY RANDOM()
      LIMIT 7
    `, meme.id);

        res.send({ meme, captions });
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: 'Failed to fetch meme' });
    }
});

// Submit a caption for a meme
router.post('/submit-caption', ensureAuthenticated, async(req, res) => {
    const { memeId, captionId, gameId } = req.body;

    try {
        const isBestMatch = await db.get(`
      SELECT is_best_match FROM meme_captions
      WHERE meme_id = ? AND caption_id = ?
    `, memeId, captionId);

        const score = isBestMatch && isBestMatch.is_best_match ? 5 : 0;

        await db.run(`
      INSERT INTO rounds (game_id, meme_id, selected_caption_id, score)
      VALUES (?, ?, ?, ?)
    `, gameId, memeId, captionId, score);

        res.send({ score });
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: 'Failed to submit caption' });
    }
});

// Fetch game history for a user
router.get('/game-history', ensureAuthenticated, async(req, res) => {
    try {
        const games = await db.all(`
      SELECT * FROM games
      WHERE user_id = ?
    `, req.user.id);

        const gameDetails = await Promise.all(games.map(async(game) => {
            const rounds = await db.all(`
        SELECT r.*, m.url, c.text AS caption_text FROM rounds r
        JOIN memes m ON r.meme_id = m.id
        JOIN captions c ON r.selected_caption_id = c.id
        WHERE r.game_id = ?
      `, game.id);

            return {...game, rounds };
        }));

        res.send(gameDetails);
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: 'Failed to fetch game history' });
    }
});

// Initialize database and export router
initializeDB().then(() => {
    console.log('Database initialized for meme routes');
}).catch(err => {
    console.error('Failed to initialize database', err);
});

export default router;