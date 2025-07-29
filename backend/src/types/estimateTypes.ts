export interface Task {
    epic: string;
    task: string;
    subtask: string;
    estimatedTime: string;
    suggestedRole: string;
}

export interface EstimationResult {
    projectName: string;
    tasks: Task[];
    totalEstimatedTime: string;
}

export interface ProjectDetails {
    projectName: string;
    type: string;
    features: string;
    stack?: string;
    timeline?: string;
    budget?: string;
    notes?: string;
}