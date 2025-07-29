
import { Groq } from "groq-sdk";
import dotenv from 'dotenv';
import {EstimationResult, ProjectDetails, Task} from "../types/estimateTypes";

dotenv.config();

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

export class EstimationService {
    private static async generateAIEstimate(prompt: string): Promise<string> {
        try {
            const response = await groq.chat.completions.create({
                messages: [{ role: "user", content: prompt }],
                model: "llama3-70b-8192",
                temperature: 0.3,
                response_format: { type: "json_object" },
                max_tokens: 2000
            });

            return response.choices[0]?.message?.content || '';
        } catch (error) {
            console.error("AI generation failed:", error);
            throw new Error("AI service unavailable");
        }
    }

    private static createPrompt(project: ProjectDetails): string {
        return `
      [INST] As a senior project manager with 10+ years experience, create a detailed breakdown for:
      
      Project: ${project.projectName}
      Type: ${project.type || 'Not specified'}
      Key Features: ${project.features}
      ${project.stack ? `Tech Stack: ${project.stack}` : ''}
      ${project.timeline ? `Timeline: ${project.timeline}` : ''}
      
      Return JSON with this exact structure:
      {
        "tasks": [{
          "epic": "Epic name",
          "task": "Task name", 
          "subtask": "Specific action items",
          "estimatedTime": "X hours/days",
          "suggestedRole": "Frontend/Backend/QA/DevOps"
        }],
        "totalEstimatedTime": "Sum of all estimates"
      }
      
      Guidelines:
      1. Break into 8-15 tasks
      2. Include testing and documentation
      3. Make estimates realistic
      4. Assign appropriate roles
      [/INST]
    `;
    }

    private static validateEstimation(result: any): EstimationResult {
        if (!result.tasks || !Array.isArray(result.tasks)) {
            throw new Error("Invalid task list in response");
        }

        result.tasks.forEach((task: Task) => {
            if (!task.epic || !task.task || !task.estimatedTime) {
                throw new Error("Missing required task fields");
            }
        });

        return result as EstimationResult;
    }

    public static async createEstimate(
        projectDetails: ProjectDetails
    ): Promise<EstimationResult> {
        try {
            if (!projectDetails.projectName || !projectDetails.features) {
                throw new Error("Project name and features are required");
            }

            const prompt = this.createPrompt(projectDetails);

            const aiResponse = await this.generateAIEstimate(prompt);
            if (!aiResponse) throw new Error("Empty AI response");

            const parsed = JSON.parse(aiResponse);
            const validated = this.validateEstimation(parsed);

            return {
                ...validated
            };

        } catch (error) {
            console.error("Estimation failed:", error);
            throw new Error(
                error instanceof Error
                    ? error.message
                    : "Failed to generate estimate"
            );
        }
    }
}