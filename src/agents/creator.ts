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
    
    Keep it under 3 sentences.
    `;

    if (previousFeedback) {
        console.log(`[Creator] Applying feedback: ${previousFeedback}`);
        prompt += `\n\n=== STRICT REVISION RULES ===
        Your previous draft FAILED the brand safety check.
        You MUST adhere to the following rules:
        - Fix ALL flagged issues exactly as suggested.
        - Do NOT repeat previous mistakes.
        - Ensure compliance with ALL brand rules.
        
        Feedback from Governance:
        ${previousFeedback}
        ===============================`;
    }

    const { text } = await generateText({
        model: google('gemini-2.5-flash-lite'),
        temperature: 0.3,
        prompt,
    });

    return text;
}