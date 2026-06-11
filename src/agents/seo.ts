import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";

export const SeoDataSchema = z.object({
    hashtags: z.array(z.string()).describe("A list of 3-5 relevant, high-performing hashtags"),
    keywords: z.array(z.string()).describe("A list of SEO keywords relevant to the content"),
    bestPostingTime: z.string().describe("Recommended best time/day to post for maximum engagement"),
    platformTip: z.string().describe("A brief, actionable tip for formatting this content on a specific platform (e.g., LinkedIn vs. Twitter)"),
});

export type SeoData = z.infer<typeof SeoDataSchema>;

export async function optimizeSeo(content: string): Promise<SeoData> {
    console.log("\n[SEO Agent] Optimizing content for search and engagement...");

    const { object } = await generateObject({
        model: google('gemini-3.1-flash-lite'),
        temperature: 0.3,
        schema: SeoDataSchema,
        prompt: `
        You are an SEO and Social Media Optimization Agent. 
        Analyze the following marketing content and provide optimization recommendations.
        
        Content to analyze:
        "${content}"
        `
    });

    return object;
}
