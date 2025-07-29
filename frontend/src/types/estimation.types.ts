// src/types/estimation.types.ts
import { z } from 'zod';
import { TaskSchema, EstimationResultSchema } from '../schemas/estimation.schema';

export type Task = z.infer<typeof TaskSchema>;

export type EstimationResult = z.infer<typeof EstimationResultSchema> & {
    projectName: string;  // Make it required here
};

export interface ProjectDetails {
    projectName: string;
    type: string;
    features: string;
    stack?: string;
    timeline?: string;
    budget?: string;
    notes?: string;
}

export interface EstimationError {
    message: string;
    details?: unknown;
}