import Fastify from 'fastify';
import cors from '@fastify/cors';
import { evaluateContent } from './agents/evaluator.js';
import { draftContent } from './agents/creator.js';
import { synthesizeData } from './agents/knowledge.js';
import 'dotenv/config';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const fastify = Fastify({ logger: true });

await fastify.register(cors, { 
  origin: true 
});

fastify.get('/', async (request, reply) => {
    return { status: 'Content Orchestra API is running!' };
});

fastify.post('/api/orchestrate', async (request, reply) => {
    const body = request.body as { rawData?: string };
    const rawData = body?.rawData || "INTERNAL MEMO: Project Phoenix is launching Q3. It's a cloud DB. Super fast queries (under 10ms). But it's really expensive, so target enterprise CTOs who have big budgets. Don't mention the price directly.";

    const maxAttempts = 3;
    let attempts = 1;

    try {
        const brief = await synthesizeData(rawData);
        console.log(`\n--> Generated Brief:\n`, brief);

        let draft = await draftContent(brief);
        console.log(`\n--> Initial Draft:\n${draft}\n`);

        let evaluation = await evaluateContent(draft);
        console.log(`\n--> Evaluation [Attempt ${attempts}]: ${evaluation.status} (Score: ${evaluation.confidenceScore})`);

        while (evaluation.status !== 'APPROVED' && attempts < maxAttempts) {
            attempts++;
            console.log(`\n[Orchestrator] Status: ${evaluation.status}. Revising (attempt ${attempts}/${maxAttempts})...`);
            await delay(2000);

            // Build concise feedback — truncate each item to avoid garbled long strings
            const issues = evaluation.flaggedIssues?.map(i => i.slice(0, 100)).join('; ') || 'Review failed';
            const fixes = evaluation.suggestedFixes?.map(f => f.slice(0, 100)).join('; ') || 'Rewrite to be more professional';
            const feedback = `Issues: ${issues}. Fixes: ${fixes}`;

            draft = await draftContent(brief, feedback);
            evaluation = await evaluateContent(draft);
            console.log(`\n--> Evaluation [Attempt ${attempts}]: ${evaluation.status} (Score: ${evaluation.confidenceScore})`);
        }  

        if (evaluation.status !== 'APPROVED') {
            reply.status(400);
            return {
                status: "failed",
                error: "Could not generate compliant content within the allowed attempts.",
                data: { finalStatus: evaluation.status, attemptsTaken: attempts, lastEvaluation: evaluation, lastDraft: draft }
            };
        }

        // Use evaluator's approved finalOutput if available, otherwise use the last draft
        const approvedContent = evaluation.finalOutput || draft;

        return {
            status: "success",
            data: { extractedBrief: brief, finalStatus: evaluation.status, attemptsTaken: attempts, finalDraft: approvedContent }
        };

    } catch (error) {
        fastify.log.error(error);
        reply.status(500);
        return { status: "error", message: "An internal AI error occurred.", error: String(error) };
    }
});

const start = async () => {
    try {
        const port = Number(process.env.PORT) || 3000;
        await fastify.listen({ port: port, host: '0.0.0.0' });
        console.log(`Content Orchestra running on port ${port}`);
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();