import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { SYSTEM_INSTRUCTION } from '../constants';

export const createChatSession = (): Chat => {
  if (!process.env.API_KEY) {
    console.error("API Key is missing from process.env.API_KEY");
    throw new Error("API Key is missing");
  }

  // Initialize the client inside the function to ensure robust error handling
  // and prevent module-level crashes if the key is undefined during import.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
    },
  });
};

export const sendMessageStream = async (
  chatSession: Chat, 
  message: string,
  imageBase64: string | undefined,
  onChunk: (text: string) => void
): Promise<string> => {
  try {
    let resultStream;

    if (imageBase64) {
      // Extract mimeType and base64 data
      // format: data:image/png;base64,iVBORw0KGgo...
      const matches = imageBase64.match(/^data:(.+);base64,(.+)$/);
      let mimeType = 'image/jpeg'; // Default fallback
      let data = imageBase64;

      if (matches && matches.length === 3) {
        mimeType = matches[1];
        data = matches[2];
      }

      // Construct multimodal message
      const parts = [
        { text: message || " " }, // Ensure text is not empty even if only image is sent
        { inlineData: { mimeType, data } }
      ];

      // Type casting to any to satisfy strict TS checks if necessary, 
      // though standard SDK supports Part[] in message for multimodal.
      resultStream = await chatSession.sendMessageStream({ message: parts });
    } else {
      resultStream = await chatSession.sendMessageStream({ message });
    }
    
    let fullText = '';
    for await (const chunk of resultStream) {
      const c = chunk as GenerateContentResponse;
      const chunkText = c.text || '';
      fullText += chunkText;
      onChunk(chunkText);
    }
    return fullText;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};