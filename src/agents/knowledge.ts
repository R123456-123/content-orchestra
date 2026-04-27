import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";

export const ContentBriefSchema = z.object({
    coreMessage: z.string().describe("The main takeaway or announcement"),
    targetAudience: z.string().describe("Who this content is specifically for"),
    keyFeatures: z.array(z.string()).describe("List of 2-3 main features or benefits"),
});

export type ContentBrief = z.infer<typeof ContentBriefSchema>;

export async function synthesizeData(rawData: string) {
    console.log("\n[Knowledge Agent] Synthesizing raw enterprise data into a brief...");

    const { object } = await generateObject({
        model: google('gemini-2.5-flash-lite'),
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