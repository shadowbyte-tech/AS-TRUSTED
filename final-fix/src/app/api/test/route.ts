import { NextResponse } from "next/server";
import { getAllPlots, getAllUsers, getDashboardStats } from "@/lib/db";

export async function GET() {
  try {
    const stats = getDashboardStats();
    const plots = getAllPlots({ limit: 3 });
    const users = getAllUsers();

    return NextResponse.json({
      status: "✅ Database working!",
      plots_count: plots.length,
      users_count: users.length,
      stats,
      sample: plots[0] ?? null,
      message: `Connected — ${plots.length} plots, ${users.length} users`,
    });
  } catch (err) {
    return NextResponse.json({
      status: "❌ Error",
      error: String(err),
      fix: "Run: npm install better-sqlite3 && npm run dev",
    }, { status: 500 });
  }
}
