import { useState } from 'react';
import EstimatorForm from '@/pages/EstimatorForm.tsx';
import ResultPage from '@/pages/ResultPage.tsx';
import type {EstimationResult} from '@/types';

export default function App() {
    const [result, setResult] = useState<EstimationResult | null>(null);

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            {result ? (
                <ResultPage result={result} onBack={() => setResult(null)} />
            ) : (
                <EstimatorForm onResult={setResult} />
            )}
        </div>
    );
}