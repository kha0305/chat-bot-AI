const db = require('../config/db');

class SupportController {
    // 1. Create a support session (Student)
    async createSession(req, res) {
        try {
            const { userId, message } = req.body;
            // Check if there is already an active session
            const [existing] = await db.execute(
                `SELECT id FROM ho_tro_truc_tuyen 
                 WHERE nguoi_dung_id = ? AND trang_thai IN ('cho_xu_ly', 'dang_xu_ly')`,
                [userId]
            );

            let sessionId;
            if (existing.length > 0) {
                sessionId = existing[0].id;
            } else {
                const [result] = await db.execute(
                    `INSERT INTO ho_tro_truc_tuyen (nguoi_dung_id, noi_dung, trang_thai) VALUES (?, ?, 'cho_xu_ly')`,
                    [userId, message]
                );
                sessionId = result.insertId;
            }

            // Add initial message to message table
            await db.execute(
                `INSERT INTO tin_nhan_ho_tro (ho_tro_id, nguoi_gui_id, noi_dung) VALUES (?, ?, ?)`,
                [sessionId, userId, message]
            );

            res.json({ success: true, sessionId, message: "Đã gửi yêu cầu hỗ trợ." });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Lỗi server" });
        }
    }

    // 2. Get all sessions (Staff)
    async getSessions(req, res) {
        try {
            const [sessions] = await db.execute(`
                SELECT h.*, n.ho_ten as ten_nguoi_dung 
                FROM ho_tro_truc_tuyen h
                JOIN nguoi_dung n ON h.nguoi_dung_id = n.id
                ORDER BY h.thoi_gian_tao DESC
            `);
            res.json(sessions);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Lỗi server" });
        }
    }

    // 3. Get messages for a session
    async getMessages(req, res) {
        try {
            const { sessionId } = req.params;
            const [messages] = await db.execute(`
                SELECT m.*, n.ho_ten as ten_nguoi_gui, n.vai_tro
                FROM tin_nhan_ho_tro m
                JOIN nguoi_dung n ON m.nguoi_gui_id = n.id
                WHERE m.ho_tro_id = ?
                ORDER BY m.thoi_gian ASC
            `, [sessionId]);
            res.json(messages);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Lỗi server" });
        }
    }

    // 4. Send message
    async sendMessage(req, res) {
        try {
            const { sessionId, userId, message } = req.body;
            await db.execute(
                `INSERT INTO tin_nhan_ho_tro (ho_tro_id, nguoi_gui_id, noi_dung) VALUES (?, ?, ?)`,
                [sessionId, userId, message]
            );
            res.json({ success: true });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Lỗi server" });
        }
    }
    
    // 5. Check active session for user
    async getActiveSession(req, res) {
        try {
            const { userId } = req.params;
            const [sessions] = await db.execute(
                `SELECT id, trang_thai FROM ho_tro_truc_tuyen 
                 WHERE nguoi_dung_id = ? AND trang_thai IN ('cho_xu_ly', 'dang_xu_ly')
                 LIMIT 1`,
                [userId]
            );
            if (sessions.length > 0) {
                res.json({ active: true, sessionId: sessions[0].id, status: sessions[0].trang_thai });
            } else {
                res.json({ active: false });
            }
        } catch (error) {
             console.error(error);
            res.status(500).json({ error: "Lỗi server" });
        }
    }
}

module.exports = new SupportController();
