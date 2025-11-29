const mysql = require('mysql2/promise');
require('dotenv').config();

// Parse the connection string or use individual params
// Aiven URI format: mysql://user:password@host:port/db?ssl-mode=REQUIRED
const dbConfig = {
  uri: process.env.DATABASE_URL, 
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: {
    // For Aiven, we often need to allow self-signed or unknown CAs if we don't provide the CA cert explicitly
    rejectUnauthorized: false 
  }
};

const pool = mysql.createPool(dbConfig);

// Test connection on startup
pool.getConnection()
    .then(conn => {
        console.log("Successfully connected to Aiven MySQL database!");
        conn.release();
    })
    .catch(err => {
        console.error("Failed to connect to database:", err.message);
    });

module.exports = pool;
