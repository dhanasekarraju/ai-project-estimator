import type {ProjectDetails} from "@/types/estimation.types.ts";
import type {EstimationResult} from "@/types";

// src/lib/api.ts
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

        // Validate the response matches our schema
        if (!data.tasks || !data.totalEstimatedTime) {
            throw new Error('Invalid response format from server');
        }

        // Return with the projectName from the form
        return {
            projectName: projectDetails.projectName, // From form
            tasks: data.tasks,                       // From API
            totalEstimatedTime: data.totalEstimatedTime // From API
        };
    } catch (error) {
        console.error('API call failed:', error);
        throw new Error(error instanceof Error ? error.message : 'Failed to estimate project');
    }
}