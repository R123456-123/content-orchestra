import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";

export const IdeaIdeaSchema = z.object({
    title: z.string().describe("A catchy title for the content idea"),
    description: z.string().describe("A brief description of what the content would cover"),
    platform: z.enum(["LinkedIn", "Twitter/X", "Blog", "Newsletter", "Video/Reel"]).describe("The best platform for this idea"),
    rationale: z.string().describe("Why this idea would be effective for the target audience"),
});

export const IdeaGeneratorSchema = z.object({
    ideas: z.array(IdeaIdeaSchema).length(3).describe("A list of exactly 3 follow-up content ideas"),
});

export type IdeaList = z.infer<typeof IdeaGeneratorSchema>;

export async function generateFollowUpIdeas(content: string): Promise<IdeaList> {
    console.log("\n[Idea Generator Agent] Brainstorming follow-up content ideas...");

    const { object } = await generateObject({
        model: google('gemini-3.1-flash-lite'),
        temperature: 0.7, // Higher temp for more creativity
        schema: IdeaGeneratorSchema,
        prompt: `
        You are a Content Strategy Agent.
        Based on the following approved marketing content, brainstorm exactly 3 follow-up content ideas 
        to build a cohesive campaign. 
        
        Approved Content:
        "${content}"
        `
    });

    return object;
}
