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

// Function to create a new caption
export const createCaption = (text) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO captions (text) VALUES (?)';
        db.run(sql, [text], function(err) {
            if (err) {
                reject(err);
            } else {
                resolve({ caption_id: this.lastID, text });
            }
        });
    });
};

// Function to update a caption
export const updateCaption = (id, text) => {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE captions SET text = ? WHERE caption_id = ?';
        db.run(sql, [text, id], function(err) {
            if (err) {
                reject(err);
            } else if (this.changes === 0) {
                reject(new Error('Caption not found'));
            } else {
                resolve({ caption_id: id, text });
            }
        });
    });
};

// Function to delete a caption
export const deleteCaption = (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM captions WHERE caption_id = ?';
        db.run(sql, [id], function(err) {
            if (err) {
                reject(err);
            } else if (this.changes === 0) {
                reject(new Error('Caption not found'));
            } else {
                resolve({ caption_id: id });
            }
        });
    });
};

// Function to get a random caption
export const getRandomCaption = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT caption_text FROM Captions ORDER BY RANDOM() LIMIT 1';
        db.get(sql, [], (err, row) => {
            if (err) {
                reject(err);
            } else {
                if (row) {
                    resolve(row);
                } else {
                    reject(new Error('No caption found.'));
                }
            }
        });
    });
};

// Export the database connection and other operations
export default { db, getRandomCaption };