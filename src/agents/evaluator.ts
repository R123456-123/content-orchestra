import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { ComplianceReviewSchema } from "../schemas/compliance.js";

export async function evaluateContent(draftContent: string) {
    console.log("Starting Compliance Evaluation...");

    const { object } = await generateObject({
        model: google('gemini-3.1-flash-lite'),
        temperature: 0.1,
        schema: ComplianceReviewSchema,
        prompt: `
        You are an enterprise Brand Safety Evaluator. Review the following content.
        
        RULES:
        1. No aggressive sales phrases: "Buy now", "Limited offer", "Cheap", "Hurry", "Act now", "Don't miss out".
        2. No unverified superlatives: "best", "fastest", "guaranteed", "revolutionize", "revolutionary", "#1", "unparalleled", "unprecedented", "game-changing", "lightning", "seismic".
           - Specific quantifiable metrics like "sub-10ms" or "under 10ms" ARE acceptable.
           - Words like "innovative", "high-performance", "efficient", "robust", "significant" ARE acceptable.
        3. Professional corporate tone. No slang.
        
        DECISION RULES:
        - APPROVED: Content follows all rules. Set finalOutput to the content as-is.
        - NEEDS_REVISION: Content has 1-2 specific banned words that need replacing. List exact replacements.
        - REJECTED: Content is offensive, completely off-topic, or has 5+ violations.
        
        Set confidenceScore from 0-100 based on overall quality.
        
        Draft Content to Review:
        "${draftContent}"
        `,
    });

    return object;
}