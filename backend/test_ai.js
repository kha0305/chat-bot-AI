require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function testGemini() {
    console.log("Testing Gemini Connection...");
    console.log("Key present:", !!process.env.GEMINI_API_KEY);

    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = "Hello, are you working?";
        console.log("Sending prompt:", prompt);

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        console.log("Response received:", text);
        console.log("✅ Gemini is working!");
    } catch (error) {
        console.error("❌ Gemini Error:", error);
    }
}

testGemini();
