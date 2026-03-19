import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/test-connection
// Visit this URL in your browser to verify the database is working
// Expected response: { "status": "✅ Connected", "tables": [...], "message": "..." }

export async function GET() {
  try {
    // Step 1: simple ping
    const ping = await db.execute({ sql: "SELECT 1 as ok", args: [] });
    if (!ping.rows[0]) throw new Error("DB returned no rows");

    // Step 2: list tables
    const tables = await db.execute({
      sql: "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name",
      args: [],
    });
    const tableNames = tables.rows.map((r) => r.name);

    // Step 3: count rows in each table
    const counts: Record<string, number> = {};
    for (const t of tableNames as string[]) {
      const c = await db.execute({ sql: `SELECT COUNT(*) as n FROM ${t}`, args: [] });
      counts[t] = Number(c.rows[0]?.n ?? 0);
    }

    return NextResponse.json({
      status: "✅ Connected",
      tables: tableNames,
      row_counts: counts,
      message: tableNames.length === 0
        ? "⚠️ No tables found — run schema.sql first: turso db shell as-trusted-db < schema.sql"
        : `✅ Database ready with ${tableNames.length} tables`,
    });
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err);
    return NextResponse.json({
      status: "❌ Failed",
      error,
      fixes: [
        "1. Check TURSO_DATABASE_URL in .env.local — must start with libsql://",
        "2. Check TURSO_AUTH_TOKEN in .env.local — must be a long JWT string",
        "3. Make sure next.config.ts has serverExternalPackages: ['@libsql/client']",
        "4. Restart the dev server after changing .env.local",
        "5. Run: npm install @libsql/client@latest",
      ],
    }, { status: 500 });
  }
}
