const { createClient } = require('@libsql/client');
const fs = require('fs');
const path = require('path');

async function initializeDatabase() {
  try {
    console.log('🔧 Initializing database...');
    
    // Create data directory if it doesn't exist
    const dataDir = path.join(__dirname, 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
      console.log('📁 Created data directory');
    }
    
    // Connect to local SQLite
    const db = createClient({ url: 'file:./data/as-trusted.db' });
    
    // Create tables
    console.log('📋 Creating tables...');
    
    await db.execute(`
      CREATE TABLE IF NOT EXISTS plots (
        id TEXT PRIMARY KEY,
        plot_number TEXT NOT NULL,
        village_name TEXT NOT NULL,
        area_name TEXT NOT NULL,
        plot_size TEXT NOT NULL,
        plot_facing TEXT NOT NULL,
        price INTEGER,
        description TEXT,
        image_url TEXT NOT NULL,
        status TEXT DEFAULT 'Available',
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    await db.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        role TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    await db.execute(`
      CREATE TABLE IF NOT EXISTS inquiries (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        message TEXT NOT NULL,
        plot_number TEXT NOT NULL,
        received_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Check if plots table is empty and add sample data
    const countResult = await db.execute('SELECT COUNT(*) as count FROM plots');
    const plotCount = countResult.rows[0].count;
    
    if (plotCount === 0) {
      console.log('📊 Adding sample data...');
      
      await db.execute(`
        INSERT INTO plots (id, plot_number, village_name, area_name, plot_size, plot_facing, price, description, image_url, status) VALUES 
          ('plot-1', 'PLOT-001', 'Kamareddy', 'Hyderabad', '200 sq yards', 'North', 1200000, 'Premium DTCP approved plot', 'https://images.unsplash.com/photo-1560449018-8e5f71b4c0c?w=800', 'Available'),
          ('plot-2', 'PLOT-002', 'Sangareddy', 'Hyderabad', '250 sq yards', 'East', 1500000, 'Spacious plot with highway access', 'https://images.unsplash.com/photo-1560449018-8e5f71b4c0c?w=800', 'Available'),
          ('plot-3', 'PLOT-003', 'Siddipet', 'Hyderabad', '300 sq yards', 'South', 1800000, 'Prime location plot', 'https://images.unsplash.com/photo-1560449018-8e5f71b4c0c?w=800', 'Available')
      `);
      
      console.log('✅ Sample data inserted');
    }
    
    // Test the connection
    const testResult = await db.execute('SELECT COUNT(*) as count FROM plots');
    console.log(`✅ Database ready! Found ${testResult.rows[0].count} plots`);
    
    return true;
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    return false;
  }
}

initializeDatabase();
