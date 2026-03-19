import { NextRequest, NextResponse } from "next/server";
import { getPlotById, updatePlot, deletePlot } from "@/lib/db";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const plot = await getPlotById(params.id);
    if (!plot) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ plot });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (req.headers.get("x-admin-secret") !== process.env.ADMIN_SECRET)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const body = await req.json();
    const plot = await updatePlot(params.id, body);
    if (!plot) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ plot });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (req.headers.get("x-admin-secret") !== process.env.ADMIN_SECRET)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const ok = await deletePlot(params.id);
    if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
