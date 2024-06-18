import sqlite3 from 'sqlite3';

// Connect to the database
const db = new sqlite3.Database("DB/db.db", (err) => {
    if (err) {
        console.error(err.message);
        throw err;
    }
    console.log("Connected to the database(MemeDao).");
});


// select users with highest scores
export const getHighScores = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT username, score,round FROM Scores ORDER BY score DESC LIMIT 5';
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });

};
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

const recordGame = (round, username, score, caption) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO Games (round, username, score, caption) VALUES (?, ?, ?, ?)';
        db.run(sql, [round, username, score, caption], function(err) {
            if (err) {
                reject(err);
            } else {
                resolve({ id: this.lastID });
            }
        });
    });
};

export default { getHighScores, getGameHistory, recordGame };