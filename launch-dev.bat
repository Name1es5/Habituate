@echo off
cd /d "%~dp0"
echo Starting ERP dev server...
npm run dev
echo.
echo Server stopped or failed to start.
pause
