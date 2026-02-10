
import { GoogleGenAI, Type } from "@google/genai";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    // Initializing with the required named parameter and direct environment variable access.
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async suggestLogistics(guestData: string) {
    const response = await this.ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are an expert wedding and anniversary planner. Based on the following guest list, suggest a logistical plan including pick-up batches, seating arrangements, and dietary special attention needed. Guest Data: ${guestData}`,
      config: {
        thinkingConfig: { thinkingBudget: 0 }
      }
    });
    return response.text;
  }

  async generateMealIdeas(dietaryNotes: string[]) {
    const uniqueNotes = [...new Set(dietaryNotes)];
    const response = await this.ai.models.generateContent({
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
    return JSON.parse(response.text || '{}');
  }
}

export const geminiService = new GeminiService();
