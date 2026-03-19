# ============================================================
# AS TRUSTED CONSULTANCY — Full Diagnostic & Fix Script
# Save as: fix.ps1
# Run: Right-click → "Run with PowerShell" OR
#      In terminal: powershell -ExecutionPolicy Bypass -File fix.ps1
# ============================================================

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  AS Trusted Consultancy — DB Diagnostics" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$projectPath = "C:\Users\Manikanta\Desktop\AS TRUSTED CONSULTANCY"
Set-Location $projectPath

# ─────────────────────────────────────────
# STEP 1: Check if Next.js is running
# ─────────────────────────────────────────
Write-Host "[ 1/6 ] Checking if Next.js server is running..." -ForegroundColor Yellow

$ports = @(3000, 3001, 9004, 9005, 8080)
$runningPort = $null

foreach ($port in $ports) {
    try {
        $conn = New-Object System.Net.Sockets.TcpClient
        $conn.Connect("localhost", $port)
        $conn.Close()
        Write-Host "  ✅ Server found on port $port" -ForegroundColor Green
        $runningPort = $port
        break
    } catch {
        Write-Host "  ❌ Port $port — not responding" -ForegroundColor Red
    }
}

if ($null -eq $runningPort) {
    Write-Host ""
    Write-Host "  ⚠️  No server is running!" -ForegroundColor Red
    Write-Host "  Run this in a SEPARATE terminal first:" -ForegroundColor Yellow
    Write-Host "    npm run dev" -ForegroundColor White
    Write-Host "  Then run this script again." -ForegroundColor Yellow
    Write-Host ""
}

# ─────────────────────────────────────────
# STEP 2: Check .env.local exists and is correct
# ─────────────────────────────────────────
Write-Host ""
Write-Host "[ 2/6 ] Checking .env.local..." -ForegroundColor Yellow

$envPath = Join-Path $projectPath ".env.local"
if (Test-Path $envPath) {
    Write-Host "  ✅ .env.local found" -ForegroundColor Green
    $envContent = Get-Content $envPath
    
    $hasUrl   = $envContent | Where-Object { $_ -match "^TURSO_DATABASE_URL=libsql://" }
    $hasToken = $envContent | Where-Object { $_ -match "^TURSO_AUTH_TOKEN=ey" }
    $hasAdmin = $envContent | Where-Object { $_ -match "^ADMIN_SECRET=" }
    
    if ($hasUrl)   { Write-Host "  ✅ TURSO_DATABASE_URL looks correct" -ForegroundColor Green }
    else           { Write-Host "  ❌ TURSO_DATABASE_URL missing or wrong format (must start with libsql://)" -ForegroundColor Red }
    
    if ($hasToken) { Write-Host "  ✅ TURSO_AUTH_TOKEN looks correct" -ForegroundColor Green }
    else           { Write-Host "  ❌ TURSO_AUTH_TOKEN missing or wrong (must start with eyJ...)" -ForegroundColor Red }
    
    if ($hasAdmin) { Write-Host "  ✅ ADMIN_SECRET found" -ForegroundColor Green }
    else           { Write-Host "  ⚠️  ADMIN_SECRET missing (add it to .env.local)" -ForegroundColor Yellow }
} else {
    Write-Host "  ❌ .env.local NOT FOUND!" -ForegroundColor Red
    Write-Host "  Creating template .env.local for you..." -ForegroundColor Yellow
    
    $template = @"
TURSO_DATABASE_URL=libsql://as-trusted-db-YOURNAME.turso.io
TURSO_AUTH_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9_REPLACE_WITH_YOUR_TOKEN
ADMIN_SECRET=astrusted2024admin
"@
    Set-Content -Path $envPath -Value $template
    Write-Host "  ✅ Created .env.local — EDIT IT with your real Turso values!" -ForegroundColor Yellow
}

# ─────────────────────────────────────────
# STEP 3: Check next.config file
# ─────────────────────────────────────────
Write-Host ""
Write-Host "[ 3/6 ] Checking next.config..." -ForegroundColor Yellow

$configTs = Join-Path $projectPath "next.config.ts"
$configJs = Join-Path $projectPath "next.config.js"
$configMjs = Join-Path $projectPath "next.config.mjs"

$configFile = if (Test-Path $configTs) { $configTs }
              elseif (Test-Path $configJs) { $configJs }
              elseif (Test-Path $configMjs) { $configMjs }
              else { $null }

if ($configFile) {
    $configContent = Get-Content $configFile -Raw
    Write-Host "  ✅ Found: $configFile" -ForegroundColor Green
    
    if ($configContent -match "serverExternalPackages") {
        Write-Host "  ✅ serverExternalPackages is set — webpack fix active" -ForegroundColor Green
    } else {
        Write-Host "  ❌ serverExternalPackages MISSING — this causes the hanging bug!" -ForegroundColor Red
        Write-Host "  Auto-fixing next.config.ts..." -ForegroundColor Yellow
        
        $fixedConfig = @"
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@libsql/client"],
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [...(config.externals || []), "@libsql/client"];
    }
    return config;
  },
};

export default nextConfig;
"@
        Set-Content -Path $configTs -Value $fixedConfig
        Write-Host "  ✅ next.config.ts fixed! Restart npm run dev after this." -ForegroundColor Green
    }
} else {
    Write-Host "  ❌ No next.config file found!" -ForegroundColor Red
}

# ─────────────────────────────────────────
# STEP 4: Check db.ts import
# ─────────────────────────────────────────
Write-Host ""
Write-Host "[ 4/6 ] Checking src/lib/db.ts..." -ForegroundColor Yellow

$dbPath = Join-Path $projectPath "src\lib\db.ts"
if (Test-Path $dbPath) {
    $dbContent = Get-Content $dbPath -Raw
    
    if ($dbContent -match '@libsql/client/http') {
        Write-Host "  ✅ Using /http import — correct!" -ForegroundColor Green
    } elseif ($dbContent -match '@libsql/client"') {
        Write-Host "  ❌ Using wrong import! Causes hanging on Windows." -ForegroundColor Red
        Write-Host "  Auto-fixing import in db.ts..." -ForegroundColor Yellow
        $dbContent = $dbContent -replace 'from "@libsql/client"', 'from "@libsql/client/http"'
        $dbContent = $dbContent -replace "from '@libsql/client'", "from '@libsql/client/http'"
        Set-Content -Path $dbPath -Value $dbContent
        Write-Host "  ✅ db.ts import fixed!" -ForegroundColor Green
    } else {
        Write-Host "  ⚠️  Could not detect import style — check manually" -ForegroundColor Yellow
    }
} else {
    Write-Host "  ❌ src/lib/db.ts not found — copy it from the zip" -ForegroundColor Red
}

# ─────────────────────────────────────────
# STEP 5: Check @libsql/client is installed
# ─────────────────────────────────────────
Write-Host ""
Write-Host "[ 5/6 ] Checking npm packages..." -ForegroundColor Yellow

$pkgJson = Join-Path $projectPath "package.json"
if (Test-Path $pkgJson) {
    $pkg = Get-Content $pkgJson -Raw | ConvertFrom-Json
    $deps = $pkg.dependencies
    $libsql = $deps."@libsql/client"
    
    if ($libsql) {
        Write-Host "  ✅ @libsql/client $libsql found in package.json" -ForegroundColor Green
    } else {
        Write-Host "  ❌ @libsql/client not in package.json!" -ForegroundColor Red
        Write-Host "  Running: npm install @libsql/client@latest ..." -ForegroundColor Yellow
        npm install @libsql/client@latest
    }
    
    $nodeModules = Join-Path $projectPath "node_modules\@libsql"
    if (Test-Path $nodeModules) {
        Write-Host "  ✅ @libsql installed in node_modules" -ForegroundColor Green
    } else {
        Write-Host "  ❌ @libsql not in node_modules — running npm install..." -ForegroundColor Red
        npm install
    }
}

# ─────────────────────────────────────────
# STEP 6: Test the API if server is running
# ─────────────────────────────────────────
Write-Host ""
Write-Host "[ 6/6 ] Testing API connection..." -ForegroundColor Yellow

if ($null -ne $runningPort) {
    # Test the connection endpoint
    try {
        $testUrl = "http://localhost:$runningPort/api/test-connection"
        $response = Invoke-RestMethod -Uri $testUrl -TimeoutSec 15
        Write-Host "  ✅ Test connection API responded!" -ForegroundColor Green
        Write-Host "  Status: $($response.status)" -ForegroundColor Cyan
        if ($response.tables) {
            Write-Host "  Tables: $($response.tables -join ', ')" -ForegroundColor Cyan
        }
        if ($response.message) {
            Write-Host "  Message: $($response.message)" -ForegroundColor Cyan
        }
    } catch {
        Write-Host "  ❌ Test connection failed: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host "  Make sure you added src/app/api/test-connection/route.ts" -ForegroundColor Yellow
    }
    
    # Test plots API
    try {
        $plotsUrl = "http://localhost:$runningPort/api/plots"
        $plotsResp = Invoke-RestMethod -Uri $plotsUrl -TimeoutSec 15
        $count = if ($plotsResp.plots) { $plotsResp.plots.Count } else { 0 }
        Write-Host "  ✅ Plots API working! Found $count plots." -ForegroundColor Green
    } catch {
        Write-Host "  ❌ Plots API failed: $($_.Exception.Message)" -ForegroundColor Red
    }
} else {
    Write-Host "  ⏭️  Skipping API test — server not running" -ForegroundColor Gray
    Write-Host "  Start the server with: npm run dev" -ForegroundColor Yellow
}

# ─────────────────────────────────────────
# SUMMARY
# ─────────────────────────────────────────
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  WHAT TO DO NEXT:" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "  1. Make sure .env.local has correct Turso values" -ForegroundColor White
Write-Host "     Get them from: https://turso.tech/app" -ForegroundColor Gray
Write-Host ""
Write-Host "  2. Stop the server (Ctrl+C in the npm run dev window)" -ForegroundColor White
Write-Host ""
Write-Host "  3. Restart:" -ForegroundColor White
Write-Host "     npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "  4. Test in browser:" -ForegroundColor White
Write-Host "     http://localhost:3000/api/test-connection" -ForegroundColor Gray
Write-Host ""
Write-Host "  5. View admin dashboard:" -ForegroundColor White
Write-Host "     http://localhost:3000/admin" -ForegroundColor Gray
Write-Host ""
