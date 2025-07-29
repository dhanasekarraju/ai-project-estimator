import { z } from 'zod';

const taskSchema = z.object({
    epic: z.string(),
    task: z.string(),
    subtask: z.string(),
    estimatedTime: z.string(),
    suggestedRole: z.string(),
});

export const estimationResultSchema = z.object({
    projectName: z.string(),
    tasks: z.array(taskSchema),
    totalEstimatedTime: z.string(),
});

export type EstimationResult = z.infer<typeof estimationResultSchema>;