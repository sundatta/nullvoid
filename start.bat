@echo off
title NullVoid
cd /d "%~dp0"

echo ========================================
echo   NullVoid — Local Development
echo ========================================
echo.

REM Check .env
if not exist ".env" (
    echo [ERROR] .env file not found.
    echo Copy .env.example to .env and fill in your Discord credentials.
    pause
    exit /b 1
)

REM Check Discord token
findstr /b "DISCORD_TOKEN=" .env | findstr "your_discord_bot_token_here" >nul
if not errorlevel 1 (
    echo [WARNING] You haven't set your Discord bot token yet.
    echo You need to:
    echo   1. Go to https://discord.com/developers/applications
    echo   2. Create an application and a bot
    echo   3. Copy the token, client ID, and client secret into .env
    echo.
    echo For now, starting API only (dashboard will warn)...
    echo.
)

REM Generate Prisma client
echo [1/3] Setting up database...
call pnpm --filter @nullvoid/database exec prisma generate >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Prisma generation failed
    pause
    exit /b 1
)

call pnpm --filter @nullvoid/database exec prisma db push --accept-data-loss >nul 2>&1

echo [2/3] Rebuilding packages...
call pnpm --filter @nullvoid/config run build >nul 2>&1
call pnpm --filter @nullvoid/logger run build >nul 2>&1
call pnpm --filter @nullvoid/database run build >nul 2>&1
call pnpm --filter @nullvoid/api run build >nul 2>&1
call pnpm --filter @nullvoid/bot run build >nul 2>&1

echo [3/3] Starting services...
echo.
echo  API:       http://localhost:3001
echo  Dashboard: http://localhost:3000
echo  Swagger:   http://localhost:3001/docs
echo.
echo  Press Ctrl+C in any window to stop that service.
echo.

start "NullVoid - API" cmd /c "pnpm --filter @nullvoid/api run dev & pause"
timeout /t 3 >nul
start "NullVoid - Dashboard" cmd /c "pnpm --filter @nullvoid/dashboard run dev & pause"
timeout /t 3 >nul
start "NullVoid - Bot" cmd /c "pnpm --filter @nullvoid/bot run dev & pause"

echo All services started!
echo Close the windows to stop.
pause
