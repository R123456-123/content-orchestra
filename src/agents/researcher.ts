import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";

export const ResearchBriefSchema = z.object({
    industry: z.string().describe("The industry or sector this content is about"),
    competitors: z.array(z.string()).describe("Key competitors or alternative solutions mentioned or implied"),
    trendingTopics: z.array(z.string()).describe("Current trending topics relevant to this content"),
    contentAngle: z.string().describe("The recommended angle or hook for the content"),
    toneRecommendation: z.string().describe("Recommended tone: e.g., authoritative, conversational, inspirational"),
});

export type ResearchBrief = z.infer<typeof ResearchBriefSchema>;

export async function researchContext(rawData: string): Promise<ResearchBrief> {
    console.log("\n[Researcher Agent] Analyzing industry context, competitors, and trends...");

    const { object } = await generateObject({
        model: google('gemini-3.1-flash-lite'),
        temperature: 0.2,
        schema: ResearchBriefSchema,
        prompt: `
        You are a Market Research Analyst Agent. Analyze the following raw business data and extract strategic context.
        
        Your job is to understand:
        1. What industry this is in
        2. Who the likely competitors are (infer from the product type if not explicitly mentioned)
        3. What topics are currently trending in this space
        4. What content angle would be most effective
        5. What tone would resonate best with the target audience
        
        Raw Business Data:
        "${rawData}"
        `
    });

    return object;
}
