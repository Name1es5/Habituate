@echo off
cd /d "%~dp0"
echo Installing dependencies...
npm install
echo.
echo Starting ERP dev server...
npm run dev
echo.
echo Server stopped or failed to start.
pause
