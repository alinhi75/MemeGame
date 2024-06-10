/** DB access module **/

import sqlite3 from "sqlite3";

// Opening the database
// NOTE: to work properly you must run the server inside "server" folder (i.e., ./solution/server)
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