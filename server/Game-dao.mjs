import sqlite3 from 'sqlite3';

// Connect to the database
const db = new sqlite3.Database("DB/db.db", (err) => {
    if (err) {
        console.error(err.message);
        throw err;
    }
    console.log("Connected to the database(MemeDao).");
});


// Set the Leaderboard
export const getHighScores = () => {
    return new Promise((resolve, reject) => {
        // select for each distinct user the total score
        const sql = 'SELECT username,game_id, SUM(score) as total_score FROM Games GROUP BY username ORDER BY total_score DESC LIMIT 5';
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });

};
// Get the Game History for Profile of the User
export const getGameHistory = (username) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM Games WHERE username = ?';
        db.all(sql, [username], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
};
// Function for recording the game of the users into database
const recordGame = (round, username, score, caption, rightcaption, image_path) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO Games (round, username, score, caption,rightcaption,image_path) VALUES (?, ?, ?, ?,?,?)';
        db.run(sql, [round, username, score, caption, rightcaption, image_path], function(err) {
            if (err) {
                reject(err);
            } else {
                resolve({ id: this.lastID });
            }
        });
    });
};
export const deleteGame = (gameId) => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM Games WHERE game_id = ?';
        db.run(sql, [gameId], function(err) {
            if (err) {
                reject(err);
            } else {
                resolve({ id: this.lastID });
            }
        });
    });
};
export default { getHighScores, getGameHistory, recordGame, deleteGame };