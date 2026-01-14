
import { GoogleGenAI, GenerateContentResponse, Type, Modality } from "@google/genai";
import { ImageFile, AudioFile } from "../types";

/**
 * Initialize the Google GenAI client.
 * Always use process.env.API_KEY directly.
 */
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

/**
 * Basic text assistant for note summarization and brainstorming.
 */
export async function askNoteAssistant(prompt: string): Promise<string> {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      systemInstruction: `You are Memora AI, a helpful assistant integrated into a modern note-taking app. 
      You specialize in summarizing notes, brainstorming ideas, and organizing chaotic thoughts into clear lists or paragraphs.
      Keep responses concise and professional.`,
    },
  });

  return response.text?.trim() || '';
}

/**
 * Analyzes a style reference image to provide a textual description of its aesthetic.
 */
export async function analyzeStyleImage(image: ImageFile): Promise<string> {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        { inlineData: { data: image.base64, mimeType: image.mimeType } },
        { text: "Describe the artistic style, mood, lighting, and color palette of this image in one concise sentence." }
      ]
    }
  });
  return response.text?.trim() || '';
}

/**
 * Translates prompt text to English to ensure better compatibility with image generation models.
 */
export async function translateText(text: string): Promise<string> {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Translate the following text to English, maintaining the original meaning and tone: "${text}"`,
  });
  return response.text?.trim() || '';
}

/**
 * Generates an image based on product references, a prompt, and an optional style reference.
 * Uses the gemini-2.5-flash-image model.
 */
export async function generateImage(productImages: ImageFile[], prompt: string, styleImage: ImageFile | null): Promise<ImageFile> {
  const parts: any[] = [{ text: prompt }];
  
  productImages.forEach(img => {
    parts.push({ inlineData: { data: img.base64, mimeType: img.mimeType } });
  });
  
  if (styleImage) {
    parts.push({ text: "Use the following image as a style reference:" });
    parts.push({ inlineData: { data: styleImage.base64, mimeType: styleImage.mimeType } });
  }

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: { parts }
  });

  const imagePart = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
  if (!imagePart || !imagePart.inlineData) {
    throw new Error("No image generated.");
  }

  return {
    base64: imagePart.inlineData.data,
    mimeType: imagePart.inlineData.mimeType,
    name: `generated-${Date.now()}.png`
  };
}

/**
 * Edits an existing image based on a prompt.
 * Uses the gemini-2.5-flash-image model.
 */
export async function editImage(image: ImageFile, prompt: string): Promise<ImageFile> {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        { inlineData: { data: image.base64, mimeType: image.mimeType } },
        { text: prompt }
      ]
    }
  });

  const imagePart = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
  if (!imagePart || !imagePart.inlineData) {
    throw new Error("Editing failed.");
  }

  return {
    base64: imagePart.inlineData.data,
    mimeType: imagePart.inlineData.mimeType,
    name: `edited-${Date.now()}.png`
  };
}

/**
 * Analyzes provided images to generate a descriptive prompt for image creation.
 */
export async function analyzeImageForPrompt(images: ImageFile[], instructions: string): Promise<string> {
  const parts: any[] = images.map(img => ({ inlineData: { data: img.base64, mimeType: img.mimeType } }));
  parts.push({ text: `Analyze these images and generate a highly detailed image generation prompt. ${instructions ? `Incorporate these instructions: ${instructions}` : ''}` });

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: { parts }
  });
  return response.text?.trim() || '';
}

/**
 * Generates an image prompt from a text idea.
 */
export async function generatePromptFromText(instructions: string): Promise<string> {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate a detailed, creative image generation prompt based on this idea: "${instructions}"`,
  });
  return response.text?.trim() || '';
}

/**
 * Analyzes a logo to extract its color palette for branding purposes.
 */
export async function analyzeLogoForBranding(logo: ImageFile): Promise<{ colors: string[] }> {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        { inlineData: { data: logo.base64, mimeType: logo.mimeType } },
        { text: "Extract the primary color palette from this logo. Return only a JSON array of hex codes." }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          colors: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["colors"]
      }
    }
  });

  const text = response.text || '{"colors": []}';
  try {
    return JSON.parse(text);
  } catch {
    return { colors: [] };
  }
}

/**
 * Generates speech from text using the gemini-2.5-flash-preview-tts model.
 */
export async function generateSpeech(text: string, style: string, voice: string): Promise<AudioFile> {
  const prompt = style ? `${style}: ${text}` : text;
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: prompt }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: voice || 'Kore' },
        },
      },
    },
  });

  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!base64Audio) {
    throw new Error("Speech generation failed.");
  }

  return {
    base64: base64Audio,
    mimeType: 'audio/pcm'
  };
}

/**
 * Provides a detailed product analysis for campaign strategy.
 */
export async function analyzeProductForCampaign(images: ImageFile[]): Promise<string> {
  const parts: any[] = images.map(img => ({ inlineData: { data: img.base64, mimeType: img.mimeType } }));
  parts.push({ text: "Provide a detailed analysis of this product for a social media marketing campaign. Focus on its key features, target audience, and unique selling points." });

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: { parts }
  });
  return response.text?.trim() || '';
}

/**
 * Expands an image by filling the canvas using generative fill.
 */
export async function expandImage(image: ImageFile, prompt: string): Promise<ImageFile> {
  return editImage(image, `Expand this image by filling the canvas. ${prompt}`);
}
