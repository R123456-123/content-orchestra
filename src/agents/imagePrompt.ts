import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";

export const ImagePromptSchema = z.object({
    imagePrompt: z.string().describe("A highly detailed prompt for an AI image generator (e.g., Midjourney/Stable Diffusion)"),
    style: z.string().describe("The visual style (e.g., 3D isometric, minimalist vector, cinematic photography)"),
    colorPalette: z.array(z.string()).describe("A list of 3-4 recommended hex codes or color names"),
    mood: z.string().describe("The overall mood or atmosphere of the image"),
});

export type ImagePromptData = z.infer<typeof ImagePromptSchema>;

export async function generateImagePrompt(content: string): Promise<ImagePromptData> {
    console.log("\n[Image Prompt Agent] Designing visual assets...");

    const { object } = await generateObject({
        model: google('gemini-3.1-flash-lite'),
        temperature: 0.5,
        schema: ImagePromptSchema,
        prompt: `
        You are an AI Art Director.
        Create a detailed prompt to generate an accompanying image for the following marketing content.
        
        The prompt should be highly descriptive, focusing on subject, lighting, style, and composition, 
        optimized for image generators like Stable Diffusion or Midjourney.
        
        Marketing Content:
        "${content}"
        `
    });

    return object;
}
