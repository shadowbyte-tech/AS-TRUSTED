import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Creating Swamy Goud credentials in Vercel MongoDB...');
    
    const { MongoClient } = require('mongodb');
    const uri = process.env.TURSO_CONNECTION_MONGODB_URI || 'mongodb+srv://Vercel-Admin-as-trusted-consultancy:DEyNeV57jM73uap3@as-trusted-consultancy.ehwtipr.mongodb.net/?retryWrites=true&w=majority';
    
    console.log('🔍 Using URI:', uri);
    
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db('as-trusted-consultancy');
    
    console.log('✅ Connected to MongoDB successfully');
    
    // Create Swamy Goud user
    const swamyUser = {
      id: 'swamy-owner-001',
      email: 'swamygoud@consult.com',
      role: 'Owner',
      name: 'Swamy Goud',
      createdAt: new Date().toISOString()
    };
    
    // Check if exists first
    const existing = await db.collection('users').findOne({ email: swamyUser.email });
    if (!existing) {
      await db.collection('users').insertOne(swamyUser);
      
      // Add password
      await db.collection('passwords').insertOne({
        email: swamyUser.email,
        hashedPassword: 'swamy@2775', // Plain text for now
        updatedAt: new Date().toISOString()
      });
      
      console.log('✅ Swamy Goud user created successfully in MongoDB');
    } else {
      console.log('ℹ️ Swamy Goud user already exists in MongoDB');
      
      // Update password anyway
      await db.collection('passwords').updateOne(
        { email: swamyUser.email },
        { 
          $set: { 
            hashedPassword: 'swamy@2775',
            updatedAt: new Date().toISOString()
          }
        },
        { upsert: true }
      );
      console.log('✅ Swamy Goud password updated in MongoDB');
    }
    
    // Verify the user was created
    const verifyUser = await db.collection('users').findOne({ email: swamyUser.email });
    const verifyPassword = await db.collection('passwords').findOne({ email: swamyUser.email });
    
    await client.close();
    
    return NextResponse.json({
      success: true,
      message: 'Swamy Goud credentials created successfully in Vercel MongoDB!',
      user: swamyUser.email,
      password: 'swamy@2775',
      name: swamyUser.name,
      role: swamyUser.role,
      verified: {
        user: !!verifyUser,
        password: !!verifyPassword
      }
    });
    
  } catch (error) {
    console.error('❌ Error creating Swamy Goud credentials:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error.stack
    }, { status: 500 });
  }
}
