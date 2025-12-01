const db = require('../config/db');
const aiIntentAnalyzer = require('../services/AIIntentAnalyzer');

class ChatbotController {

  async processMessage(req, res) {
    try {
      const { message, userId, userName } = req.body;

      // 1. Fetch Context (FAQs)
      let context = "";
      try {
        // Fetch all FAQs (optimize this in production with vector search)
        const [faqs] = await db.execute('SELECT cau_hoi, cau_tra_loi FROM faq');

        if (faqs.length > 0) {
          // Simple Keyword Filtering to select relevant FAQs
          // This ensures we pass the most relevant "chunks" to the AI context window
          const userKeywords = message.toLowerCase().split(' ').filter(w => w.length > 2);

          const relevantFaqs = faqs.map(faq => {
            let score = 0;
            const qLower = faq.cau_hoi.toLowerCase();
            userKeywords.forEach(kw => {
              if (qLower.includes(kw)) score++;
            });
            return { ...faq, score };
          })
            .filter(f => f.score > 0) // Only keep FAQs with at least one keyword match
            .sort((a, b) => b.score - a.score) // Sort by relevance
            .slice(0, 20); // Take top 20 most relevant

          // If no keywords matched, maybe take a few random general ones or just empty
          // But usually, if no match, context is empty, which is fine.

          if (relevantFaqs.length > 0) {
            context += "FAQs:\n" + relevantFaqs.map(f => `Q: ${f.cau_hoi}\nA: ${f.cau_tra_loi}`).join("\n\n");
          }
        }
      } catch (dbError) {
        console.error("Failed to fetch FAQs:", dbError);
      }

      // 2. Analyze Intent with Context
      let analysis = { intent: 'OTHER', keywords: '', response: '' };
      try {
        analysis = await aiIntentAnalyzer.analyze(message, context);
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
            if (analysis.keywords) {
              const [books] = await db.execute(
                `SELECT * FROM sach WHERE tieu_de LIKE ? OR tac_gia LIKE ? LIMIT 5`,
                [`%${analysis.keywords}%`, `%${analysis.keywords}%`]
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
                  // Check if user asked for quantity
                  if (message.toLowerCase().includes('bao nhiêu') || message.toLowerCase().includes('số lượng')) {
                    responseData.message = `Hiện tại thư viện có ${books.length} đầu sách liên quan đến "${analysis.keywords}". Dưới đây là danh sách:`;
                  } else {
                    responseData.message = `Mình tìm thấy ${books.length} cuốn sách phù hợp với từ khóa "${analysis.keywords}":`;
                  }
                }
              } else {
                // If AI didn't provide a response already (it might have answered from context), fallback
                if (!responseData.message || responseData.message.includes("Xin lỗi")) {
                  responseData.message = `Rất tiếc, mình không tìm thấy sách nào với từ khóa "${analysis.keywords}". Bạn thử tìm từ khóa khác xem sao nhé!`;
                }
              }
            }
            break;

          case 'LIBRARY_INFO':
            if (!responseData.message) {
              responseData.message = "Thư viện mở cửa từ 7:30 đến 21:00 các ngày trong tuần (Thứ 2 - Thứ 7). Bạn cần mang theo thẻ sinh viên để vào cổng.";
            }
            break;

          case 'GREETING':
            if (!responseData.message) {
              responseData.message = "Xin chào! Mình là LibBot. Mình có thể giúp bạn tra cứu sách, kiểm tra tình trạng sách hoặc giải đáp quy định thư viện.";
            }
            break;

          case 'RATE_BOT':
            responseData.message = "Cảm ơn bạn đã đánh giá! Ý kiến của bạn giúp mình thông minh hơn mỗi ngày. ❤️";
            break;

          default:
            // Fallback keyword matching if AI intent is OTHER
            const lowerMsg = message.toLowerCase();
            // Fix: 'sao' is too common (e.g., "Làm sao"). Only check for explicit rating context.
            if (lowerMsg.includes('đánh giá') || (lowerMsg.includes('sao') && lowerMsg.includes('5')) || lowerMsg.includes('tệ quá') || lowerMsg.includes('tuyệt vời')) {
              responseData.message = "Cảm ơn bạn đã phản hồi! Mình sẽ cố gắng hoàn thiện hơn.";
            } else if (!responseData.message) {
              // If AI failed to generate a response, try to find a match in FAQs manually as a last resort
              try {
                // 1. Try exact match or containment
                let [faqs] = await db.execute('SELECT cau_hoi, cau_tra_loi FROM faq WHERE cau_hoi LIKE ? LIMIT 1', [`%${message}%`]);

                // 2. If no match, try splitting keywords (simple full-text simulation)
                if (faqs.length === 0) {
                  const keywords = message.split(' ').filter(w => w.length > 3); // Filter short words
                  if (keywords.length > 0) {
                    // Construct a query like: cau_hoi LIKE ? AND cau_hoi LIKE ?
                    // Note: AND might be too strict, OR might be too loose. Let's try OR with a limit
                    const conditions = keywords.map(() => 'cau_hoi LIKE ?').join(' OR ');
                    const params = keywords.map(w => `%${w}%`);
                    const [looseFaqs] = await db.execute(`SELECT cau_hoi, cau_tra_loi FROM faq WHERE ${conditions} LIMIT 1`, params);
                    if (looseFaqs.length > 0) {
                      faqs = looseFaqs;
                    }
                  }
                }

                if (faqs.length > 0) {
                  responseData.message = faqs[0].cau_tra_loi;
                } else {
                  responseData.message = "Xin lỗi, mình chưa hiểu ý bạn. Bạn có thể hỏi về sách, số lượng sách, hoặc quy định thư viện.";
                }
              } catch (e) {
                console.error("Fallback search error:", e);
                responseData.message = "Xin lỗi, mình chưa hiểu ý bạn. Bạn có thể hỏi về sách, số lượng sách, hoặc quy định thư viện.";
              }
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
