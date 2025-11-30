const db = require('../config/db');

async function getFAQs(req, res) {
    try {
        const [rows] = await db.execute('SELECT * FROM faq ORDER BY ngay_tao DESC');
        // Map database columns to frontend expected format if necessary
        // Frontend expects: { id, question, answer, category }
        // DB has: cau_hoi, cau_tra_loi. Category is missing in DB schema, I might need to add it or just ignore it for now.
        // Let's check the frontend AdminFAQ.tsx again. It uses 'category'.
        // I should probably add 'category' to the DB or just mock it in the response.
        // For now, I'll return what's in DB and maybe add a default category.

        const faqs = rows.map(row => ({
            id: row.id,
            question: row.cau_hoi,
            answer: row.cau_tra_loi,
            category: 'Chung' // Default category as DB doesn't have it yet
        }));
        res.json(faqs);
    } catch (error) {
        console.error('Error fetching FAQs:', error);
        res.status(500).json({ message: 'Lỗi server khi lấy danh sách FAQ' });
    }
}

async function addFAQ(req, res) {
    try {
        const { question, answer, category } = req.body;
        // We ignore category for DB insert as column doesn't exist, or we could add it to schema.
        // Let's stick to existing schema for safety, or I can alter table.
        // Given I can't easily alter table without risk, I'll just store question and answer.

        const [result] = await db.execute(
            'INSERT INTO faq (cau_hoi, cau_tra_loi, ngay_tao) VALUES (?, ?, NOW())',
            [question, answer]
        );

        res.json({
            id: result.insertId,
            question,
            answer,
            category: category || 'Chung'
        });
    } catch (error) {
        console.error('Error adding FAQ:', error);
        res.status(500).json({ message: 'Lỗi server khi thêm FAQ' });
    }
}

async function updateFAQ(req, res) {
    try {
        const { id } = req.params;
        const { question, answer } = req.body;

        await db.execute(
            'UPDATE faq SET cau_hoi = ?, cau_tra_loi = ? WHERE id = ?',
            [question, answer, id]
        );

        res.json({ message: 'Cập nhật FAQ thành công' });
    } catch (error) {
        console.error('Error updating FAQ:', error);
        res.status(500).json({ message: 'Lỗi server khi cập nhật FAQ' });
    }
}

async function deleteFAQ(req, res) {
    try {
        const { id } = req.params;
        await db.execute('DELETE FROM faq WHERE id = ?', [id]);
        res.json({ message: 'Xóa FAQ thành công' });
    } catch (error) {
        console.error('Error deleting FAQ:', error);
        res.status(500).json({ message: 'Lỗi server khi xóa FAQ' });
    }
}

module.exports = {
    getFAQs,
    addFAQ,
    updateFAQ,
    deleteFAQ
};
