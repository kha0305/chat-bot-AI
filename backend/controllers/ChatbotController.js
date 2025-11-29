const db = require('../config/db');
const aiIntentAnalyzer = require('../services/AIIntentAnalyzer');

class ChatbotController {
  
  async processMessage(req, res) {
    try {
      const { message, userId, userName } = req.body;
      
      // 1. Analyze Intent
      // We wrap this in a try-catch specifically to ensure we can still process basic keywords if AI fails
      let analysis = { intent: 'OTHER', keywords: '', response: '' };
      try {
          analysis = await aiIntentAnalyzer.analyze(message);
      } catch (aiError) {
          console.error("AI Service Failed:", aiError.message);
          // Keep default 'OTHER' intent
      }
      
      let responseData = {
        message: analysis.response,
        books: []
      };

      // Check for explicit human request (Keyword Matching - High Priority)
      const lowerMsg = message.toLowerCase();
      const humanKeywords = ['gặp nhân viên', 'gặp thủ thư', 'chat với người', 'tư vấn viên', 'hỗ trợ trực tuyến'];
      
      if (humanKeywords.some(kw => lowerMsg.includes(kw))) {
          // Create support ticket
          if (userId && !isNaN(userId)) {
              try {
                  await db.execute(
                      `INSERT INTO ho_tro_truc_tuyen (nguoi_dung_id, noi_dung, trang_thai) VALUES (?, ?, 'cho_xu_ly')`,
                      [userId, message]
                  );
                  responseData.message = "Hệ thống đã ghi nhận yêu cầu của bạn. Nhân viên thư viện sẽ sớm liên hệ lại qua khung chat này hoặc email.";
              } catch (dbError) {
                  console.error("Failed to create support ticket:", dbError);
                  responseData.message = "Hiện tại hệ thống đang quá tải. Vui lòng thử lại sau hoặc đến trực tiếp quầy thủ thư.";
              }
          } else {
              responseData.message = "Bạn cần đăng nhập để gửi yêu cầu gặp nhân viên hỗ trợ.";
          }
      } else {
          // Normal AI processing
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
            
            case 'GREETING':
                if (!responseData.message) {
                    responseData.message = "Xin chào! Mình là LibBot. Mình có thể giúp gì cho bạn hôm nay?";
                }
                break;

            default:
               if (!responseData.message) {
                   responseData.message = "Xin lỗi, mình chưa hiểu ý bạn. Bạn có thể hỏi về sách hoặc quy định thư viện.";
               }
              break;
          }
      }

      // 3. Save Bot Response to DB (log_hoi_thoai)
      if (userId && !isNaN(userId)) {
          try {
              // Optional: Check if user exists first
               const [users] = await db.execute('SELECT id FROM nguoi_dung WHERE id = ?', [userId]);
               if (users.length > 0) {
                  await db.execute(
                      `INSERT INTO log_hoi_thoai (nguoi_dung_id, cau_hoi, phan_hoi) VALUES (?, ?, ?)`,
                      [userId, message, responseData.message]
                  );
               }
          } catch (logError) {
              console.error("Failed to log chat:", logError.message);
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
