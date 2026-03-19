// ─── src/app/api/users/route.ts ───────────────────────────────
import { NextRequest, NextResponse } from "next/server";
import { getAllUsers, createUser, upgradeToPremium } from "@/lib/db";

export async function GET(req: NextRequest) {
  const auth = req.headers.get("x-admin-secret");
  if (auth !== process.env.ADMIN_SECRET)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const users = await getAllUsers();
  return NextResponse.json({ users });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const user = await createUser(body);
    return NextResponse.json({ user }, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed";
    if (msg.includes("UNIQUE")) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}


// ─── src/app/api/users/[id]/upgrade/route.ts ──────────────────
// POST /api/users/:id/upgrade  → mark user as premium
// Call this from your payment success webhook
export async function upgradePOST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = req.headers.get("x-admin-secret");
  if (auth !== process.env.ADMIN_SECRET)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await upgradeToPremium(params.id);
  return NextResponse.json({ success: true });
}
