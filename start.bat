@echo off
setlocal EnableDelayedExpansion
title CareerStream - Smart Job Application Tracker
cd /d "%~dp0"

echo ============================================================
echo      CAREERSTREAM - SMART JOB APPLICATION TRACKER
echo ============================================================
echo.

:: 1. Verify Node.js is installed
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not found in PATH.
    echo Please install Node.js from https://nodejs.org/ and try again.
    pause
    exit /b 1
)

:: 2. Check if node_modules exists
if not exist "node_modules\" (
    echo [1/3] Dependencies not found. Running npm install...
    call npm install --legacy-peer-deps
    if %errorlevel% neq 0 (
        echo [ERROR] npm install failed.
        pause
        exit /b %errorlevel%
    )
) else (
    echo [1/3] Dependencies verified.
)

:: 3. Check if server is already running on port 4200
powershell -Command "try { $res = Invoke-WebRequest -Uri 'http://localhost:4200/' -UseBasicParsing -TimeoutSec 2; if ($res.StatusCode -eq 200) { exit 0 } else { exit 1 } } catch { exit 1 }" >nul 2>&1
if %errorlevel% equ 0 (
    echo [2/3] Server is already running on http://localhost:4200/
) else (
    echo [2/3] Starting Angular development server...
    start "CareerStream Server" /min cmd /c "npm start"
    
    echo [INFO] Waiting for server to initialize on http://localhost:4200/ ...
    :WAIT_SERVER
    timeout /t 2 /nobreak >nul
    powershell -Command "try { $res = Invoke-WebRequest -Uri 'http://localhost:4200/' -UseBasicParsing -TimeoutSec 2; if ($res.StatusCode -eq 200) { exit 0 } else { exit 1 } } catch { exit 1 }" >nul 2>&1
    if %errorlevel% neq 0 (
        goto WAIT_SERVER
    )
)

:: 4. Launch in Full Screen
echo [3/3] Opening CareerStream in full screen mode...

if exist "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" (
    start "" "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" --start-fullscreen "http://localhost:4200/"
) else if exist "C:\Program Files\Microsoft\Edge\Application\msedge.exe" (
    start "" "C:\Program Files\Microsoft\Edge\Application\msedge.exe" --start-fullscreen "http://localhost:4200/"
) else if exist "C:\Program Files\Google\Chrome\Application\chrome.exe" (
    start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" --start-fullscreen "http://localhost:4200/"
) else if exist "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" (
    start "" "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" --start-fullscreen "http://localhost:4200/"
) else (
    start "" "http://localhost:4200/"
)

echo.
echo ============================================================
echo   SUCCESS! CareerStream is running at: http://localhost:4200/
echo   Tip: Press F11 on your keyboard anytime to exit/enter full screen.
echo ============================================================
echo.
exit /b 0
