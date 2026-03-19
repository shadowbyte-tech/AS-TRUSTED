import { NextRequest, NextResponse } from "next/server";
import { getAllPlots, createPlot } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const plots = await getAllPlots({
      location:   searchParams.get("location") ?? undefined,
      status:     searchParams.get("status") ?? undefined,
      is_premium: searchParams.has("premium")
        ? searchParams.get("premium") === "true"
        : undefined,
      limit: searchParams.has("limit")
        ? Number(searchParams.get("limit"))
        : undefined,
    });
    return NextResponse.json({ plots });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch plots" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    // Owner-only: verify admin secret
    const auth = req.headers.get("x-admin-secret");
    if (auth !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await req.json();
    const plot = await createPlot(body);
    return NextResponse.json({ plot }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create plot" }, { status: 500 });
  }
}
