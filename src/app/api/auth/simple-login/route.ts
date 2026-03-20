import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    
    // Hardcoded credentials for immediate testing
    const validCredentials = [
      { email: 'admin@astrustedconsultancy.com', password: 'admin123', role: 'Owner', name: 'Admin User', id: 'admin-001' },
      { email: 'swamygoud@consult.com', password: 'swamy@2775', role: 'Owner', name: 'Swamy Goud', id: 'swamy-001' }
    ];
    
    const user = validCredentials.find(u => u.email === email && u.password === password);
    
    if (user) {
      return NextResponse.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          name: user.name
        },
        message: 'Login successful'
      });
    } else {
      return NextResponse.json({
        success: false,
        error: 'Invalid credentials',
        debug: {
          email: email,
          availableEmails: validCredentials.map(u => u.email)
        }
      });
    }
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
