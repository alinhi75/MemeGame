import sqlite3 from 'sqlite3';

// Connect to the database
const db = new sqlite3.Database("DB/db.db", (err) => {
    if (err) {
        console.error(err.message);
        throw err;
    }
    console.log("Connected to the database(MemeDao).");
});

// Function to get all memes
export const getAllMemes = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT meme_id, image_path FROM memes';
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
};

// Function to get a meme by ID
export const getMemeById = (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT meme_id, image_path FROM memes WHERE meme_id = ?';
        db.get(sql, [id], (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
};

// Function to get a random meme For our Game
export const getRandomMeme = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT  meme_id,image_path FROM memes ORDER BY RANDOM() LIMIT 1';
        db.get(sql, [], (err, row) => {
            if (err) {
                reject(err);
            } else {
                if (row) {

                    resolve(row);
                } else {
                    reject(new Error('No meme found.'));
                }
            }
        });
    });
};

export default { getRandomMeme, getMemeById, getAllMemes };