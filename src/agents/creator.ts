import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import type { ContentBrief } from "./knowledge.js";

export async function draftContent(brief: ContentBrief, previousFeedback?: string) {
    console.log(`\n[Creator] Drafting content for audience: "${brief.targetAudience}"...`);

    let prompt = ` 
    You are an expert enterprise marketing copywriter. 
    Write a short, engaging social media post based on this brief:
    
    - Core Message: ${brief.coreMessage}
    - Target Audience: ${brief.targetAudience}
    - Key Features: ${brief.keyFeatures.join(", ")}
    
    STRICT WRITING RULES (follow these exactly):
    - Keep it under 3 sentences.
    - Use a professional, corporate tone. No slang or casual phrases.
    - Do NOT use superlatives like "best", "fastest", "revolutionary", "unprecedented", "unparalleled", "game-changing", "lightning", "seismic".
    - Do NOT use aggressive sales phrases like "Buy now", "Hurry", "Don't miss out", "Get ready".
    - You MAY use specific metrics from the brief (e.g., "sub-10ms queries") — these are factual.
    - Focus on clear value, not hype.
    `;

    if (previousFeedback) {
        console.log(`[Creator] Applying feedback: ${previousFeedback}`);
        prompt += `\n\n=== STRICT REVISION RULES ===
        Your previous draft FAILED the brand safety check.
        You MUST fix the following issues EXACTLY as specified.
        Do NOT introduce new superlatives or unverified claims.
        
        Feedback from Governance:
        ${previousFeedback}
        ===============================`;
    }

    const { text } = await generateText({
        model: google('gemini-3.1-flash-lite'),
        temperature: 0.3,
        prompt,
    });

    return text;
}