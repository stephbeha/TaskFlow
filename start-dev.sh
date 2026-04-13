#!/bin/bash

echo "Starting TaskFlow..."
echo ""

# Kill existing processes
pkill -f "python app.py" 2>/dev/null
pkill -f "vite" 2>/dev/null
sleep 1

# Start backend
echo "[1/2] Starting Backend..."
cd backend
python app.py &
BACKEND_PID=$!
sleep 3
cd ..

# Start frontend
echo "[2/2] Starting Frontend..."
cd frontend
npm run dev &
FRONTEND_PID=$!

echo ""
echo "TaskFlow is starting!"
echo "- Backend:  http://localhost:5000"
echo "- Frontend: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop both servers"

wait
