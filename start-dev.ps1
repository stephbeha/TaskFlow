#!/usr/bin/env pwsh
param(
    [switch]$Backend = $false,
    [switch]$Frontend = $false,
    [switch]$Both = $true
)

# Vérifier si Both est explicitement faux
if (($Backend -or $Frontend) -and $Both) {
    $Both = $false
}

# Configuration
$NODE_PATH = "C:\Program Files\nodejs"
$NPM = "$NODE_PATH\npm.cmd"
$NODE = "$NODE_PATH\node.exe"
$PYTHON = "python"

# Ajouter Node au PATH local
$env:Path = "$NODE_PATH;$env:Path"

Write-Host "╔════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                    TaskFlow - Dev Server                       ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Fermer les ports en utilisation
Write-Host "[*] Checking for existing processes on ports..." -ForegroundColor Yellow
$port5000 = Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue
$port5173 = Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue

if ($port5000) {
    Write-Host "[!] Closing process on port 5000..." -ForegroundColor Yellow
    Get-Process | Where-Object { $_.Name -eq "python" } | Stop-Process -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 1
}

if ($port5173) {
    Write-Host "[!] Closing process on port 5173..." -ForegroundColor Yellow
    Get-Process | Where-Object { $_.Name -like "*node*" } | Stop-Process -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 1
}

# Lancer les serveurs
if ($Backend -or $Both) {
    Write-Host ""
    Write-Host "[1/2] Starting Backend (Flask) on http://localhost:5000" -ForegroundColor Green
    Start-Process -FilePath "cmd.exe" -ArgumentList "/k cd backend && $PYTHON app.py" -WindowStyle Normal
    Start-Sleep -Seconds 3
}

if ($Frontend -or $Both) {
    Write-Host "[2/2] Starting Frontend (Vite) on http://localhost:5173" -ForegroundColor Green
    Start-Process -FilePath "cmd.exe" -ArgumentList "/k cd frontend && npm run dev" -WindowStyle Normal
    Start-Sleep -Seconds 2
}

Write-Host ""
Write-Host "✓ TaskFlow is starting!" -ForegroundColor Green
Write-Host ""
Write-Host "  Backend:  http://localhost:5000" -ForegroundColor Cyan
Write-Host "  Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press any key to continue..." -ForegroundColor Gray
