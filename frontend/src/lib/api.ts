import type {ProjectDetails} from "@/types/estimation.types.ts";
import type {EstimationResult} from "@/types";

export async function estimateProject(
    projectDetails: ProjectDetails
): Promise<EstimationResult> {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/estimate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(projectDetails),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (!data.tasks || !data.totalEstimatedTime) {
            throw new Error('Invalid response format from server');
        }

        return {
            projectName: projectDetails.projectName,
            tasks: data.tasks,
            totalEstimatedTime: data.totalEstimatedTime
        };
    } catch (error) {
        console.error('API call failed:', error);
        throw new Error(error instanceof Error ? error.message : 'Failed to estimate project');
    }
}