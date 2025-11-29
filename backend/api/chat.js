const { GoogleGenerativeAI } = require("@google/generative-ai");
const store = require('../store');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

module.exports = async (req, res) => {
  try {
    const { message } = req.body;
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // 1. Analyze Intent
    const prompt = `
      You are a library assistant for "DTU LibBot". Analyze the user's message: "${message}".
      Return a JSON object with:
      - "intent": One of ["SEARCH_BOOK", "CHECK_STATUS", "LIBRARY_INFO", "GREETING", "OTHER"]
      - "keywords": A string of keywords for search (if SEARCH_BOOK or CHECK_STATUS)
      - "response": A natural language response (if GREETING, LIBRARY_INFO, or OTHER)
      
      Rules:
      - If user asks about library hours, location, or rules -> LIBRARY_INFO.
      - If user says hello/hi -> GREETING.
      - If user asks for a book by name, author, or category -> SEARCH_BOOK.
      - If user asks if a book is available -> CHECK_STATUS.
      - If unsure -> OTHER (and ask for clarification).
      
      Example JSON: { "intent": "SEARCH_BOOK", "keywords": "Clean Code", "response": "" }
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Clean up JSON string (sometimes Gemini adds markdown code blocks)
    const jsonString = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    let analysis;
    
    try {
      analysis = JSON.parse(jsonString);
    } catch (e) {
      console.error("Failed to parse AI response:", responseText);
      // Fallback
      analysis = { intent: "OTHER", response: "Xin lỗi, mình chưa hiểu ý bạn. Bạn có thể nói rõ hơn không?" };
    }

    // 2. Process Intent
    let responseData = {
      message: analysis.response,
      books: []
    };

    if (analysis.intent === 'SEARCH_BOOK' || analysis.intent === 'CHECK_STATUS') {
      const keywords = analysis.keywords.toLowerCase();
      const foundBooks = store.books.filter(b => 
        b.title.toLowerCase().includes(keywords) || 
        b.author.toLowerCase().includes(keywords) ||
        b.category.toLowerCase().includes(keywords)
      );

      responseData.books = foundBooks;
      
      if (foundBooks.length > 0) {
        if (analysis.intent === 'CHECK_STATUS') {
           const status = foundBooks[0].status === 'Available' ? 'có sẵn' : 'đang được mượn';
           responseData.message = `Sách "${foundBooks[0].title}" hiện đang ${status}.`;
        } else {
           responseData.message = `Mình tìm thấy ${foundBooks.length} cuốn sách phù hợp với từ khóa "${analysis.keywords}":`;
        }
      } else {
        responseData.message = `Rất tiếc, mình không tìm thấy sách nào với từ khóa "${analysis.keywords}".`;
      }
    } else if (analysis.intent === 'LIBRARY_INFO') {
        // Override AI response with hardcoded accurate info if needed, or trust AI
        if (!responseData.message) {
            responseData.message = "Thư viện mở cửa từ 7:30 đến 21:00 các ngày trong tuần. Bạn cần thẻ sinh viên để vào thư viện.";
        }
    }

    res.json(responseData);

  } catch (error) {
    console.error("Chat Error:", error);
    res.status(500).json({ message: "Lỗi hệ thống, vui lòng thử lại sau." });
  }
};
