# ============================================================
# fix-slug-conflict.ps1
# Run: powershell -ExecutionPolicy Bypass -File fix-slug-conflict.ps1
# ============================================================

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Fixing Slug Conflict in Next.js Routes" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$projectPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $projectPath

# ─── STEP 1: Find all dynamic route folders ───────────────────
Write-Host "[ 1 ] Scanning for dynamic route folders..." -ForegroundColor Yellow

$dynamicFolders = Get-ChildItem -Path "src\app" -Recurse -Directory `
  | Where-Object { $_.Name -match '^\[' } `
  | Select-Object FullName, Name, Parent

if ($dynamicFolders.Count -eq 0) {
    Write-Host "  No dynamic route folders found." -ForegroundColor Gray
} else {
    Write-Host "  Found dynamic folders:" -ForegroundColor White
    foreach ($f in $dynamicFolders) {
        Write-Host "    $($f.FullName)" -ForegroundColor White
    }
}

# ─── STEP 2: Find conflicts (same parent, different slug names) ─
Write-Host ""
Write-Host "[ 2 ] Checking for conflicts..." -ForegroundColor Yellow

$conflicts = @()
$grouped = $dynamicFolders | Group-Object { $_.Parent.FullName }

foreach ($group in $grouped) {
    if ($group.Count -gt 1) {
        Write-Host "  ❌ CONFLICT in: $($group.Name)" -ForegroundColor Red
        foreach ($item in $group.Group) {
            Write-Host "       $($item.Name)" -ForegroundColor Red
        }
        $conflicts += $group
    }
}

if ($conflicts.Count -eq 0) {
    Write-Host "  No conflicts found between dynamic routes." -ForegroundColor Green
    Write-Host ""
    Write-Host "  The slug error might be in pages/ instead of app/" -ForegroundColor Yellow
    
    # Also check pages directory
    if (Test-Path "src\pages") {
        $pagesDynamic = Get-ChildItem -Path "src\pages" -Recurse -Directory `
          | Where-Object { $_.Name -match '^\[' }
        foreach ($f in $pagesDynamic) {
            Write-Host "  Found in pages: $($f.FullName)" -ForegroundColor Yellow
        }
    }
}

# ─── STEP 3: Auto-fix — keep [id], delete others ──────────────
Write-Host ""
Write-Host "[ 3 ] Auto-fixing conflicts (keeping [id], removing others)..." -ForegroundColor Yellow

foreach ($group in $conflicts) {
    foreach ($item in $group.Group) {
        if ($item.Name -ne "[id]") {
            Write-Host "  Deleting: $($item.FullName)" -ForegroundColor Red
            Remove-Item -Recurse -Force $item.FullName
            Write-Host "  ✅ Deleted $($item.Name)" -ForegroundColor Green
        } else {
            Write-Host "  Keeping: $($item.FullName)" -ForegroundColor Green
        }
    }
}

# ─── STEP 4: Show what routes remain ──────────────────────────
Write-Host ""
Write-Host "[ 4 ] Remaining API routes:" -ForegroundColor Yellow

$routes = Get-ChildItem -Path "src\app\api" -Recurse -Name "route.ts" -ErrorAction SilentlyContinue
foreach ($r in $routes) {
    $urlPath = $r -replace "\\route.ts","" -replace "\\","/" 
    Write-Host "  /api/$urlPath" -ForegroundColor White
}

# ─── STEP 5: Show the correct port ────────────────────────────
Write-Host ""
Write-Host "[ 5 ] Checking your port..." -ForegroundColor Yellow

$pkgJson = Get-Content "package.json" -Raw | ConvertFrom-Json
$devScript = $pkgJson.scripts.dev
Write-Host "  Dev script: $devScript" -ForegroundColor White

if ($devScript -match "-p (\d+)") {
    $port = $Matches[1]
    Write-Host "  ✅ Your server runs on port: $port" -ForegroundColor Green
    Write-Host "  Use this URL to test: http://localhost:$port/api/test" -ForegroundColor Cyan
} else {
    Write-Host "  Default port: 3000" -ForegroundColor White
    Write-Host "  Use this URL to test: http://localhost:3000/api/test" -ForegroundColor Cyan
}

# ─── DONE ─────────────────────────────────────────────────────
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Done! Now do:" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "  1. npm run dev" -ForegroundColor White
Write-Host "  2. Open browser: http://localhost:9002/api/test" -ForegroundColor White
Write-Host "  3. Should show: { status: '✅ Database working!' }" -ForegroundColor White
Write-Host ""
