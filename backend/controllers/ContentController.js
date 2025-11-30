const db = require('../config/db');

// --- Introduction ---
exports.getIntroduction = async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM gioi_thieu ORDER BY thu_tu ASC');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateIntroduction = async (req, res) => {
    try {
        const { id } = req.params;
        const { tieu_de, noi_dung, hinh_anh, thu_tu } = req.body;
        await db.execute(
            'UPDATE gioi_thieu SET tieu_de = ?, noi_dung = ?, hinh_anh = ?, thu_tu = ? WHERE id = ?',
            [tieu_de, noi_dung, hinh_anh, thu_tu, id]
        );
        res.json({ message: 'Updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.addIntroduction = async (req, res) => {
    try {
        const { tieu_de, noi_dung, hinh_anh, thu_tu } = req.body;
        const [result] = await db.execute(
            'INSERT INTO gioi_thieu (tieu_de, noi_dung, hinh_anh, thu_tu) VALUES (?, ?, ?, ?)',
            [tieu_de, noi_dung, hinh_anh, thu_tu]
        );
        res.json({ id: result.insertId, message: 'Added successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteIntroduction = async (req, res) => {
    try {
        const { id } = req.params;
        await db.execute('DELETE FROM gioi_thieu WHERE id = ?', [id]);
        res.json({ message: 'Deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// --- Notifications ---
exports.getNotifications = async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM thong_bao ORDER BY ngay_tao DESC');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.addNotification = async (req, res) => {
    try {
        const { tieu_de, noi_dung, loai } = req.body;
        const [result] = await db.execute(
            'INSERT INTO thong_bao (tieu_de, noi_dung, loai) VALUES (?, ?, ?)',
            [tieu_de, noi_dung, loai || 'info']
        );
        res.json({ id: result.insertId, message: 'Added successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteNotification = async (req, res) => {
    try {
        const { id } = req.params;
        await db.execute('DELETE FROM thong_bao WHERE id = ?', [id]);
        res.json({ message: 'Deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// --- Guides ---
exports.getGuides = async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM huong_dan ORDER BY thu_tu ASC');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.addGuide = async (req, res) => {
    try {
        const { tieu_de, noi_dung, thu_tu } = req.body;
        const [result] = await db.execute(
            'INSERT INTO huong_dan (tieu_de, noi_dung, thu_tu) VALUES (?, ?, ?)',
            [tieu_de, noi_dung, thu_tu]
        );
        res.json({ id: result.insertId, message: 'Added successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateGuide = async (req, res) => {
    try {
        const { id } = req.params;
        const { tieu_de, noi_dung, thu_tu } = req.body;
        await db.execute(
            'UPDATE huong_dan SET tieu_de = ?, noi_dung = ?, thu_tu = ? WHERE id = ?',
            [tieu_de, noi_dung, thu_tu, id]
        );
        res.json({ message: 'Updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteGuide = async (req, res) => {
    try {
        const { id } = req.params;
        await db.execute('DELETE FROM huong_dan WHERE id = ?', [id]);
        res.json({ message: 'Deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
