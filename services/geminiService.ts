import { GoogleGenAI, Type } from "@google/genai";
import { ActionLog, MetricImpact, ScenarioResult } from '../types';

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Helper to get today's date for context
const getContextDate = () => new Date().toISOString().split('T')[0];

export const verifyActionImpact = async (description: string): Promise<{ metrics: MetricImpact; aiAnalysis: any }> => {
  const model = "gemini-2.5-flash";
  
  const systemInstruction = `
    You are GreenLens AI, an enterprise sustainability verification engine.
    Your job is to analyze descriptions of sustainability actions and estimate their quantitative impact.
    
    Principles:
    1. Be conservative in estimates to avoid greenwashing.
    2. Provide scientific reasoning for every number.
    3. Return a confidence score based on the vagueness of the input.
    4. If exact numbers aren't possible, use standard averages for the US/EU region.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: `Analyze this sustainability action taken on ${getContextDate()}: "${description}". Estimate the environmental impact.`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            metrics: {
              type: Type.OBJECT,
              properties: {
                co2_kg: { type: Type.NUMBER, description: "Estimated CO2e reduction in kg" },
                water_liters: { type: Type.NUMBER, description: "Estimated water conserved in liters" },
                waste_kg: { type: Type.NUMBER, description: "Estimated waste diverted in kg" }
              },
              required: ["co2_kg", "water_liters", "waste_kg"]
            },
            aiAnalysis: {
              type: Type.OBJECT,
              properties: {
                confidence_score: { type: Type.NUMBER, description: "0 to 100 confidence in the estimate" },
                reasoning: { type: Type.STRING, description: "Explanation of how the numbers were derived" },
                methodology: { type: Type.STRING, description: "The formula or standard used (e.g., EPA conversion factors)" },
                sources: { 
                  type: Type.ARRAY, 
                  items: { type: Type.STRING },
                  description: "Potential sources or standards cited" 
                }
              },
              required: ["confidence_score", "reasoning", "methodology", "sources"]
            }
          },
          required: ["metrics", "aiAnalysis"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
    throw new Error("No response from AI");
  } catch (error) {
    console.error("Error verifying action:", error);
    // Fallback for demo purposes if API fails or quota exceeded
    return {
      metrics: { co2_kg: 0, water_liters: 0, waste_kg: 0 },
      aiAnalysis: {
        confidence_score: 0,
        reasoning: "AI Service unavailable. Please check API Key.",
        methodology: "System Error",
        sources: []
      }
    };
  }
};

export const runPredictiveScenario = async (
  currentMetrics: MetricImpact, 
  scenarioDescription: string
): Promise<ScenarioResult> => {
  const model = "gemini-2.5-flash";

  const systemInstruction = `
    You are the GreenLens Predictive Advisor.
    Analyze the current sustainability metrics of an organization and simulate a "What-If" scenario.
    Provide projected metrics and strategic recommendations.
  `;

  const prompt = `
    Current Annualized Metrics:
    - CO2: ${currentMetrics.co2_kg} kg
    - Water: ${currentMetrics.water_liters} L
    - Waste: ${currentMetrics.waste_kg} kg

    Scenario to Simulate: "${scenarioDescription}"

    Calculate the projected new annual metrics and the percentage change.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            scenarioName: { type: Type.STRING },
            projectedMetrics: {
              type: Type.OBJECT,
              properties: {
                co2_kg: { type: Type.NUMBER },
                water_liters: { type: Type.NUMBER },
                waste_kg: { type: Type.NUMBER }
              },
              required: ["co2_kg", "water_liters", "waste_kg"]
            },
            impactChange: {
              type: Type.OBJECT,
              properties: {
                co2_percent: { type: Type.NUMBER, description: "Percentage change (negative for reduction)" },
                water_percent: { type: Type.NUMBER },
                waste_percent: { type: Type.NUMBER }
              },
              required: ["co2_percent", "water_percent", "waste_percent"]
            },
            analysis: { type: Type.STRING, description: "Detailed analysis of the simulation" },
            recommendations: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["scenarioName", "projectedMetrics", "impactChange", "analysis", "recommendations"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
    throw new Error("No response from AI");
  } catch (error) {
    console.error("Error running prediction:", error);
    throw error;
  }
};

export const generateNudges = async (history: ActionLog[]): Promise<string[]> => {
    const model = "gemini-2.5-flash";
    // Lightweight call to get quick nudges
    const prompt = `
      Based on these recent sustainability actions:
      ${history.slice(0, 5).map(h => `- ${h.description} (${h.metrics.co2_kg}kg CO2 saved)`).join('\n')}
      
      Generate 3 short, motivating, behavioral nudges to encourage further improvement for an enterprise employee.
      Return as a simple JSON array of strings.
    `;

    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        }
      });
      if (response.text) return JSON.parse(response.text);
      return ["Keep up the good work!", "Try carpooling next week.", "Check for leaky faucets."];
    } catch (e) {
      return ["Reduce, Reuse, Recycle.", "Every bit counts.", "Think green."];
    }
}
