const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
};

async function seedData() {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        console.log('Connected to database.');

        // Seed FAQs
        const faqValues = [];
        for (let i = 1; i <= 1000; i++) {
            faqValues.push([`Câu hỏi thường gặp số ${i}`, `Đây là câu trả lời mẫu cho câu hỏi số ${i}. Nội dung chi tiết sẽ được cập nhật sau.`, 1]);
        }

        console.log('Inserting 1000 FAQs...');
        // Chunking inserts to avoid packet too large errors
        const chunkSize = 500;
        for (let i = 0; i < faqValues.length; i += chunkSize) {
            const chunk = faqValues.slice(i, i + chunkSize);
            await connection.query('INSERT INTO faq (cau_hoi, cau_tra_loi, nguoi_cap_nhat) VALUES ?', [chunk]);
        }
        console.log('Inserted 1000 FAQs successfully.');

        // Seed AI Training Data
        const aiValues = [];
        for (let i = 1; i <= 1000; i++) {
            aiValues.push([`Dữ liệu huấn luyện mẫu số ${i}: Người dùng hỏi về vấn đề X, AI nên trả lời theo hướng Y.`, 1]);
        }

        console.log('Inserting 1000 AI Training entries...');
        for (let i = 0; i < aiValues.length; i += chunkSize) {
            const chunk = aiValues.slice(i, i + chunkSize);
            await connection.query('INSERT INTO ai_training (du_lieu, nguoi_cap_nhat) VALUES ?', [chunk]);
        }
        console.log('Inserted 1000 AI Training entries successfully.');

    } catch (error) {
        console.error('Error seeding data:', error);
    } finally {
        if (connection) await connection.end();
        console.log('Connection closed.');
    }
}

seedData();
