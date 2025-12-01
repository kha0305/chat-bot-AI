const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
};

async function runSql() {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        const sql = fs.readFileSync(path.join(__dirname, 'create_support_table.sql'), 'utf8');
        await connection.query(sql);
        console.log('Table ho_tro_truc_tuyen ensured.');
    } catch (error) {
        console.error('Error creating table:', error);
    } finally {
        if (connection) await connection.end();
    }
}

runSql();
