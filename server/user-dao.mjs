import sqlite3 from 'sqlite3';
import crypto from 'crypto';

const db = new sqlite3.Database("DB/db.db", (err) => {
    if (err) {
        console.error(err.message);
        throw err;
    }
    console.log("Connected to the database(UserDao).");
});

// Function to get all users
export const getUsers = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT id, username FROM users';
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
};

// Function to get a user by ID
export const getUserById = (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT id, username FROM users WHERE id = ?';
        db.get(sql, [id], (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
};
// Function to log in a user with username and password with crypto





export const login = (username, password) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM users WHERE username = ?';
        db.get(sql, [username], (err, row) => {
            if (err) {
                reject(err);
            } else if (!row) {
                reject(new Error('Invalid username'));
            } else {
                const user = { id: row.id, username: row.username, name: row.name };

                // Determine the length of the stored hash
                const storedHashLength = Buffer.from(row.password_hash, 'hex').length;

                crypto.scrypt(password, row.salt, storedHashLength, (err, derivedKey) => {
                    if (err) {
                        reject(err);
                    } else {
                        const storedPasswordHash = Buffer.from(row.password_hash, 'hex');
                        if (!crypto.timingSafeEqual(storedPasswordHash, derivedKey)) {
                            reject(new Error('Invalid password'));
                        } else {
                            resolve(user);
                        }
                    }
                });
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

export default { getUsers, getUserById, login, logout };