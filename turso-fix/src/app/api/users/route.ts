// ============================================================
// COPY TO: src/app/api/users/route.ts
// ============================================================
import { NextRequest, NextResponse } from "next/server";
import { getAllUsers, createUser, upgradeToPremium, getUserById } from "@/lib/db";

export async function GET(req: NextRequest) {
  if (req.headers.get("x-admin-secret") !== process.env.ADMIN_SECRET)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const users = await getAllUsers();
  return NextResponse.json({ users });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const user = await createUser(body);
    return NextResponse.json({ user }, { status: 201 });
  } catch (err) {
    const msg = String(err);
    if (msg.includes("UNIQUE"))
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// POST /api/users/upgrade  body: { userId }
export async function PATCH(req: NextRequest) {
  if (req.headers.get("x-admin-secret") !== process.env.ADMIN_SECRET)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { userId } = await req.json();
  await upgradeToPremium(userId);
  const user = await getUserById(userId);
  return NextResponse.json({ user });
}


// ============================================================
// COPY TO: src/app/api/inquiries/route.ts
// ============================================================
// import { NextRequest, NextResponse } from "next/server";
// import { getAllInquiries, createInquiry, updateInquiryStatus } from "@/lib/db";

// export async function GET(req: NextRequest) {
//   if (req.headers.get("x-admin-secret") !== process.env.ADMIN_SECRET)
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   const inquiries = await getAllInquiries();
//   return NextResponse.json({ inquiries });
// }
// export async function POST(req: NextRequest) {
//   try {
//     const body = await req.json();
//     const { name, phone, plot_id, email, message, user_id } = body;
//     if (!name || !phone || !plot_id)
//       return NextResponse.json({ error: "name, phone, plot_id required" }, { status: 400 });
//     const inquiry = await createInquiry({ name, phone, plot_id, email, message, user_id });
//     return NextResponse.json({ inquiry }, { status: 201 });
//   } catch (err) { return NextResponse.json({ error: String(err) }, { status: 500 }); }
// }
// export async function PATCH(req: NextRequest) {
//   if (req.headers.get("x-admin-secret") !== process.env.ADMIN_SECRET)
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   const { id, status } = await req.json();
//   await updateInquiryStatus(id, status);
//   return NextResponse.json({ success: true });
// }


// ============================================================
// COPY TO: src/app/api/site-visits/route.ts
// ============================================================
// import { NextRequest, NextResponse } from "next/server";
// import { createSiteVisit, getAllSiteVisits, updateVisitStatus } from "@/lib/db";

// export async function GET(req: NextRequest) {
//   if (req.headers.get("x-admin-secret") !== process.env.ADMIN_SECRET)
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   const visits = await getAllSiteVisits();
//   return NextResponse.json({ visits });
// }
// export async function POST(req: NextRequest) {
//   try {
//     const body = await req.json();
//     const { name, phone, visit_date, visit_time, plot_id, user_id } = body;
//     if (!name || !phone || !visit_date || !visit_time || !plot_id)
//       return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
//     const visit = await createSiteVisit({ name, phone, visit_date, visit_time, plot_id, user_id });
//     return NextResponse.json({ visit }, { status: 201 });
//   } catch (err) { return NextResponse.json({ error: String(err) }, { status: 500 }); }
// }
// export async function PATCH(req: NextRequest) {
//   if (req.headers.get("x-admin-secret") !== process.env.ADMIN_SECRET)
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   const { id, status } = await req.json();
//   await updateVisitStatus(id, status);
//   return NextResponse.json({ success: true });
// }
