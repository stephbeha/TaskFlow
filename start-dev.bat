@echo off
echo Starting TaskFlow...
echo.

REM Kill existing processes on ports
netstat -ano | findstr :5000 >nul && taskkill /F /PID (for /f "tokens=5" %a in ('netstat -ano ^| findstr :5000') do @echo %a) 2>nul
netstat -ano | findstr :5173 >nul && taskkill /F /PID (for /f "tokens=5" %a in ('netstat -ano ^| findstr :5173') do @echo %a) 2>nul

REM Start backend
echo [1/2] Starting Backend...
start "TaskFlow Backend" cmd /k "cd backend && python app.py"
timeout /t 3

REM Start frontend
echo [2/2] Starting Frontend...
start "TaskFlow Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo TaskFlow is starting!
echo - Backend:  http://localhost:5000
echo - Frontend: http://localhost:5173
echo.
pause
