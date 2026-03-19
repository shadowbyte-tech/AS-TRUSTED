import { NextRequest, NextResponse } from "next/server";
import { getPlotById, updatePlot, deletePlot } from "@/lib/db";

// This file MUST be at: src/app/api/plots/[id]/route.ts
// Delete any src/app/api/plots/[slug]/route.ts if it exists

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const plot = getPlotById(id);
    if (!plot) return NextResponse.json({ error: "Plot not found" }, { status: 404 });
    return NextResponse.json({ plot });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (req.headers.get("x-admin-secret") !== process.env.ADMIN_SECRET)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = await params;
    const body = await req.json();
    const plot = updatePlot(id, body);
    if (!plot) return NextResponse.json({ error: "Plot not found" }, { status: 404 });
    return NextResponse.json({ plot });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (req.headers.get("x-admin-secret") !== process.env.ADMIN_SECRET)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = await params;
    const ok = deletePlot(id);
    if (!ok) return NextResponse.json({ error: "Plot not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
