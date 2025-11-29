const { GoogleGenerativeAI } = require("@google/generative-ai");

class AIIntentAnalyzer {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
  }

  /**
   * Analyze the user's message to extract intent and keywords.
   * @param {string} text - The user's message.
   * @returns {Promise<Object>} - { intent, keywords, response }
   */
  async analyze(text) {
    const prompt = `
      You are a library assistant for "DTU LibBot". Analyze the user's message: "${text}".
      Return a JSON object with:
      - "intent": One of ["SEARCH_BOOK", "CHECK_STATUS", "LIBRARY_INFO", "GREETING", "OTHER", "AMBIGUOUS"]
      - "keywords": A string of keywords for search (if SEARCH_BOOK or CHECK_STATUS). If none, use empty string.
      - "response": A natural language response (if GREETING, LIBRARY_INFO, OTHER, or AMBIGUOUS).
      
      Rules:
      - If user asks about library hours, location, or rules -> LIBRARY_INFO.
      - If user says hello/hi -> GREETING.
      - If user asks for a book by name, author, or category -> SEARCH_BOOK.
      - If user asks if a book is available -> CHECK_STATUS.
      - If the request is unclear or lacks specific details for a search -> AMBIGUOUS (ask for clarification).
      - If unsure -> OTHER.
      
      Example JSON: { "intent": "SEARCH_BOOK", "keywords": "Clean Code", "response": "" }
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const responseText = result.response.text();
      
      // Clean up JSON string
      const jsonString = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(jsonString);
    } catch (error) {
      console.error("AI Analysis Error:", error);
      // Fallback for AI failure
      return { 
        intent: "OTHER", 
        keywords: "", 
        response: "Xin lỗi, hệ thống đang bận. Bạn vui lòng thử lại sau." 
      };
    }
  }
}

module.exports = new AIIntentAnalyzer();
