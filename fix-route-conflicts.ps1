# Fix Route Conflicts Script
# Scans and removes conflicting dynamic routes

Write-Host "Scanning for route conflicts..." -ForegroundColor Yellow

# Get all directories with [brackets]
$bracketDirs = Get-ChildItem -Path "src/app" -Recurse -Directory | Where-Object { $_.Name -match '\[.*\]' }

if ($bracketDirs.Count -eq 0) {
    Write-Host "No dynamic routes found" -ForegroundColor Green
    exit 0
}

# Group by parent directory
$conflicts = $bracketDirs | Group-Object { $_.Parent.FullName } | Where-Object { $_.Count -gt 1 }

if ($conflicts.Count -eq 0) {
    Write-Host "No route conflicts found" -ForegroundColor Green
    $bracketDirs | ForEach-Object { Write-Host "Directory: $($_.FullName)" -ForegroundColor Cyan }
    exit 0
}

Write-Host "Found $($conflicts.Count) route conflicts:" -ForegroundColor Red

# Process each conflict
foreach ($conflict in $conflicts) {
    Write-Host "Parent: $($conflict.Name)" -ForegroundColor Yellow
    
    # Keep [id] folders, delete others
    $keep = $conflict.Group | Where-Object { $_.Name -eq "[id]" }
    $delete = $conflict.Group | Where-Object { $_.Name -ne "[id]" }
    
    if ($keep) {
        Write-Host "Keeping: $($keep.Name)" -ForegroundColor Green
    }
    
    foreach ($item in $delete) {
        try {
            Write-Host "Deleting: $($item.Name)" -ForegroundColor Red
            Remove-Item -Path $item.FullName -Recurse -Force
        } catch {
            Write-Host "Failed to delete: $($item.Name) - $($_.Exception.Message)" -ForegroundColor Red
        }
    }
}

# Verify no conflicts remain
Write-Host "Verifying conflicts resolved..." -ForegroundColor Yellow
$remainingDirs = Get-ChildItem -Path "src/app" -Recurse -Directory | Where-Object { $_.Name -match '\[.*\]' }
$remainingConflicts = $remainingDirs | Group-Object { $_.Parent.FullName } | Where-Object { $_.Count -gt 1 }

if ($remainingConflicts.Count -eq 0) {
    Write-Host "All route conflicts resolved!" -ForegroundColor Green
    $remainingDirs | ForEach-Object { Write-Host "Directory: $($_.FullName)" -ForegroundColor Cyan }
} else {
    Write-Host "Still have $($remainingConflicts.Count) conflicts" -ForegroundColor Red
}

Write-Host "Route conflict fix complete!" -ForegroundColor Green
