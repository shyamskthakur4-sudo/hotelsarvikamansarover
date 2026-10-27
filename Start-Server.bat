@echo off
title Hotel Sarvika Mansarover - Local Web Server
echo ========================================================
echo   Launching Hotel Sarvika Mansarover Local Server...
echo ========================================================
start "" "http://localhost:3000/"
"C:\Program Files\nodejs\node.exe" "%~dp0server.js"
pause
