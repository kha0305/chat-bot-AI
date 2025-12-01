require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function listModels() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    try {
        // Note: The SDK might not expose listModels directly on the main class in all versions, 
        // but let's try to see if we can just try a known working model like 'gemini-pro' again or 'gemini-1.0-pro'.

        // Actually, let's just try 'gemini-pro' again to see if it works.
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent("test");
        console.log("gemini-pro works");
    } catch (e) {
        console.log("gemini-pro failed:", e.message);
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-001" });
        const result = await model.generateContent("test");
        console.log("gemini-1.5-flash-001 works");
    } catch (e) {
        console.log("gemini-1.5-flash-001 failed:", e.message);
    }
}

listModels();
