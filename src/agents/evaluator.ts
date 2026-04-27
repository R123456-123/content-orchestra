import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { ComplianceReviewSchema } from "../schemas/compliance.js";

export async function evaluateContent(draftContent: string) {
    console.log("Starting Compliance Evaluation...");

    const { object } = await generateObject({
        model: google('gemini-2.5-flash-lite'),
        temperature: 0.1,
        schema: ComplianceReviewSchema,
        prompt: `
        You are an enterprise Brand Safety Evaluator. Review the following drafted content against these STRICT safety rules: 
        
        1. Aggressive sales phrases are NOT allowed.
           - Banned words: "Buy now", "Limited offer", "Cheap", "Hurry".
        
        2. Unverified claims are NOT allowed.
           - Do not allow words like "best", "fastest", "guaranteed", "revolutionize" unless explicitly proven.
           
        3. Must maintain a professional, corporate tone.
           - No slang, hyperbole, or extreme exaggeration.
        
        Draft Content to Review:
        "${draftContent}"
        `,
    });

    return object;
}