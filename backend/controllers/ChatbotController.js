const db = require('../config/db');
const aiIntentAnalyzer = require('../services/AIIntentAnalyzer');

class ChatbotController {
  
  async processMessage(req, res) {
    try {
      const { message, userId, userName } = req.body;
      
      // 1. Analyze Intent
      const analysis = await aiIntentAnalyzer.analyze(message);
      
      let responseData = {
        message: analysis.response,
        books: []
      };

      // Check for explicit human request
      const lowerMsg = message.toLowerCase();
      if (lowerMsg.includes('gặp nhân viên') || lowerMsg.includes('gặp thủ thư') || lowerMsg.includes('chat với người') || lowerMsg.includes('tư vấn viên')) {
          responseData.message = "Mình đã gửi yêu cầu hỗ trợ đến các thủ thư. Vui lòng đợi trong giây lát, nhân viên sẽ phản hồi bạn ngay tại đây.";
      } else {
          switch (analysis.intent) {
            case 'SEARCH_BOOK':
            case 'CHECK_STATUS':
              // Search in MySQL
              const [books] = await db.execute(
                `SELECT * FROM sach WHERE tieu_de LIKE ? LIMIT 5`,
                [`%${analysis.keywords}%`]
              );

              if (books && books.length > 0) {
                responseData.books = books.map(b => ({
                    id: b.id.toString(),
                    title: b.tieu_de,
                    author: b.tac_gia,
                    status: b.trang_thai,
                    coverUrl: b.anh_bia
                }));
                
                if (analysis.intent === 'CHECK_STATUS') {
                   const book = books[0];
                   const status = book.trang_thai === 'Available' ? 'có sẵn' : 'đang được mượn';
                   responseData.message = `Sách "${book.tieu_de}" hiện đang ${status}.`;
                } else {
                   responseData.message = `Mình tìm thấy ${books.length} cuốn sách phù hợp với từ khóa "${analysis.keywords}":`;
                }
              } else {
                responseData.message = `Rất tiếc, mình không tìm thấy sách nào với từ khóa "${analysis.keywords}".`;
              }
              break;

            case 'LIBRARY_INFO':
              if (!responseData.message) {
                responseData.message = "Thư viện mở cửa từ 7:30 đến 21:00 các ngày trong tuần.";
              }
              break;

            default:
              break;
          }
      }

      // 3. Save Bot Response to DB (log_hoi_thoai)
      if (userId) {
          // Assuming userId is valid int, if not skip or handle
          // If userId is 'admin' or string, this might fail if column is INT.
          // Schema says nguoi_dung_id is BIGINT.
          // If userId comes from frontend as string '1', it works.
          // If it's 'admin', it fails.
          // Let's check if userId is numeric.
          if (!isNaN(userId)) {
              await db.execute(
                  `INSERT INTO log_hoi_thoai (nguoi_dung_id, cau_hoi, phan_hoi) VALUES (?, ?, ?)`,
                  [userId, message, responseData.message]
              );
          }
      }

      res.json(responseData);

    } catch (error) {
      console.error("Controller Error:", error);
      res.status(500).json({ 
        message: "Hệ thống đang gặp sự cố. Vui lòng thử lại sau.",
        books: []
      });
    }
  }
}

module.exports = new ChatbotController();
