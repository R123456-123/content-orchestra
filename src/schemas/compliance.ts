import { z } from 'zod';

export const ComplianceReviewSchema = z.object({
      status: z.enum(['APPROVED', 'REJECTED', 'NEEDS_REVISION']),
      confidenceScore: z.number().min(0).max(100),
      flaggedIssues: z.array(z.string()).optional().describe("List of specific brand or safety violations"),
      suggestedFixes: z.array(z.string()).optional(),
      finalOutput: z.string().optional().describe("The approved content, if status is APPROVED")
});

export type ComplianceReview = z.infer<typeof ComplianceReviewSchema>;