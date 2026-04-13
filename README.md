# TaskFlow - Intelligent Project Management

TaskFlow is a modern task management application powered by local AI (SmolLM2). Organize your work, track progress, and get intelligent suggestions for task complexity and prioritization.

## Features

**Core Features:**
- Kanban board with 3 statuses (Backlog, In Progress, Completed)
- Intelligent task complexity estimation (AI-powered)
- Priority management (Normal, Critical)
- Story points tracking
- Real-time drag & drop
- Local AI suggestions for task descriptions

**Tech Stack:**
- Backend: Flask + Local LLM (SmolLM2-135M-Instruct)
- Frontend: React 19 + Vite + Tailwind CSS
- Database: JSON (local)
- AI: Hugging Face Transformers

## Installation

### Prerequisites
- Python 3.10+
- Node.js 18+

### Quick Setup

**Windows:**
```bash
start-dev.bat
```

**macOS/Linux:**
```bash
bash start-dev.sh
```

### Manual Setup

**Backend:**
```bash
cd backend
pip install -r requirements.txt
python app.py
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## Usage

1. Open http://localhost:5173
2. Create tasks by clicking the "+" button
3. Use AI to generate task descriptions
4. Drag tasks between columns to change status
5. Delete tasks with the trash icon

## Project Structure

```
TaskFlow/
├── backend/
│   ├── app.py              # Flask API
│   ├── tasks_data.json     # Local database
│   └── requirements.txt    # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── App.jsx         # Main component
│   │   ├── main.jsx
│   │   └── index.css
│   ├── vite.config.js
│   └── package.json
└── docs/
```

## API Endpoints

- `GET /api/tasks` - List all tasks
- `POST /api/tasks` - Create new task
- `PATCH /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `POST /api/ai/suggest` - Get AI suggestions

## License

MIT
