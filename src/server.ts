import Fastify from 'fastify';
import { evaluateContent } from './agents/evaluator.js';
import { draftContent } from './agents/creator.js';
import { synthesizeData } from './agents/knowledge.js';
import 'dotenv/config';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const fastify = Fastify({ logger: true });

fastify.get('/', async (request, reply) => {
    return { status: 'Content Orchestra API is running!' };
});

fastify.post('/api/orchestrate', async (request, reply) => {

    const body = request.body as { rawData?: string };
    const rawData = body?.rawData || "INTERNAL MEMO: Project Phoenix is launching Q3. It's a cloud DB. Super fast queries (under 10ms). But it's really expensive, so target enterprise CTOs who have big budgets. Don't mention the price directly.";

    const maxAttempts = 3;
    let attempts = 1;

    const brief = await synthesizeData(rawData);
    console.log(`\n--> Generated Brief:\n`, brief);

    let draft = await draftContent(brief);
    console.log(`\n--> Initial Draft: =\n${draft}\n`);

    let evaluation = await evaluateContent(draft);

    while(evaluation.status !== 'APPROVED' && attempts < maxAttempts ) {
        console.log(`\n[Orchestrator] Draft rejected. Status: ${evaluation.status}. Attempt ${attempts} of ${maxAttempts}. Rewriting...`);
        
        console.log(`[Orchestrator] Waiting 5 seconds to avoid rate limits...`);
        await delay(5000);

        const feedback = `Issues: ${evaluation.flaggedIssues?.join(', ') || 'Unknown'}. Suggested fixes: ${evaluation.suggestedFixes?.join(', ') || 'None'}`;
        draft = await draftContent(brief, feedback);
        console.log(`\n--> Revised Draft:\n${draft}\n`);

        evaluation = await evaluateContent(draft);
        attempts++;
    }  

    if (evaluation.status !== 'APPROVED') {
        reply.status(400);
        return {
            message: "Pipeline failed",
            status: "failed",
            error: "Could not generate compliant content within the allowed attempts.",
            data: {
                extractedBrief: brief,  
                finalStatus: evaluation.status,
                attemptsTaken: attempts,
                lastEvaluation: evaluation
            }
        };
    }

    return {
        message: "Pipeline initialized",
        status: "success",
        data: {
            extractedBrief: brief,  
            finalStatus: evaluation.status,
            attemptsTaken: attempts,
            finalDraft: draft,
        }
    };
});

const start = async () => {
    try {
        await fastify.listen({ port: 3000});
        console.log('Content Orchestra running on http://localhost:3000');
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();