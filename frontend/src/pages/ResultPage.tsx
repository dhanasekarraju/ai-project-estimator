import * as XLSX from 'xlsx';
import {Button} from '../components/ui/button';
import {Card} from '../components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from '../components/ui/table';
import type {Task} from '@/types';

export default function ResultPage({
                                       result,
                                       onBack,
                                   }: {
    result: {
        projectName: string;
        tasks: Task[];
        totalEstimatedTime: string;
    };
    onBack: () => void;
}) {
    const roleRates: Record<string, number> = {
        Frontend: 400,
        Backend: 450,
        QA: 350,
        DevOps: 500,
        PM: 400,
    };

    const getDaysFromEstimate = (estimate: string) => {
        const [value] = estimate.split(' ');
        const hours = parseInt(value);
        return isNaN(hours) ? 0 : hours / 8;
    };

    const totalCost = result.tasks.reduce((sum, task) => {
        const days = getDaysFromEstimate(task.estimatedTime);
        const rate = roleRates[task.suggestedRole] || 0;
        return sum + days * rate;
    }, 0);

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(result.tasks);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Project Plan');
        XLSX.writeFile(workbook, `${result.projectName.replace(/[^a-z0-9]/gi, '_')}_Plan.xlsx`);
    };

    const exportToJson = () => {
        const dataStr = JSON.stringify(result, null, 2);
        const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
        const link = document.createElement('a');
        link.href = dataUri;
        link.download = `${result.projectName.replace(/[^a-z0-9]/gi, '_')}_Plan.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const exportToDoc = () => {
        const content = `# Project: ${result.projectName}\n\n## Total Estimate: ${result.totalEstimatedTime}\n\n${result.tasks
            .map(
                (task) => `### ${task.epic}\n**${task.task}**\n${task.subtask}\n*Estimated*: ${task.estimatedTime}\n*Role*: ${task.suggestedRole}\n`
            )
            .join('\n')}\n\n**Total Cost Estimate**: $${totalCost.toFixed(2)}`;

        const blob = new Blob([content], {type: 'text/markdown'});
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${result.projectName.replace(/[^a-z0-9]/gi, '_')}_Plan.md`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'Frontend':
                return 'bg-blue-100 text-blue-800';
            case 'Backend':
                return 'bg-green-100 text-green-800';
            case 'QA':
                return 'bg-purple-100 text-purple-800';
            case 'PM':
                return 'bg-yellow-100 text-yellow-800';
            case 'DevOps':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <Card className="max-w-6xl mx-auto mt-10 p-6">
            <div className="mb-8">
                <h1 className="text-2xl font-bold">{result.projectName}</h1>
                <span className="font-semibold">
                  {result.totalEstimatedTime}
                    {result.totalEstimatedTime.includes('hours') && (
                        <>
                            {' '}(
                            {parseInt(result.totalEstimatedTime.split(' ')[0]) / 8}
                            {' '}day{parseInt(result.totalEstimatedTime.split(' ')[0]) / 8 > 1 ? 's' : ''}
                            )
                        </>
                    )}
                </span>

            </div>

            <div className="overflow-x-auto">
                <Table className="border">
                    <TableHeader className="bg-gray-50">
                        <TableRow>
                            <TableHead className="font-bold w-[20%]">Epic</TableHead>
                            <TableHead className="font-bold w-[20%]">Task</TableHead>
                            <TableHead className="font-bold w-[25%]">Subtask</TableHead>
                            <TableHead className="font-bold w-[15%]">Estimate</TableHead>
                            <TableHead className="font-bold w-[20%]">Suggested Role</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {result.tasks.map((task, index) => (
                            <TableRow key={index}>
                                <TableCell className="font-medium">{task.epic}</TableCell>
                                <TableCell>{task.task}</TableCell>
                                <TableCell>{task.subtask}</TableCell>
                                <TableCell>
                                    {task.estimatedTime}
                                    {task.estimatedTime.includes('hours') && (
                                        <>
                                            {' '}(
                                            {parseInt(task.estimatedTime.split(' ')[0]) / 8}
                                            {' '}day{parseInt(task.estimatedTime.split(' ')[0]) / 8 > 1 ? 's' : ''}
                                            )
                                        </>
                                    )}
                                </TableCell>
                                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${getRoleColor(task.suggestedRole)}`}>
                    {task.suggestedRole}
                  </span>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TableCell colSpan={4} className="text-right font-bold">
                                Total Cost Estimate:
                            </TableCell>
                            <TableCell className="font-bold">${totalCost.toFixed(2)}</TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </div>

            <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={onBack}>
                    ← Back to Form
                </Button>
                <div className="space-x-2">
                    <Button variant="outline" onClick={exportToJson}>
                        Export as JSON
                    </Button>
                    <Button onClick={exportToExcel}>Export as Excel</Button>
                    <Button onClick={exportToDoc}>Export as Document</Button>
                </div>
            </div>
        </Card>
    );
}
