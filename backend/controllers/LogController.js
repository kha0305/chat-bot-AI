const db = require('../config/db');

async function createErrorReport(req, res) {
    try {
        const { userId, description, severity } = req.body;

        await db.execute(
            'INSERT INTO bao_loi (nguoi_dung_id, mo_ta_loi, muc_do, thoi_gian) VALUES (?, ?, ?, NOW())',
            [userId || null, description, severity || 'normal']
        );

        res.json({ message: 'Đã gửi báo cáo lỗi thành công' });
    } catch (error) {
        console.error('Error creating error report:', error);
        res.status(500).json({ message: 'Lỗi server khi gửi báo cáo' });
    }
}

async function getSystemLogs(req, res) {
    try {
        // Fetch chat logs as system logs for now
        const [rows] = await db.execute(`
      SELECT l.*, u.ten_dang_nhap 
      FROM log_hoi_thoai l 
      LEFT JOIN nguoi_dung u ON l.nguoi_dung_id = u.id 
      ORDER BY l.thoi_gian DESC 
      LIMIT 100
    `);

        const logs = rows.map(row => ({
            id: row.id,
            userId: row.nguoi_dung_id,
            username: row.ten_dang_nhap || 'Guest',
            question: row.cau_hoi,
            response: row.phan_hoi,
            timestamp: row.thoi_gian
        }));

        res.json(logs);
    } catch (error) {
        console.error('Error fetching logs:', error);
        res.status(500).json({ message: 'Lỗi server khi lấy log hệ thống' });
    }
}

async function getErrorReports(req, res) {
    try {
        const [rows] = await db.execute(`
            SELECT b.*, u.ten_dang_nhap 
            FROM bao_loi b 
            LEFT JOIN nguoi_dung u ON b.nguoi_dung_id = u.id 
            ORDER BY b.thoi_gian DESC
        `);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching error reports:', error);
        res.status(500).json({ message: 'Lỗi server khi lấy báo cáo lỗi' });
    }
}

module.exports = {
    createErrorReport,
    getSystemLogs,
    getErrorReports
};
