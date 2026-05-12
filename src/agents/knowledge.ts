import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";

export const ContentBriefSchema = z.object({
    coreMessage: z.string(),
    targetAudience: z.string(),
    keyFeatures: z.array(z.string()),
});

export type ContentBrief = z.infer<typeof ContentBriefSchema>;

export async function synthesizeData(rawData: string) {
    console.log("\n[Knowledge Agent] Synthesizing raw enterprise data into a brief...");

    const { object } = await generateObject({
        model: google('gemini-3.1-flash-lite'),
        schema: ContentBriefSchema,
        prompt: `
        You are a Data Intelligence Agent. Analyze the following raw internal documentation 
        and extract the key information needed for a marketing team to announce it.
        
        Raw Internal Data:
        "${rawData}"
        `
    });

    return object;
}