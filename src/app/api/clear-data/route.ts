import { NextRequest, NextResponse } from 'next/server';
import { readProperties, clearProperties } from '@/lib/property-database';
import { readUsers, writeUsers } from '@/lib/mongodb-database';

export async function POST(request: NextRequest) {
  try {
    const { confirm } = await request.json();
    
    if (confirm !== 'CLEAR_ALL_DATA') {
      return NextResponse.json({ error: 'Invalid confirmation' }, { status: 400 });
    }

    // Clear all properties
    await clearProperties();
    
    // Clear all users except the new owner
    const users = await readUsers();
    const ownerUser = users.find(u => u.email === 'swamy@consult.com');
    
    if (ownerUser) {
      await writeUsers([ownerUser]);
    } else {
      await writeUsers([]);
    }

    return NextResponse.json({ 
      success: true, 
      message: 'All data cleared successfully. Only owner account remains.',
      remainingUsers: ownerUser ? 1 : 0
    });

  } catch (error) {
    console.error('Error clearing data:', error);
    return NextResponse.json({ error: 'Failed to clear data' }, { status: 500 });
  }
}
