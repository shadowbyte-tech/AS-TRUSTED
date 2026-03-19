import { NextRequest, NextResponse } from "next/server";
import { getAllInquiries, createInquiry, updateInquiryStatus } from "@/lib/db";

export async function GET(req: NextRequest) {
  const auth = req.headers.get("x-admin-secret");
  if (auth !== process.env.ADMIN_SECRET)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const inquiries = await getAllInquiries();
  return NextResponse.json({ inquiries });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, plot_id, email, message, user_id } = body;
    if (!name || !phone || !plot_id)
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    const inquiry = await createInquiry({ name, phone, plot_id, email, message, user_id });
    return NextResponse.json({ inquiry }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to submit inquiry" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const auth = req.headers.get("x-admin-secret");
  if (auth !== process.env.ADMIN_SECRET)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id, status } = await req.json();
  await updateInquiryStatus(id, status);
  return NextResponse.json({ success: true });
}
