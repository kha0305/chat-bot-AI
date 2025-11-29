const mysql = require('mysql2/promise');
require('dotenv').config();

// Create the connection pool. The pool-specific settings are the defaults
const pool = mysql.createPool({
  uri: process.env.DATABASE_URL, // Aiven MySQL Connection URI
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: {
    rejectUnauthorized: true,
    ca: process.env.CA_CERT, // Optional: Aiven CA Cert if needed, usually Aiven requires SSL
  }
});

// Test connection
pool.getConnection()
    .then(conn => {
        console.log("Successfully connected to Aiven MySQL database!");
        conn.release();
    })
    .catch(err => {
        console.error("Failed to connect to database:", err.message);
    });

module.exports = pool;
