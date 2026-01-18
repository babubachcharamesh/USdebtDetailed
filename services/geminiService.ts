
import { GoogleGenAI } from "@google/genai";

// Note: GoogleGenAI instance is created inside the function to ensure it uses 
// the latest API_KEY from the environment as per the coding guidelines.
export const getDebtInsight = async (query: string, history: any[]) => {
  // Initialize the Gemini client with the mandated named parameter object.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    // Use gemini-3-pro-preview for complex reasoning and analysis tasks.
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: query,
      config: {
        systemInstruction: "You are 'DebtSage', an expert economist specialized in US National Debt. Answer clearly and accurately using current economic context. Use markdown for lists or emphasis. Provide deep, non-partisan analysis. Keep answers professional but accessible.",
        temperature: 0.7,
        // The thinkingConfig is supported on Gemini 3 series models.
        thinkingConfig: { thinkingBudget: 4000 }
      }
    });

    // Directly access the .text property (not a method) from the GenerateContentResponse.
    return response.text || "I'm sorry, I couldn't generate an analysis right now.";
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    // Standardized error response for UI consumption.
    return "Error: Unable to connect to the financial intelligence network.";
  }
};
