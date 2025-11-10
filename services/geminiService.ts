
import { GoogleGenAI } from "@google/genai";

export async function generateImage(prompt: string): Promise<string> {
  // The API key is automatically sourced from the environment variable `process.env.API_KEY`
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: prompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/jpeg',
        // The example image has a portrait orientation, 9:16 is a suitable aspect ratio.
        aspectRatio: '9:16',
      },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
      return base64ImageBytes;
    } else {
      // This case can happen if the response is blocked due to safety settings or other reasons.
      throw new Error("No image was generated. The response may have been blocked or empty.");
    }
  } catch (error) {
    console.error("Error generating image:", error);
    if (error instanceof Error) {
        if (error.message.includes('SAFETY')) {
            throw new Error("The prompt was blocked by safety settings. Please modify your prompt and try again.");
        }
        throw new Error(`Failed to generate image: ${error.message}`);
    }
    throw new Error("An unknown error occurred during image generation.");
  }
}
