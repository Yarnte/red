
import { GoogleGenAI } from "@google/genai";
import { Site, Reading } from '../types';

export const analyzeProductionData = async (site: Site, readings: Reading[]): Promise<string> => {
    if (!process.env.API_KEY) {
        return "API Key not found. Please configure your environment.";
    }

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

        const recentReadings = readings
            .sort((a, b) => b.date.localeCompare(a.date))
            .slice(0, 12);
        
        const readingsCSV = "Month,Production(kWh)\n" + recentReadings.map(r => `${r.date},${r.valueKwh}`).join('\n');

        const prompt = `
            You are an expert solar energy analyst. Analyze the following solar production data for the last 12 months and provide insights.

            Site Information:
            - Name: ${site.name}
            - Island: ${site.island}
            - System Capacity: ${site.capacityKw} kWp
            - Expected Monthly Generation: ${site.expectedMonthlyKwh} kWh

            Production Data (CSV format):
            ${readingsCSV}

            Your analysis should include:
            1.  A brief summary of the overall performance over the last year.
            2.  Identification of any specific months with significant underperformance (below 50% of expected generation).
            3.  Potential reasons for underperformance (e.g., seasonal weather patterns, maintenance issues).
            4.  Actionable recommendations to improve efficiency or investigate issues.

            Present your analysis in a clear, concise, and easy-to-understand format. Use markdown for formatting.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        
        return response.text;
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        if (error instanceof Error) {
            return `An error occurred while analyzing the data: ${error.message}`;
        }
        return "An unknown error occurred while analyzing the data.";
    }
};
