const aiIntentAnalyzer = require('../services/AIIntentAnalyzer');
const bookService = require('../services/BookService');
const chatStore = require('../data/ChatStore');

class ChatbotController {
  
  async processMessage(req, res) {
    try {
      const { message, userId, userName } = req.body;
      
      // Ensure session exists if userId is provided
      if (userId && userName) {
        chatStore.getSession(userId, { id: userId, name: userName, role: 'student' });
        
        // Save User Message
        chatStore.addMessage(userId, {
            id: Date.now().toString(),
            sender: 'user',
            text: message,
            timestamp: new Date()
        });
      }

      // 1. Analyze Intent
      const analysis = await aiIntentAnalyzer.analyze(message);
      
      let responseData = {
        message: analysis.response,
        books: []
      };

      // Check for explicit human request (Simple keyword check for now)
      const lowerMsg = message.toLowerCase();
      if (lowerMsg.includes('gặp nhân viên') || lowerMsg.includes('gặp thủ thư') || lowerMsg.includes('chat với người') || lowerMsg.includes('tư vấn viên')) {
          responseData.message = "Mình đã gửi yêu cầu hỗ trợ đến các thủ thư. Vui lòng đợi trong giây lát, nhân viên sẽ phản hồi bạn ngay tại đây.";
          // In a real app, we would flag this session as 'needs_attention' in DB
      } else {
          // 2. Process based on Intent
          switch (analysis.intent) {
            case 'SEARCH_BOOK':
            case 'CHECK_STATUS':
              // Search Logic
              const searchResult = bookService.searchBooks(analysis.keywords);
              responseData.books = searchResult.books;

              if (searchResult.count > 0) {
                if (analysis.intent === 'CHECK_STATUS') {
                   const book = searchResult.books[0];
                   const status = book.status === 'Available' ? 'có sẵn' : 'đang được mượn';
                   responseData.message = `Sách "${book.title}" hiện đang ${status}.`;
                } else {
                   responseData.message = `Mình tìm thấy ${searchResult.count} cuốn sách phù hợp với từ khóa "${analysis.keywords}":`;
                }
              } else {
                // Alternative Flow A1: No books found
                responseData.message = `Rất tiếc, mình không tìm thấy sách nào với từ khóa "${analysis.keywords}".`;
              }
              break;

            case 'AMBIGUOUS':
              // Alternative Flow A2: Ambiguous Question
              // The AI response already contains the clarification request
              break;

            case 'LIBRARY_INFO':
              // If AI didn't provide a good response, fallback to hardcoded
              if (!responseData.message) {
                responseData.message = "Thư viện mở cửa từ 7:30 đến 21:00 các ngày trong tuần.";
              }
              break;

            case 'GREETING':
            case 'OTHER':
            default:
              // Use the AI's natural response
              break;
          }
      }

      // Save Bot Message
      if (userId) {
        chatStore.addMessage(userId, {
            id: (Date.now() + 1).toString(),
            sender: 'bot',
            text: responseData.message,
            timestamp: new Date()
        });
      }

      // 3. Return Result
      res.json(responseData);

    } catch (error) {
      console.error("Controller Error:", error);
      // Alternative Flow A3: System Error
      res.status(500).json({ 
        message: "Hệ thống đang gặp sự cố. Vui lòng thử lại sau.",
        books: []
      });
    }
  }
}

module.exports = new ChatbotController();
