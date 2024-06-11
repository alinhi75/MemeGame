import { db } from "./db.mjs";
import crypto from "crypto";

// get user function with hashinh with crypto
export const getUser = (username, password) => {
    const hash = crypto.createHash('sha256');
    hash.update(password);
    const sql = `SELECT * FROM users WHERE username = ? AND password = ?`;
    const hashedPassword = hash.digest('hex');
    return new Promise((resolve, reject) => {
        db.get(sql, [username, hashedPassword], (err, row) => {
            if (err) {
                reject(err);
            } else if (!row) {
                resolve(row);
            } else {
                const user = {
                    id: row.id,
                    username: row.username,
                    email: row.email
                };
                crypto.scrypt(password, 'salt', 64, (err, derivedKey) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(user);
                    }
                });
            }
        });
    });
}

export const getUserByusername = (username) => {
    const sql = `SELECT * FROM users WHERE username = ?`;
    return new Promise((resolve, reject) => {
        db.get(sql, [username], (err, row) => {
            if (err) {
                reject(err);
            } else {
                const user = {
                    // id: row.id,
                    username: row.username,
                    // email: row.email
                };
                resolve(user);
            }
        });
    });
}