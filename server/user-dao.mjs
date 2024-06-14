import sqlite3 from 'sqlite3';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
// import { db } from './db.mjs';

const db = new sqlite3.Database("DB/db.db", (err) => {
    if (err) {
        console.error(err.message);
        throw err;
    }
    console.log("Connected to the database.");
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
// Function to log in a user
export const login = (username, password) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM users WHERE username = ?';
        db.get(sql, [username], async(err, row) => {
            if (err) {
                reject(err);
            } else if (!row) {
                reject(new Error('User not found'));
            } else {
                const match = await bcrypt.compare(password, row.password);
                if (!match) {
                    reject(new Error('Invalid password'));
                }

            }
        })
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

export default db;