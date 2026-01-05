import { GoogleGenAI } from "@google/genai";

// Note: In a real production app, we would proxy this through a backend to protect the API key.
// For this client-side demo, we assume the environment variable is available.
const apiKey = process.env.API_KEY || ''; 
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const generateProductDescription = async (title: string, category: string): Promise<string> => {
  if (!ai) return "No API Key provided. Please set REACT_APP_GEMINI_API_KEY (or similiar) to use AI features.";
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "Write a short, attractive 2-sentence description for a used item being sold on a campus marketplace. " +
      `Item: ${title}. Category: ${category}. ` +
      "Tone: Friendly, student-focused.",
    });
    return response.text || "Description unavailable.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Great condition, must see!";
  }
};

export const generateSystemNotification = async (action: string, itemName: string): Promise<string> => {
    if (!ai) return `System Alert: ${action} - ${itemName}`;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: "Generate a short polite system notification message for a user. " +
            `Context: The admin has performed action "${action}" on their item "${itemName}".`
        });
        return response.text || `Your item ${itemName} has been updated: ${action}`;
    } catch {
        return `Your item ${itemName} has been updated: ${action}`;
    }
}