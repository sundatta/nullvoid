# NullVoid — Local Development Start Script
# No Docker, No PostgreSQL, No Redis needed

Write-Host "=== NullVoid Local Development ===" -ForegroundColor Cyan

# Check if .env exists
if (-not (Test-Path ".env")) {
    Write-Host "ERROR: No .env file found. Copy .env.example to .env and fill in your Discord credentials." -ForegroundColor Red
    Write-Host "You need at minimum: DISCORD_TOKEN, DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET" -ForegroundColor Yellow
    exit 1
}

# Generate Prisma client
Write-Host "[1/3] Generating Prisma client..." -ForegroundColor Green
pnpm --filter @nullvoid/database exec prisma generate
if ($LASTEXITCODE -ne 0) { exit 1 }

# Push schema to SQLite
Write-Host "[2/3] Initializing SQLite database..." -ForegroundColor Green
pnpm --filter @nullvoid/database exec prisma db push --accept-data-loss
if ($LASTEXITCODE -ne 0) { exit 1 }

# Start all services
Write-Host "[3/3] Starting services..." -ForegroundColor Green
Write-Host ""
Write-Host "  Bot:       http://localhost (Discord)" -ForegroundColor Cyan
Write-Host "  API:       http://localhost:3001" -ForegroundColor Cyan
Write-Host "  Dashboard: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop all services" -ForegroundColor Yellow
Write-Host ""

pnpm --recursive --parallel run dev
