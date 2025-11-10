import { GoogleGenAI, Type } from "@google/genai";

// Define the structure of the response we expect from the AI
export interface Scene {
  visual: string;
  voiceover: string;
  onScreenText: string;
}

export interface VideoScript {
  platform: string;
  title: string;
  hook: string;
  scenes: Scene[];
}

export async function generateVideoScripts(topic: string): Promise<VideoScript[]> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `Based on the following topic, generate 3 engaging short-form video scripts, one each for TikTok, YouTube Shorts, and Instagram Reels.

Topic: "${topic}"

Provide a catchy title, a strong 3-second hook, and a sequence of scenes for each. For every scene, describe the visuals, the voiceover/dialogue, and any on-screen text. Ensure the scripts are tailored to the style of each platform.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro', // Using a more powerful model for creative, structured output
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          description: "A list of video scripts for different platforms.",
          items: {
            type: Type.OBJECT,
            properties: {
              platform: {
                type: Type.STRING,
                description: "The target platform (e.g., 'TikTok', 'YouTube Short', 'Instagram Reel').",
              },
              title: {
                type: Type.STRING,
                description: "A catchy, viral-style title for the video.",
              },
              hook: {
                type: Type.STRING,
                description: "A strong opening hook to grab attention in the first 3 seconds.",
              },
              scenes: {
                type: Type.ARRAY,
                description: "A sequence of scenes that make up the video.",
                items: {
                  type: Type.OBJECT,
                  properties: {
                    visual: {
                      type: Type.STRING,
                      description: "A clear description of the visuals for this scene.",
                    },
                    voiceover: {
                      type: Type.STRING,
                      description: "The voiceover script or dialogue for this scene.",
                    },
                    onScreenText: {
                      type: Type.STRING,
                      description: "Any text overlay to display during this scene. Use 'N/A' if none.",
                    },
                  },
                  required: ["visual", "voiceover", "onScreenText"],
                },
              },
            },
            required: ["platform", "title", "hook", "scenes"],
          },
        },
      },
    });

    const jsonText = response.text.trim();
    if (!jsonText) {
        throw new Error("Received an empty response from the AI. The content might have been blocked.");
    }

    const scripts: VideoScript[] = JSON.parse(jsonText);
    return scripts;
  } catch (error) {
    console.error("Error generating video scripts:", error);
    if (error instanceof Error) {
        if (error.message.includes('SAFETY')) {
            throw new Error("Your topic was blocked by safety settings. Please modify it and try again.");
        }
        if (error.message.includes('JSON')) {
             throw new Error("The AI returned an invalid format. Please try again.");
        }
        throw new Error(`Failed to generate scripts: ${error.message}`);
    }
    throw new Error("An unknown error occurred during script generation.");
  }
}
