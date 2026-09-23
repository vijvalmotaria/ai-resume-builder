import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const MODEL_NAME = 'gemini-2.5-flash';

const generateContent = async (prompt) => {
  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });
    const text = typeof response.text === 'function' ? response.text() : response.text;
    return text;
  } catch (error) {
    console.error('Gemini API error:', error.message);
    throw new Error('AI service temporarily unavailable. Please try again.');
  }
};

export { generateContent, ai, MODEL_NAME };
