import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const BCRYPT_SALT_ROUNDS = 12;

export interface AuthUser {
  id: string;
  email: string;
  role: string;
  name?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Authenticate user using MongoDB only
 */
export async function authenticateUser(credentials: LoginCredentials): Promise<AuthUser | null> {
  try {
    const { MongoClient } = require('mongodb');
    const uri = process.env.TURSO_CONNECTION_MONGODB_URI || process.env.MONGODB_URI || 'mongodb+srv://sukkamanikantagoud_db_user:ZZBbpijo3jun3Oc0@smkg.wc88qhm.mongodb.net/as-trusted-consultancy?appName=SMKG';
    
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db('as-trusted-consultancy');
    
    console.log('🔍 Authenticating user:', credentials.email);
    
    // Find user in MongoDB
    const user = await db.collection('users').findOne({ 
      email: credentials.email.toLowerCase() 
    });
    
    if (!user) {
      console.log('❌ Auth failure for:', credentials.email, '- USER RECORD NOT FOUND in collection "users"');
      await client.close();
      return null;
    }
    
    // Get password from MongoDB
    const passwordDoc = await db.collection('passwords').findOne({ 
      email: credentials.email.toLowerCase() 
    });
    
    if (!passwordDoc) {
      console.log('❌ Auth failure for:', credentials.email, '- PASSWORD RECORD NOT FOUND in collection "passwords"');
      await client.close();
      return null;
    }
    
    // Check password (supports both plain text and bcrypt)
    let passwordValid = false;
    const storedPassword = passwordDoc.hashedPassword;
    
    if (storedPassword.startsWith('$2') || storedPassword.startsWith('$1')) {
      // Bcrypt hash
      passwordValid = await bcrypt.compare(credentials.password, storedPassword);
      console.log('🔍 Using bcrypt password verification');
    } else {
      // Plain text (for migrated data)
      passwordValid = credentials.password === storedPassword;
      console.log('🔍 Using plain text password verification');
    }
    
    if (!passwordValid) {
      console.log('❌ Password mismatch for:', credentials.email);
      await client.close();
      return null;
    }
    
    console.log('✅ Authentication successful for:', credentials.email);
    
    await client.close();
    
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name
    };
    
  } catch (error) {
    const errorDetails = error instanceof Error ? error.message : String(error);
    console.error('❌ Authentication CRITICAL error (Connection or Query failed):', errorDetails);
    
    // Check for common connection errors
    if (errorDetails.includes('ETIMEOUT') || errorDetails.includes('ECONNREFUSED')) {
      console.error('⚠️  HINT: This looks like a network or whitelist issue. Check Atlas IP Access List.');
    }
    
    return null;
  }
}

/**
 * Set authentication cookies
 */
export async function setAuthCookies(response: Response, user: AuthUser) {
  const accessToken = jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      role: user.role 
    },
    JWT_SECRET,
    { expiresIn: '15m' }
  );
  
  const refreshToken = jwt.sign(
    { 
      id: user.id, 
      email: user.email 
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
  
  // Set cookies
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
  };
  
  // Note: You'll need to handle cookies properly in Next.js
  console.log('🔐 Setting auth cookies for user:', user.email);
}

/**
 * Verify JWT token
 */
export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    console.error('❌ Token verification failed:', error);
    return null;
  }
}
