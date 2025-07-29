# AI Project Estimator 🔮

An AI-powered tool to generate project estimates including epics, tasks, subtasks, estimated hours, and suggested roles.

Built with:

- 🧠 **AI**: [Groq API](https://groq.com/) (running Llama3)
- 💻 **Frontend**: React + TypeScript + TailwindCSS (Vite)
- 🔧 **Backend**: Node.js + Express
- 📦 **Export**: Excel, JSON, Markdown
- ☁️ **Deployment**: Vercel / Render (coming soon)

## 🔑 How It Works

1. User enters project details: type, features, stack, timeline, etc.
2. Backend sends prompt to **Groq API**
3. Groq (Llama3) returns structured JSON with tasks and time estimates
4. Frontend displays it beautifully with export options

## 🧪 Example Output

```json
{
  "tasks": [
    {
      "epic": "Frontend Development",
      "task": "Build login form",
      "subtask": "Form validation and API integration",
      "estimatedTime": "6 hours",
      "suggestedRole": "Frontend Developer"
    }
  ],
  "totalEstimatedTime": "40 hours"
}
```
Setup: 
Create a `.env` file by copying the example:

```bash
cp .env.example .env
