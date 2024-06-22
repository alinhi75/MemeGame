import sqlite3 from 'sqlite3';

// Connect to the database
const db = new sqlite3.Database("DB/db.db", (err) => {
    if (err) {
        console.error(err.message);
        throw err;
    }
    console.log("Connected to the database(CaptionDao).");
});

// Function to get all captions
export const getAllCaptions = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT caption_id, text FROM captions';
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
};

// Function to get a caption by ID
export const getCaptionById = (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT caption_id, text FROM captions WHERE caption_id = ?';
        db.get(sql, [id], (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
};
// Function to get a Random Caption for Games
export const getRandomCaptions = () => {
    return new Promise((resolve, reject) => {
        // Select 7 random captions
        const sql = 'SELECT DISTINCT caption_text FROM captions ORDER BY RANDOM() LIMIT 5';

        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                if (rows && rows.length > 0) {
                    resolve(rows.map(row => row.caption_text));
                } else {
                    reject(new Error('No captions found.'));
                }
            }
        });
    });
};
// Function to include the correct caption for the meme
export const getCorrectCaptionForMeme = (meme_id) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT captionid_match FROM Memes WHERE meme_id = ?';
        db.get(sql, [meme_id], (err, row) => {
            if (err) {
                console.error('Error executing SQL query:', err);
                reject(err);
            } else {
                if (row) {
                    resolve(row);
                } else {
                    reject(new Error('No caption found for the meme.'));
                }
            }
        });
    });
};

export default { getRandomCaptions, getCorrectCaptionForMeme, getCaptionById, getAllCaptions };