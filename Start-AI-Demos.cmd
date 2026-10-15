@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Node was not found. Install Node 22 or newer, then run this file again.
  echo No npm packages or build steps are needed.
  pause
  exit /b 1
)
node start-AI-demos.mjs
if errorlevel 1 pause
