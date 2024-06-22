import sqlite3 from "sqlite3";
try {
    const db = new sqlite3.Database('DB/db.db', (err) => {
        if (err) throw err;
    });
} catch (err) {
    console.log(err);
} finally {
    console.log("Database opened successfully");
}

export default db;