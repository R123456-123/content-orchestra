import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";

export const VideoScriptSchema = z.object({
    hook: z.string().describe("A compelling 3-5 second hook to grab attention"),
    body: z.string().describe("The main message or talking points"),
    callToAction: z.string().describe("A strong closing CTA"),
    estimatedDuration: z.string().describe("Estimated length in seconds (e.g., '15s', '30s')"),
    platform: z.enum(["TikTok", "Instagram Reel", "YouTube Short"]).describe("The recommended short-form video platform"),
});

export type VideoScriptData = z.infer<typeof VideoScriptSchema>;

export async function generateVideoScript(content: string): Promise<VideoScriptData> {
    console.log("\n[Video Script Agent] Adapting content for short-form video...");

    const { object } = await generateObject({
        model: google('gemini-3.1-flash-lite'),
        temperature: 0.4,
        schema: VideoScriptSchema,
        prompt: `
        You are a Short-Form Video Producer.
        Adapt the following written marketing content into a punchy script for a vertical video format
        (TikTok, Reels, or Shorts).
        
        The script should have a strong hook, concise body, and clear CTA.
        
        Source Content:
        "${content}"
        `
    });

    return object;
}
