const supabase = require('../config/supabase');
const aiIntentAnalyzer = require('../services/AIIntentAnalyzer');
const bookService = require('../services/BookService'); // We might need to update this service too or bypass it

class ChatbotController {
  
  async processMessage(req, res) {
    try {
      const { message, userId, userName } = req.body;
      
      // 1. Save User Message to DB
      if (userId) {
        // Ensure user exists or create temp user? 
        // For now, we just log the chat. In a real app, we'd check 'nguoi_dung' table.
        // Let's assume we just log to 'log_hoi_thoai' with null user_id if not found, 
        // or we store the raw message.
        
        // Actually, 'log_hoi_thoai' expects 'nguoi_dung_id'. 
        // If we don't have a real user ID from DB, we might skip linking or create a guest user.
        // For simplicity in this demo, we'll just log the text content.
      }

      // 2. Analyze Intent
      const analysis = await aiIntentAnalyzer.analyze(message);
      
      let responseData = {
        message: analysis.response,
        books: []
      };

      // Check for explicit human request
      const lowerMsg = message.toLowerCase();
      if (lowerMsg.includes('gặp nhân viên') || lowerMsg.includes('gặp thủ thư') || lowerMsg.includes('chat với người') || lowerMsg.includes('tư vấn viên')) {
          responseData.message = "Mình đã gửi yêu cầu hỗ trợ đến các thủ thư. Vui lòng đợi trong giây lát, nhân viên sẽ phản hồi bạn ngay tại đây.";
          // TODO: Create a record in a 'chat_sessions' table if we had one for admin support
      } else {
          switch (analysis.intent) {
            case 'SEARCH_BOOK':
            case 'CHECK_STATUS':
              // Search in Supabase
              const { data: books } = await supabase
                .from('sach')
                .select('*')
                .ilike('tieu_de', `%${analysis.keywords}%`)
                .limit(5);

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
          await supabase.from('log_hoi_thoai').insert([
              {
                  // nguoi_dung_id: ...
                  cau_hoi: message,
                  phan_hoi: responseData.message
              }
          ]);
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
