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

// Function to create a new meme
export const createMeme = (imagePath) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO memes (image_path) VALUES (?)';
        db.run(sql, [imagePath], function(err) {
            if (err) {
                reject(err);
            } else {
                resolve({ meme_id: this.lastID, image_path: imagePath });
            }
        });
    });
};

// Function to update a meme
export const updateMeme = (id, imagePath) => {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE memes SET image_path = ? WHERE meme_id = ?';
        db.run(sql, [imagePath, id], function(err) {
            if (err) {
                reject(err);
            } else if (this.changes === 0) {
                reject(new Error('Meme not found'));
            } else {
                resolve({ meme_id: id, image_path: imagePath });
            }
        });
    });
};

// Function to delete a meme
export const deleteMeme = (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM memes WHERE meme_id = ?';
        db.run(sql, [id], function(err) {
            if (err) {
                reject(err);
            } else if (this.changes === 0) {
                reject(new Error('Meme not found'));
            } else {
                resolve({ meme_id: id });
            }
        });
    });
};
//return image_path;

export const getRandomMeme = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT  meme_id,image_path FROM memes ORDER BY RANDOM() LIMIT 1';
        db.get(sql, [], (err, row) => {
            if (err) {
                reject(err);
            } else {
                if (row) {

                    resolve(row); // Resolve with the row containing image_path
                } else {
                    reject(new Error('No meme found.'));
                }
            }
        });
    });
};
// export const getRandomMeme = () => {
//     return new Promise((resolve, reject) => {
//         const sql = 'SELECT meme_id, image_path FROM memes ORDER BY RANDOM() LIMIT 1';
//         db.get(sql, [], (err, row) => {
//             if (err) {
//                 reject(err);
//             } else {
//                 resolve(row);
//             }
//         });
//     });
// };

// Export other CRUD operations here if needed...

// export default db;

export default { getRandomMeme };