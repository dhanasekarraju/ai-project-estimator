import { z } from 'zod';

export const TaskSchema = z.object({
    epic: z.string().min(3, "Epic name must be at least 3 characters"),
    task: z.string().min(3, "Task name must be at least 3 characters"),
    subtask: z.string().min(3, "Subtask name must be at least 3 characters"),
    estimatedTime: z.string().regex(
        /^\d+\s*(hours?|days?|weeks?|months?)$/i,
        "Estimated time must be in format like '2 hours' or '3 days'"
    ),
    suggestedRole: z.enum([
        'Frontend',
        'Backend',
        'QA',
        'PM',
        'DevOps',
        'UI-UX',
        'Fullstack',
        'Database',
        'Security'
    ])
});

export const EstimationResultSchema = z.object({
    tasks: z.array(TaskSchema).min(1, "At least one task is required"),
    totalEstimatedTime: z.string().regex(
        /^\d+\s*(hours?|days?|weeks?|months?)$/i,
        "Total estimated time must be in format like '45 hours' or '2 weeks'"
    )
});