import { Request, Response } from "express";
import { EstimationService } from "../services/estimation.service";
import {ProjectDetails} from "../types/estimateTypes";

export async function estimateProject(req: Request, res: Response) {
    try {
        const projectDetails: ProjectDetails = {
            projectName: req.body.projectName,
            type: req.body.type,
            features: req.body.features,
            stack: req.body.stack,
            timeline: req.body.timeline,
            budget: req.body.budget,
            notes: req.body.notes
        };

        const result = await EstimationService.createEstimate(projectDetails);
        res.json(result);

    } catch (error) {
        console.error("Controller error:", error);
        res.status(500).json({
            error: error instanceof Error ? error.message : "Estimation failed",
            success: false
        });
    }
}