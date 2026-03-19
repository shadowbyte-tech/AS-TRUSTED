// ============================================================
// src/app/api/plots/route.ts
// ============================================================
import { NextRequest, NextResponse } from "next/server";
import { getAllPlots, createPlot } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const plots = await getAllPlots({
      location:   searchParams.get("location") ?? undefined,
      status:     searchParams.get("status") ?? undefined,
      is_premium: searchParams.has("premium") ? searchParams.get("premium") === "true" : undefined,
      limit:      searchParams.has("limit") ? Number(searchParams.get("limit")) : undefined,
    });
    return NextResponse.json({ plots });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    if (req.headers.get("x-admin-secret") !== process.env.ADMIN_SECRET)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const body = await req.json();
    const plot = await createPlot(body);
    return NextResponse.json({ plot }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
