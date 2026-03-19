# ✅ FINAL FIX — Two Issues to Resolve

## Issue 1: The Slug Conflict (MAIN CRASH)
Error: "You cannot use different slug names for the same dynamic path ('id' !== 'slug')"

This means somewhere in your src/app/api/ folder you have
TWO conflicting dynamic route folders:
  - src/app/api/plots/[id]/route.ts     ← uses [id]
  - src/app/api/plots/[slug]/route.ts   ← uses [slug]  ← DELETE THIS

## Fix for Issue 1 — Run this in PowerShell:

```powershell
# Find all dynamic route folders
Get-ChildItem -Path "src\app\api" -Recurse -Directory | Where-Object { $_.Name -match '^\[' }
```

You will see something like:
  src\app\api\plots\[id]
  src\app\api\plots\[slug]   ← DELETE this entire folder

```powershell
# Delete the conflicting slug folder (adjust path if needed)
Remove-Item -Recurse -Force "src\app\api\plots\[slug]"
```

Also check ALL your API routes — the conflict might be in any folder:
```powershell
Get-ChildItem -Path "src\app" -Recurse -Directory | Where-Object { $_.Name -match '^\[' } | Select-Object FullName
```

---

## Issue 2: Wrong Port
Your package.json hardcodes port 9002.
When you run "npm run dev -- -p 9004" it ignores it.

All your tests should use port 9002:
  http://localhost:9002/api/plots
  http://localhost:9002/api/test
  http://localhost:9002/admin

---

## Issue 3: Server crashes before routes load
Because of the slug conflict, Next.js crashes at startup.
ALL API routes fail — not because of the database, but because
the server never fully starts.

Fix the slug conflict first → restart → everything else will work.

---

## Step by Step

1. Run the PowerShell command above to find [slug] folders
2. Delete any conflicting dynamic route folder
3. Stop the server (Ctrl+C)
4. Run: npm run dev
5. Wait for "✓ Ready" (no error this time)
6. Open browser: http://localhost:9002/api/test
7. You should see: { "status": "✅ Database working!" }

---

## Quick Test After Fix (use browser, not PowerShell)
Just paste these URLs directly in Chrome/Edge:

  http://localhost:9002/api/test
  http://localhost:9002/api/plots
  http://localhost:9002/admin
