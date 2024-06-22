import sqlite3 from 'sqlite3';
import crypto from 'crypto';
// import jwt from 'jsonwebtoken';

const db = new sqlite3.Database("DB/db.db", (err) => {
    if (err) {
        console.error(err.message);
        throw err;
    }
    console.log("Connected to the database(UserDao).");
});

// Function to get a user by username
export const getUserByUsername = (username) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM users WHERE username = ?';
        db.get(sql, [username], (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
};



// Function to log in a user
const login = (username, password) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM users WHERE username = ?';
        db.get(sql, [username], (err, row) => {
            if (err) {
                reject(err);
            } else if (!row) {
                reject(new Error('Invalid username'));
            } else {
                const storedHashLength = Buffer.from(row.password_hash, 'hex').length;
                crypto.scrypt(password, row.salt, storedHashLength, (err, derivedKey) => {
                    if (err) {
                        reject(err);
                    } else {
                        const storedPasswordHash = Buffer.from(row.password_hash, 'hex');
                        if (!crypto.timingSafeEqual(storedPasswordHash, derivedKey)) {
                            reject(new Error('Invalid password'));
                        } else {
                            resolve({ userId: row.id, username: row.username });
                        }
                    }
                });
            }
        });
    });
};
// function to validate the token when the user is logged in
export const validateToken = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, 'secret', (err, decoded) => {
            if (err) {
                reject(err);
            } else {
                resolve(decoded);
            }
        });
    });
};

// Function to log out a user
export const logout = (token) => {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE users SET token = NULL WHERE token = ?';
        db.run(sql, [token], function(err) {
            if (err) {
                reject(err);
            } else if (this.changes === 0) {
                reject(new Error('Invalid token'));
            } else {
                resolve();
            }
        });
    });
};

export default { getUserByUsername, login, logout, validateToken };