# ✅ Turso Connection Fix — AS Trusted Consultancy

## Root Cause of Your Error

The `@libsql/client` package uses native WebSocket binaries
that **hang on Windows with Next.js 15**.

Two fixes needed:
1. Use `@libsql/client/http` instead of `@libsql/client`
2. Add `serverExternalPackages` to `next.config.ts`

---

## Step-by-Step Fix

### 1. Reinstall the correct version

```bash
npm remove @libsql/client
npm install @libsql/client@latest
```

### 2. Replace next.config.ts (or next.config.js)

**Replace your entire `next.config.ts` with the one in this zip.**

Key addition:
```ts
const nextConfig: NextConfig = {
  serverExternalPackages: ["@libsql/client"],  // ← THIS IS THE FIX
};
```

### 3. Replace src/lib/db.ts

**Replace your entire `src/lib/db.ts` with the one in this zip.**

Key change — the import:
```ts
// ❌ OLD (causes hanging on Windows)
import { createClient } from "@libsql/client";

// ✅ NEW (HTTP only, works everywhere)
import { createClient } from "@libsql/client/http";
```

### 4. Check your .env.local format

```env
# ✅ CORRECT format:
TURSO_DATABASE_URL=libsql://as-trusted-db-yourname.turso.io
TURSO_AUTH_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
ADMIN_SECRET=your-chosen-password

# ❌ WRONG — do not add quotes:
TURSO_DATABASE_URL="libsql://..."   ← no quotes needed

# ❌ WRONG — do not use https://:
TURSO_DATABASE_URL=https://...      ← must be libsql://
```

### 5. Get correct values from Turso

```powershell
# In PowerShell or terminal:
turso db show as-trusted-db
# Copy the URL shown (starts with libsql://)

turso db tokens create as-trusted-db
# Copy the token shown (long JWT string)
```

Or visit https://turso.tech/app → your database → Connect

### 6. Run the schema (if not done yet)

```powershell
turso db shell as-trusted-db
```
Then paste the contents of schema.sql and press Enter.

### 7. Restart your dev server

```powershell
# Stop with Ctrl+C, then:
npm run dev
```

### 8. Test the connection

Visit in your browser:
```
http://localhost:3000/api/test-connection
```

Expected response:
```json
{
  "status": "✅ Connected",
  "tables": ["inquiries", "plots", "saves", "site_visits", "users"],
  "message": "✅ Database ready with 5 tables"
}
```

---

## Files in this zip

| File | Action |
|------|--------|
| `next.config.ts` | **Replace** your existing next.config.ts |
| `src/lib/db.ts` | **Replace** your existing src/lib/db.ts |
| `src/app/api/test-connection/route.ts` | **Add** new file |
| `src/app/api/plots/route.ts` | **Replace** |
| `src/app/api/plots/[id]/route.ts` | **Replace** |
| `src/app/api/users/route.ts` | **Replace** |
| `schema.sql` | Run in turso db shell (if not already done) |

---

## If Still Not Working

**Error: "Invalid URL"**
→ Your TURSO_DATABASE_URL is wrong. Must start with `libsql://`

**Error: "Unauthorized" or 401**
→ Your TURSO_AUTH_TOKEN is wrong or expired. Re-run: `turso db tokens create as-trusted-db`

**Error: "no such table"**
→ Schema not applied yet. Run: `turso db shell as-trusted-db < schema.sql`

**Page still hanging**
→ You forgot to update next.config.ts with `serverExternalPackages`

**Still broken after all steps**
→ Delete node_modules and reinstall:
```powershell
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
npm run dev
```
