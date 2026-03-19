// ✅ This uses HTTP only → works perfectly on Windows
import { createClient } from "@libsql/client/http";
import { logger } from "./logger";

// Turso database connection with fallback to local SQLite
export const db = createClient({
  url: process.env.TURSO_DATABASE_URL || 'file:./data/as-trusted.db',
  authToken: process.env.TURSO_AUTH_TOKEN,
});

// Database schema for Turso
export const createTables = async () => {
  try {
    logger.info('Connecting to database:', process.env.TURSO_DATABASE_URL ? 'Turso' : 'Local SQLite');
    
    await db.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        role TEXT NOT NULL CHECK (role IN ('Owner', 'User')),
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.execute(`
      CREATE TABLE IF NOT EXISTS plots (
        id TEXT PRIMARY KEY,
        plot_number TEXT NOT NULL,
        village_name TEXT NOT NULL,
        area_name TEXT NOT NULL,
        plot_size TEXT NOT NULL,
        plot_facing TEXT NOT NULL CHECK (plot_facing IN ('North', 'South', 'East', 'West', 'North-East', 'North-West', 'South-East', 'South-West')),
        price INTEGER,
        price_negotiable BOOLEAN DEFAULT FALSE,
        description TEXT,
        image_url TEXT NOT NULL,
        image_hint TEXT,
        status TEXT DEFAULT 'Available' CHECK (status IN ('Available', 'Reserved', 'Sold', 'Under Negotiation')),
        is_dtcp_approved BOOLEAN DEFAULT FALSE,
        is_ready_to_construct BOOLEAN DEFAULT FALSE,
        has_highway_access BOOLEAN DEFAULT FALSE,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
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

    await db.execute(`
      CREATE TABLE IF NOT EXISTS contacts (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        phone TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        type TEXT NOT NULL CHECK (type IN ('Seller', 'Buyer')),
        notes TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.execute(`
      CREATE TABLE IF NOT EXISTS registrations (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        phone TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        notes TEXT,
        is_new BOOLEAN DEFAULT TRUE,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.execute(`
      CREATE TABLE IF NOT EXISTS site_visits (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        phone TEXT NOT NULL,
        email TEXT NOT NULL,
        preferred_date TEXT NOT NULL,
        preferred_time TEXT NOT NULL,
        location TEXT NOT NULL,
        message TEXT,
        status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Confirmed', 'Completed', 'Cancelled')),
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Insert sample data if tables are empty
    const plotCount = await db.execute('SELECT COUNT(*) as count FROM plots');
    if (plotCount.rows[0].count === 0) {
      await db.execute(`
        INSERT INTO plots (
          id, plot_number, village_name, area_name, plot_size, plot_facing, 
          price, description, image_url, status, is_dtcp_approved,
          is_ready_to_construct, has_highway_access
        ) VALUES 
          ('plot-1', 'PLOT-001', 'Kamareddy', 'Hyderabad', '200 sq yards', 'North', 1200000, 
           'Premium DTCP approved plot in Kamareddy with excellent connectivity', 
           'https://images.unsplash.com/photo-1560449018-8e5f71b4c0c?w=800', 
           'Available', TRUE, TRUE, TRUE),
          ('plot-2', 'PLOT-002', 'Sangareddy', 'Hyderabad', '250 sq yards', 'East', 1500000, 
           'Spacious plot with highway access in Sangareddy', 
           'https://images.unsplash.com/photo-1560449018-8e5f71b4c0c?w=800', 
           'Available', TRUE, TRUE, FALSE),
          ('plot-3', 'PLOT-003', 'Siddipet', 'Hyderabad', '300 sq yards', 'South', 1800000, 
           'Prime location plot in Siddipet with great investment potential', 
           'https://images.unsplash.com/photo-1560449018-8e5f71b4c0c?w=800', 
           'Available', TRUE, FALSE, TRUE)
      `);
      
      logger.info('Sample data inserted');
    }

    logger.info('Database tables created successfully');
    return true;
  } catch (error) {
    logger.error('Error creating tables:', error);
    return false;
  }
};

// Initialize database on import
createTables().then(success => {
  if (success) {
    logger.info('✅ Database initialized successfully');
  } else {
    logger.error('❌ Database initialization failed');
  }
});
