import { NextRequest, NextResponse } from "next/server";
import { createSiteVisit, getAllSiteVisits, updateVisitStatus } from "@/lib/db";

export async function GET(req: NextRequest) {
  const auth = req.headers.get("x-admin-secret");
  if (auth !== process.env.ADMIN_SECRET)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const visits = await getAllSiteVisits();
  return NextResponse.json({ visits });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, visit_date, visit_time, plot_id, user_id } = body;
    if (!name || !phone || !visit_date || !visit_time || !plot_id) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    const visit = await createSiteVisit({ name, phone, visit_date, visit_time, plot_id, user_id });
    return NextResponse.json({ visit }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to book visit" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const auth = req.headers.get("x-admin-secret");
  if (auth !== process.env.ADMIN_SECRET)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id, status } = await req.json();
  await updateVisitStatus(id, status);
  return NextResponse.json({ success: true });
}
