const { GoogleGenerativeAI } = require("@google/generative-ai");
const OpenAI = require("openai");

class AIIntentAnalyzer {
  constructor() {
    // 1. Setup Gemini
    this.geminiKey = process.env.GEMINI_API_KEY;
    if (this.geminiKey) {
      this.genAI = new GoogleGenerativeAI(this.geminiKey);
      this.geminiModel = this.genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      console.log("✅ AI Service: Google Gemini initialized.");
    }

    // 2. Setup OpenAI (ChatGPT)
    this.openaiKey = process.env.OPENAI_API_KEY;
    this.openaiBaseUrl = process.env.OPENAI_BASE_URL; // Optional: for custom endpoints
    if (this.openaiKey) {
      this.openai = new OpenAI({
        apiKey: this.openaiKey,
        baseURL: this.openaiBaseUrl // Defaults to https://api.openai.com/v1
      });
      console.log("✅ AI Service: OpenAI (ChatGPT) initialized.");
    }

    if (!this.geminiKey && !this.openaiKey) {
      console.error("❌ ERROR: No AI API Keys found (GEMINI_API_KEY or OPENAI_API_KEY).");
    }
  }

  /**
   * Analyze the user's message using the available AI provider.
   */
  async analyze(text, context = "") {
    const systemPrompt = `
      You are a library assistant for "DTU LibBot". 
      
      Context Information (Use this to answer if relevant):
      ${context}

      Analyze the user's message: "${text}".
      
      Return a JSON object with:
      - "intent": One of ["SEARCH_BOOK", "CHECK_STATUS", "LIBRARY_INFO", "GREETING", "OTHER", "AMBIGUOUS"]
      - "keywords": A string of keywords for search (if SEARCH_BOOK or CHECK_STATUS). If none, use empty string.
      - "response": A natural language response in Vietnamese.
        - If the user asks a question found in the Context, answer it directly using that information.
        - If GREETING, say hello warmly.
        - If LIBRARY_INFO, provide info based on context or general knowledge.
        - If OTHER or AMBIGUOUS, try to answer if context permits, otherwise ask for clarification.
      
      Rules:
      - ALWAYS respond in Vietnamese.
      - If user asks about library hours, location, or rules -> LIBRARY_INFO.
      - If user says hello/hi -> GREETING.
      - If user asks for a book by name, author, or category -> SEARCH_BOOK.
      - If user asks if a book is available -> CHECK_STATUS.
      
      Example JSON: { "intent": "SEARCH_BOOK", "keywords": "Clean Code", "response": "" }
    `;

    try {
      // Priority: OpenAI > Gemini
      if (this.openaiKey) {
        console.log("Using OpenAI for analysis...");
        return await this.analyzeWithOpenAI(systemPrompt, text);
      } else if (this.geminiKey) {
        console.log("Using Gemini for analysis...");
        return await this.analyzeWithGemini(systemPrompt);
      } else {
        console.error("No AI provider configured.");
        throw new Error("No AI provider configured.");
      }
    } catch (error) {
      console.error("AI Analysis Error Detailed:", error);
      return {
        intent: "OTHER",
        keywords: "",
        response: "" // Empty response allows Controller to try fallback
      };
    }
  }

  async analyzeWithGemini(prompt) {
    try {
      const result = await this.geminiModel.generateContent(prompt);
      const responseText = result.response.text();
      console.log("Gemini Raw Response:", responseText);
      return this.parseJSON(responseText);
    } catch (e) {
      console.error("Gemini Generation Error:", e);
      throw e;
    }
  }

  async analyzeWithOpenAI(systemPrompt, userText) {
    try {
      const completion = await this.openai.chat.completions.create({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userText }
        ],
        model: "gpt-3.5-turbo", // Or gpt-4o if available
        response_format: { type: "json_object" }
      });
      const responseText = completion.choices[0].message.content;
      console.log("OpenAI Raw Response:", responseText);
      return this.parseJSON(responseText);
    } catch (e) {
      console.error("OpenAI Generation Error:", e);
      throw e;
    }
  }

  parseJSON(text) {
    try {
      const jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(jsonString);
    } catch (e) {
      console.error("Failed to parse JSON from AI:", text);
      return { intent: "OTHER", keywords: "", response: text }; // Return raw text as response if JSON fails
    }
  }
}

module.exports = new AIIntentAnalyzer();
