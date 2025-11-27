import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AIResponse } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Define the schema for structured output
const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    markdown: {
      type: Type.STRING,
      description: "A comprehensive, markdown-formatted explanation of the topic. Use headers, lists, and bold text.",
    },
    relatedConcepts: {
      type: Type.ARRAY,
      description: "A list of 3 to 6 key concepts, entities, or sub-topics related to the query for visualization.",
      items: {
        type: Type.OBJECT,
        properties: {
          topic: { type: Type.STRING, description: "The name of the concept (max 3 words)." },
          description: { type: Type.STRING, description: "A very brief 1-sentence definition." },
          connectionType: { type: Type.STRING, description: "How it connects to the main topic (e.g., 'Component of', 'Influenced by')." },
        },
        required: ["topic", "description", "connectionType"],
      },
    },
  },
  required: ["markdown", "relatedConcepts"],
};

export const generateKnowledge = async (prompt: string): Promise<AIResponse> => {
  try {
    const model = "gemini-2.5-flash";
    
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        systemInstruction: "You are Nexus, an advanced academic research assistant. Your goal is to explain complex topics clearly and identify the structural relationships between concepts. Always analyze the user query to build a knowledge graph structure.",
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.3, // Lower temperature for more consistent structural output
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as AIResponse;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};