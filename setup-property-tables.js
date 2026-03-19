import { createClient } from "@libsql/client/http";

// Database connection
const db = createClient({
  url: process.env.TURSO_DATABASE_URL || 'file:./data/as-trusted.db',
  authToken: process.env.TURSO_AUTH_TOKEN,
});

// Create property tables
async function createPropertyTables() {
  try {
    console.log('Creating property tables...');
    
    // Create unified properties table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS properties (
        id TEXT PRIMARY KEY,
        property_number TEXT NOT NULL,
        property_type TEXT NOT NULL CHECK (property_type IN ('Plot', 'House', 'Land')),
        village_name TEXT NOT NULL,
        area_name TEXT NOT NULL,
        image_url TEXT,
        image_hint TEXT,
        description TEXT,
        price INTEGER,
        price_negotiable BOOLEAN DEFAULT FALSE,
        status TEXT DEFAULT 'Available' CHECK (status IN ('Available', 'Reserved', 'Sold', 'Under Negotiation', 'Under Construction')),
        category TEXT DEFAULT 'Normal' CHECK (category IN ('Normal', 'Premium', 'Luxury')),
        images TEXT, -- JSON array
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Plot-specific fields
    await db.execute(`
      CREATE TABLE IF NOT EXISTS plot_details (
        property_id TEXT PRIMARY KEY,
        plot_size TEXT NOT NULL,
        plot_facing TEXT CHECK (plot_facing IN ('North', 'South', 'East', 'West', 'North-East', 'North-West', 'South-East', 'South-West')),
        price_per_sqft INTEGER,
        FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
      )
    `);

    // House-specific fields
    await db.execute(`
      CREATE TABLE IF NOT EXISTS house_details (
        property_id TEXT PRIMARY KEY,
        house_size TEXT NOT NULL,
        bedrooms INTEGER NOT NULL,
        bathrooms INTEGER NOT NULL,
        floors INTEGER NOT NULL,
        house_type TEXT CHECK (house_type IN ('Independent', 'Villa', 'Apartment', 'Duplex', 'Penthouse')),
        furnished BOOLEAN DEFAULT FALSE,
        parking BOOLEAN DEFAULT FALSE,
        amenities TEXT, -- JSON array
        year_built INTEGER,
        FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
      )
    `);

    // Land-specific fields
    await db.execute(`
      CREATE TABLE IF NOT EXISTS land_details (
        property_id TEXT PRIMARY KEY,
        land_size TEXT NOT NULL,
        land_type TEXT CHECK (land_type IN ('Agricultural', 'Commercial', 'Residential', 'Industrial')),
        zoning TEXT NOT NULL,
        road_access BOOLEAN DEFAULT FALSE,
        water_connection BOOLEAN DEFAULT FALSE,
        electricity_connection BOOLEAN DEFAULT FALSE,
        soil_type TEXT,
        topography TEXT,
        FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
      )
    `);

    console.log('Property tables created successfully');
    
    // Check if tables exist
    const tables = await db.execute("SELECT name FROM sqlite_master WHERE type='table' AND name LIKE '%property%' OR name LIKE '%plot%' OR name LIKE '%house%' OR name LIKE '%land%'");
    console.log('Tables created:', tables.rows);
    
  } catch (error) {
    console.error('Error creating property tables:', error);
    throw error;
  }
}

// Run the function
createPropertyTables().then(() => {
  console.log('Setup completed successfully');
  process.exit(0);
}).catch(err => {
  console.error('Setup failed:', err);
  process.exit(1);
});
