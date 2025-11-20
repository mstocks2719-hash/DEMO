import { GoogleGenAI, Type, Modality } from "@google/genai";
import { GeneratedImageResult, StrategyResponse } from "../types";

// Initialize the Gemini client
// The API Key is injected by Vite during the build process from the environment variables
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateCampaignStrategy = async (
  topic: string,
  audience: string,
  tone: string,
  platform: string
): Promise<StrategyResponse> => {
  
  const prompt = `
    Act as a world-class social media marketing expert.
    Create a mini-campaign strategy for the platform: ${platform}.
    
    Topic/Product: ${topic}
    Target Audience: ${audience}
    Tone of Voice: ${tone}
    
    Generate 3 distinct social media posts.
    For each post, provide:
    1. A catchy headline (hook).
    2. The caption body text (optimized for ${platform}).
    3. Relevant hashtags.
    4. A highly detailed image generation prompt that describes the visual to accompany the post.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          campaignTitle: {
            type: Type.STRING,
            description: "A catchy name for this marketing campaign",
          },
          posts: {
            type: Type.ARRAY,
            description: "List of 3 generated posts",
            items: {
              type: Type.OBJECT,
              properties: {
                headline: { type: Type.STRING },
                body: { type: Type.STRING },
                hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
                imagePrompt: { type: Type.STRING, description: "A detailed physical description of the image to generate, including style, lighting, and subject." },
              },
              required: ["headline", "body", "hashtags", "imagePrompt"],
            },
          },
        },
        required: ["campaignTitle", "posts"],
      },
    },
  });

  if (!response.text) {
    throw new Error("No response from Gemini");
  }

  return JSON.parse(response.text) as StrategyResponse;
};

export const generateImage = async (prompt: string): Promise<GeneratedImageResult> => {
  try {
    // Using Gemini Flash Image (Nano Banana) for generation
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            {
              text: prompt + " high quality, photorealistic, professional photography, 4k",
            },
          ],
        },
        config: {
            responseModalities: [Modality.IMAGE],
        },
      });
      
      const part = response.candidates?.[0]?.content?.parts?.[0];
      
      if (part && part.inlineData && part.inlineData.data) {
        return {
            mimeType: part.inlineData.mimeType || 'image/png',
            base64: part.inlineData.data
        };
      }
      throw new Error("No image data returned");
  } catch (error) {
    console.error("Image generation error:", error);
    throw error;
  }
};