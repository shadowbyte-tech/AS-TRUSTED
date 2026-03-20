import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();
    
    if (!email || !password) {
      return NextResponse.json({ 
        success: false, 
        error: 'Email and password are required' 
      }, { status: 400 });
    }

    // Connect to MongoDB
    const { MongoClient } = require('mongodb');
    const uri = 'mongodb+srv://sukkamanikantagoud_db_user:ZZBbpijo3jun3Oc0@smkg.wc88qhm.mongodb.net/?appName=SMKG';
    
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db('as-trusted-consultancy');
    
    // Check if user already exists
    const existingUser = await db.collection('users').findOne({ email: email.toLowerCase() });
    if (existingUser) {
      await client.close();
      return NextResponse.json({ 
        success: false, 
        error: 'User with this email already exists' 
      }, { status: 409 });
    }
    
    // Create new owner user
    const newUser = {
      id: `owner-${Date.now()}`,
      email: email.toLowerCase(),
      role: 'Owner',
      name: name || 'Administrator',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Insert user
    await db.collection('users').insertOne(newUser);
    
    // Store password (for now, plain text - you can change this to bcrypt later)
    await db.collection('passwords').insertOne({
      email: email.toLowerCase(),
      hashedPassword: password, // TODO: Hash this password
      updatedAt: new Date().toISOString()
    });
    
    await client.close();
    
    return NextResponse.json({
      success: true,
      message: 'Owner credentials created successfully!',
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
        name: newUser.name
      }
    });
    
  } catch (error) {
    console.error('Error creating owner credentials:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
