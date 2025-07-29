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