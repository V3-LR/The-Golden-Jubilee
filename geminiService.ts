
import { GoogleGenAI, Type } from "@google/genai";

// Always initialize the Gemini client using the environment variable directly.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export class GeminiService {
  /**
   * Suggests logistical planning based on guest list data.
   */
  async suggestLogistics(guestData: string) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `You are an expert wedding and anniversary planner. Based on the following guest list, suggest a logistical plan including pick-up batches, seating arrangements, and dietary special attention needed. Guest Data: ${guestData}`,
        config: {
          thinkingConfig: { thinkingBudget: 0 }
        }
      });
      // The extracted generated text is available directly via the .text property.
      return response.text;
    } catch (error) {
      console.error("Gemini Error:", error);
      return "The AI is currently resting. Please verify your API key is valid and has enough quota.";
    }
  }

  /**
   * Generates customized menu ideas based on dietary requirements.
   */
  async generateMealIdeas(dietaryNotes: string[]) {
    try {
      const uniqueNotes = [...new Set(dietaryNotes)];
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Create a customized 3-course menu idea for an anniversary gala that accommodates these dietary requirements: ${uniqueNotes.join(', ')}. Format as JSON with "title", "description", and "courses" (array of {name, description}).`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              courses: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    description: { type: Type.STRING }
                  },
                  required: ["name", "description"]
                }
              }
            },
            required: ["title", "description", "courses"]
          }
        }
      });
      // Extract the JSON string from response.text and parse it.
      return JSON.parse(response.text || '{}');
    } catch (error) {
      console.error("Gemini Meal Error:", error);
      return null;
    }
  }
}

export const geminiService = new GeminiService();
