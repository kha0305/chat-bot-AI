const db = require('../config/db');

async function trainAI(req, res) {
    try {
        const { data, userId } = req.body;

        // 1. Save training data to DB
        await db.execute(
            'INSERT INTO ai_training (du_lieu, nguoi_cap_nhat, thoi_gian) VALUES (?, ?, NOW())',
            [data, userId || null]
        );

        // 2. Simulate training process (in a real app, this might trigger a Python script or call an external ML API)
        // For now, we just acknowledge it.

        // 3. Update performance stats (mock)
        // We could insert into hieu_suat_chatbot if we wanted to show "Data Learned" increasing.

        res.json({ message: 'Dữ liệu đã được thêm vào hàng đợi huấn luyện.' });
    } catch (error) {
        console.error('Error training AI:', error);
        res.status(500).json({ message: 'Lỗi server khi huấn luyện AI' });
    }
}

async function getTrainingStats(req, res) {
    try {
        // Get count of training data
        const [rows] = await db.execute('SELECT COUNT(*) as count FROM ai_training');
        const count = rows[0].count;

        // Get latest update
        const [latest] = await db.execute('SELECT thoi_gian FROM ai_training ORDER BY thoi_gian DESC LIMIT 1');
        const lastUpdated = latest.length > 0 ? latest[0].thoi_gian : null;

        res.json({
            accuracy: 95.5, // Mocked
            dataLearned: count,
            lastUpdated: lastUpdated
        });
    } catch (error) {
        console.error('Error fetching training stats:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
}

module.exports = {
    trainAI,
    getTrainingStats
};
