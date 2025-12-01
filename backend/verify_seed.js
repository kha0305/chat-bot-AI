const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
};

async function verifyData() {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);

        const [faqRows] = await connection.query('SELECT COUNT(*) as count FROM faq');
        console.log(`FAQ Count: ${faqRows[0].count}`);

        const [aiRows] = await connection.query('SELECT COUNT(*) as count FROM ai_training');
        console.log(`AI Training Count: ${aiRows[0].count}`);

    } catch (error) {
        console.error('Error verifying data:', error);
    } finally {
        if (connection) await connection.end();
    }
}

verifyData();
