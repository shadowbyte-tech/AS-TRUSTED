import { NextRequest, NextResponse } from "next/server";
import { getPlotById, updatePlot, deletePlot } from "@/lib/db";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const plot = await getPlotById(params.id);
    if (!plot) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ plot });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch plot" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = req.headers.get("x-admin-secret");
    if (auth !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await req.json();
    const plot = await updatePlot(params.id, body);
    if (!plot) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ plot });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to update plot" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = req.headers.get("x-admin-secret");
    if (auth !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const ok = await deletePlot(params.id);
    if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to delete plot" }, { status: 500 });
  }
}
