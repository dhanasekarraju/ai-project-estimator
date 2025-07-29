import { useState } from 'react'
import { Button } from '../components/ui/button'
import { Card } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Textarea } from '../components/ui/textarea'
import { estimateProject } from '../lib/api'
import type {EstimationResult} from "@/types";
import * as React from "react";

interface EstimatorFormProps {
    onResult: (result: EstimationResult) => void;
}

export default function EstimatorForm({ onResult }: EstimatorFormProps) {
    const [formData, setFormData] = useState({
        projectName: '',
        type: '',
        features: '',
        stack: '',
        budget: '',
        timeline: '',
        notes: ''
    })
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.projectName || !formData.type || !formData.features) {
            setError('Please fill in required fields');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const result = await estimateProject(formData);
            onResult(result);
        } catch (err) {
            let errorMessage = 'Failed to generate estimate. Please try again.';

            if (err instanceof Error) {
                if (err.message.includes('Failed to fetch')) {
                    errorMessage = 'Network error - please check your connection';
                } else if (err.message.includes('HTTP error')) {
                    errorMessage = `Server error: ${err.message}`;
                } else {
                    errorMessage = err.message;
                }
            }

            setError(errorMessage);
            console.error('Estimation error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="max-w-2xl mx-auto mt-10 p-6">
            <h1 className="text-2xl font-bold mb-6 text-center">AI Project Estimator</h1>

            {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <Label>Project Name *</Label>
                    <Input
                        name="projectName"
                        value={formData.projectName}
                        onChange={handleChange}
                        placeholder="My Awesome Project"
                        required
                    />
                </div>

                <div>
                    <Label>Project Type *</Label>
                    <Input
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        placeholder="Web App / Mobile App / API / etc."
                        required
                    />
                </div>

                <div>
                    <Label>Key Features / Modules *</Label>
                    <Textarea
                        name="features"
                        value={formData.features}
                        onChange={handleChange}
                        placeholder="Describe main features (e.g., User auth, payment processing, dashboard)"
                        rows={5}
                        required
                    />
                </div>

                <div>
                    <Label>Tech Stack</Label>
                    <Input
                        name="stack"
                        value={formData.stack}
                        onChange={handleChange}
                        placeholder="Technologies you plan to use (optional)"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label>Desired Timeline</Label>
                        <Input
                            name="timeline"
                            value={formData.timeline}
                            onChange={handleChange}
                            placeholder="e.g., 3 months"
                        />
                    </div>
                    <div>
                        <Label>Budget</Label>
                        <Input
                            name="budget"
                            value={formData.budget}
                            onChange={handleChange}
                            placeholder="e.g., $15,000"
                        />
                    </div>
                </div>

                <div>
                    <Label>Additional Notes</Label>
                    <Textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        placeholder="Any special requirements or constraints"
                        rows={3}
                    />
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                        <span className="flex items-center gap-2">
                  <span className="animate-spin">↻</span>
              Analyzing Project...
            </span>
                    ) : (
                        'Generate Estimate'
                    )}
                </Button>
            </form>
        </Card>
    )
}