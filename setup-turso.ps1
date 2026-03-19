# PowerShell script to setup Turso database
Write-Host "Setting up Turso database..." -ForegroundColor Green

# Step 1: Login to Turso
Write-Host "Step 1: Logging into Turso..." -ForegroundColor Yellow
try {
    & "C:\Users\Manikanta\AppData\Roaming\npm\turso.cmd" auth login
} catch {
    Write-Host "Please login manually at: https://turso.tech" -ForegroundColor Red
    Write-Host "After login, press Enter to continue..." -ForegroundColor Yellow
    Read-Host
}

# Step 2: Create database
Write-Host "Step 2: Creating database 'as-trusted-db'..." -ForegroundColor Yellow
try {
    & "C:\Users\Manikanta\AppData\Roaming\npm\turso.cmd" db create as-trusted-db
} catch {
    Write-Host "Failed to create database. Please check your login." -ForegroundColor Red
}

# Step 3: Show database info
Write-Host "Step 3: Getting database info..." -ForegroundColor Yellow
try {
    & "C:\Users\Manikanta\AppData\Roaming\npm\turso.cmd" db show as-trusted-db
} catch {
    Write-Host "Failed to get database info." -ForegroundColor Red
}

# Step 4: Create token
Write-Host "Step 4: Creating database token..." -ForegroundColor Yellow
try {
    & "C:\Users\Manikanta\AppData\Roaming\npm\turso.cmd" db tokens create as-trusted-db
} catch {
    Write-Host "Failed to create token." -ForegroundColor Red
}

Write-Host "Setup complete!" -ForegroundColor Green
Write-Host "Please copy the database URL and token from above output." -ForegroundColor Cyan
