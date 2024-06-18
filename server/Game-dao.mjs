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
        const sql = 'SELECT user_id, score,game_id FROM Scores ORDER BY score DESC LIMIT 5';
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
};

export default { getHighScores };