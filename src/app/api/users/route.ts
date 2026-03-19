import { NextRequest, NextResponse } from 'next/server';
import { readUsers } from '@/lib/mongodb-database';
import { handleError } from '@/lib/errors';
import { requireOwner } from '@/lib/api-auth';

// 🔒 GET /api/users — Owner only: list all users for management panel
export async function GET(request: NextRequest) {
  const authError = await requireOwner(request);
  if (authError) return authError;

  try {
    const users = await readUsers();
    // Strip any sensitive fields before returning
    const safeUsers = users.map(({ id, email, role, name, phone, location }: any) => ({
      id,
      email,
      role,
      name,
      phone,
      location,
    }));
    return NextResponse.json(safeUsers);
  } catch (error) {
    const { message, statusCode } = handleError(error);
    return NextResponse.json({ error: message }, { status: statusCode });
  }
}