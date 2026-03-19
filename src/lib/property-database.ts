import { createClient } from "@libsql/client";
import type { Property, Plot, House, Land } from './definitions';
import { logger } from "./logger";

// Database connection - use local SQLite for development
export const db = createClient({
  url: 'file:./data/as-trusted.db',
  // Remove Turso connection for local development
});

// Database initialization flag
let isTablesInitialized = false;

// Database schema for all property types
export const createPropertyTables = async () => {
  if (isTablesInitialized) return;
  try {
    logger.info('Creating property tables...');
    
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
        views INTEGER DEFAULT 0,
        last_viewed_at TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create property views tracking table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS property_views (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        property_id TEXT NOT NULL,
        ip_address TEXT NOT NULL,
        user_agent TEXT,
        viewed_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
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
        zoning TEXT,
        road_access BOOLEAN DEFAULT FALSE,
        water_connection BOOLEAN DEFAULT FALSE,
        electricity_connection BOOLEAN DEFAULT FALSE,
        soil_type TEXT,
        topography TEXT,
        FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
      )
    `);

    isTablesInitialized = true;
    logger.info('✅ Property tables created successfully');
  } catch (error) {
    logger.error('❌ Error creating property tables:', error);
    throw error;
  }
};

// Initialize tables on demand at runtime
// Handled inside readProperties to avoid build-time filesystem access

// Read all properties with their specific details
export async function readProperties(): Promise<Property[]> {
  // remove console.time for production performance
  try {
    // Ensure tables exist before first query at runtime
    if (!isTablesInitialized && (process.env.NODE_ENV !== 'production' || process.env.VERCEL)) {
       try { await createPropertyTables(); } catch (e) {}
    }
    
    // Get all properties with their specific details in a single query using LEFT JOINs
    // to avoid the N+1 query problem which was causing 10-20s delays.
    const propertiesResult = await db.execute(`
      SELECT 
        p.*, 
        pl.plot_size, pl.plot_facing, pl.price_per_sqft, 
        h.house_size, h.bedrooms, h.bathrooms, h.floors, h.house_type, h.furnished, h.parking, h.amenities, h.year_built,
        l.land_size, l.land_type, l.zoning, l.road_access, l.water_connection, l.electricity_connection, l.soil_type, l.topography
      FROM properties p
      LEFT JOIN plot_details pl ON p.id = pl.property_id
      LEFT JOIN house_details h ON p.id = h.property_id
      LEFT JOIN land_details l ON p.id = l.property_id
      ORDER BY p.created_at DESC
    `);

    const properties: Property[] = propertiesResult.rows.map(row => {
      const baseProperty = {
        id: row.id as string,
        propertyNumber: row.property_number as string,
        propertyType: row.property_type as 'Plot' | 'House' | 'Land',
        villageName: row.village_name as string,
        areaName: row.area_name as string,
        imageUrl: row.image_url as string || '',
        imageHint: row.image_hint as string || '',
        description: row.description as string || '',
        price: row.price as number || 0,
        priceNegotiable: Boolean(row.price_negotiable),
        status: row.status as any,
        category: row.category as any,
        images: row.images ? JSON.parse(row.images as string) : [],
        views: row.views as number || 0,
        lastViewedAt: row.last_viewed_at as string,
        createdAt: row.created_at as string,
        updatedAt: row.updated_at as string,
      };

      if (baseProperty.propertyType === 'Plot') {
        return {
          ...baseProperty,
          propertyType: 'Plot' as const,
          plotNumber: baseProperty.propertyNumber,
          plotSize: row.plot_size as string,
          plotFacing: row.plot_facing as any,
          pricePerSqft: row.price_per_sqft as number,
        } as Property;
      } else if (baseProperty.propertyType === 'House') {
        return {
          ...baseProperty,
          propertyType: 'House' as const,
          houseSize: row.house_size as string,
          bedrooms: row.bedrooms as number,
          bathrooms: row.bathrooms as number,
          floors: row.floors as number,
          houseType: row.house_type as any,
          furnished: Boolean(row.furnished),
          parking: Boolean(row.parking),
          amenities: row.amenities ? JSON.parse(row.amenities as string) : [],
          yearBuilt: row.year_built as number,
        } as Property;
      } else {
        return {
          ...baseProperty,
          propertyType: 'Land' as const,
          landSize: row.land_size as string,
          landType: row.land_type as any,
          zoning: row.zoning as string,
          roadAccess: Boolean(row.road_access),
          waterConnection: Boolean(row.water_connection),
          electricityConnection: Boolean(row.electricity_connection),
          soilType: row.soil_type as string,
          topography: row.topography as string,
        } as Property;
      }
    });

    // remove console.timeEnd
    return properties;
  } catch (error) {
    logger.error('Error reading properties:', error);
    throw error;
  }
}

// Create a new property with type-specific details
export async function createProperty(propertyData: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>): Promise<Property> {
  try {
    const propertyId = Math.random().toString(36).substr(2, 9);
    const now = new Date().toISOString();

    // Insert base property
    await db.execute(`
      INSERT INTO properties (
        id, property_number, property_type, village_name, area_name,
        image_url, image_hint, description, price, price_negotiable,
        status, category, images, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      propertyId,
      propertyData.propertyNumber,
      propertyData.propertyType,
      propertyData.villageName,
      propertyData.areaName,
      propertyData.imageUrl || null,
      propertyData.imageHint || null,
      propertyData.description || null,
      propertyData.price || 0,
      propertyData.priceNegotiable || false,
      propertyData.status || 'Available',
      propertyData.category || 'Normal',
      JSON.stringify(propertyData.images || []),
      now,
      now
    ]);

    // Insert type-specific details
    if (propertyData.propertyType === 'Plot') {
      const plot = propertyData as Plot;
      await db.execute(`
        INSERT INTO plot_details (
          property_id, plot_size, plot_facing, price_per_sqft
        ) VALUES (?, ?, ?, ?)
      `, [
        propertyId,
        plot.plotSize,
        plot.plotFacing || null,
        plot.pricePerSqft || null
      ]);
    } else if (propertyData.propertyType === 'House') {
      const house = propertyData as House;
      await db.execute(`
        INSERT INTO house_details (
          property_id, house_size, bedrooms, bathrooms, floors,
          house_type, furnished, parking, amenities, year_built
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        propertyId,
        house.houseSize,
        house.bedrooms || 1,
        house.bathrooms || 1,
        house.floors || 1,
        house.houseType || null,
        house.furnished || false,
        house.parking || false,
        JSON.stringify(house.amenities || []),
        house.yearBuilt || null
      ]);
    } else if (propertyData.propertyType === 'Land') {
      const land = propertyData as Land;
      await db.execute(`
        INSERT INTO land_details (
          property_id, land_size, land_type, zoning, road_access,
          water_connection, electricity_connection, soil_type, topography
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        propertyId,
        land.landSize,
        land.landType || null,
        land.zoning || null,
        land.roadAccess || false,
        land.waterConnection || false,
        land.electricityConnection || false,
        land.soilType || null,
        land.topography || null
      ]);
    }

    // Return the created property
    const createdProperty = await readProperties();
    return createdProperty.find(p => p.id === propertyId)!;
  } catch (error) {
    logger.error('Error creating property:', error);
    throw error;
  }
}

// Update an existing property
export async function updateProperty(propertyId: string, updates: Partial<Property>): Promise<Property> {
  try {
    const now = new Date().toISOString();
    
    // Update base property
    if (updates.propertyNumber || updates.propertyType || updates.villageName || updates.areaName ||
        updates.imageUrl || updates.imageHint || updates.description || updates.price !== undefined ||
        updates.priceNegotiable !== undefined || updates.status || updates.category || updates.images) {
      
      await db.execute(`
        UPDATE properties SET
          property_number = COALESCE(?, property_number),
          property_type = COALESCE(?, property_type),
          village_name = COALESCE(?, village_name),
          area_name = COALESCE(?, area_name),
          image_url = COALESCE(?, image_url),
          image_hint = COALESCE(?, image_hint),
          description = COALESCE(?, description),
          price = COALESCE(?, price),
          price_negotiable = COALESCE(?, price_negotiable),
          status = COALESCE(?, status),
          category = COALESCE(?, category),
          images = COALESCE(?, images),
          updated_at = ?
        WHERE id = ?
      `, [
        updates.propertyNumber || null,
        updates.propertyType || null,
        updates.villageName || null,
        updates.areaName || null,
        updates.imageUrl || null,
        updates.imageHint || null,
        updates.description || null,
        updates.price !== undefined ? updates.price : null,
        updates.priceNegotiable !== undefined ? updates.priceNegotiable : null,
        updates.status || null,
        updates.category || null,
        updates.images ? JSON.stringify(updates.images) : null,
        now,
        propertyId
      ]);
    }

    // Update type-specific details
    if (updates.propertyType === 'Plot' && ('plotSize' in updates || 'plotFacing' in updates || 'pricePerSqft' in updates)) {
      await db.execute(`
        UPDATE plot_details SET
          plot_size = COALESCE(?, plot_size),
          plot_facing = COALESCE(?, plot_facing),
          price_per_sqft = COALESCE(?, price_per_sqft)
        WHERE property_id = ?
      `, [
        'plotSize' in updates ? (updates.plotSize || null) : null,
        'plotFacing' in updates ? (updates.plotFacing || null) : null,
        'pricePerSqft' in updates ? (updates.pricePerSqft || null) : null,
        propertyId
      ]);
    } else if (updates.propertyType === 'House' && ('houseSize' in updates || 'bedrooms' in updates || 'bathrooms' in updates || 
             'houseType' in updates || 'furnished' in updates || 'parking' in updates || 'amenities' in updates || 'yearBuilt' in updates)) {
      
      await db.execute(`
        UPDATE house_details SET
          house_size = COALESCE(?, house_size),
          bedrooms = COALESCE(?, bedrooms),
          bathrooms = COALESCE(?, bathrooms),
          house_type = COALESCE(?, house_type),
          furnished = COALESCE(?, furnished),
          parking = COALESCE(?, parking),
          amenities = COALESCE(?, amenities),
          year_built = COALESCE(?, year_built)
        WHERE property_id = ?
      `, [
        'houseSize' in updates ? (updates.houseSize || null) : null,
        'bedrooms' in updates ? (updates.bedrooms || null) : null,
        'bathrooms' in updates ? (updates.bathrooms || null) : null,
        'houseType' in updates ? (updates.houseType || null) : null,
        'furnished' in updates ? (updates.furnished || null) : null,
        'parking' in updates ? (updates.parking || null) : null,
        'amenities' in updates ? (JSON.stringify(updates.amenities) || null) : null,
        'yearBuilt' in updates ? (updates.yearBuilt || null) : null,
        propertyId
      ]);
    } else if (updates.propertyType === 'Land' && ('landSize' in updates || 'landType' in updates || 'zoning' in updates || 
             'roadAccess' in updates || 'waterConnection' in updates || 'electricityConnection' in updates)) {
      
      await db.execute(`
        UPDATE land_details SET
          land_size = COALESCE(?, land_size),
          land_type = COALESCE(?, land_type),
          zoning = COALESCE(?, zoning),
          road_access = COALESCE(?, road_access),
          water_connection = COALESCE(?, water_connection),
          electricity_connection = COALESCE(?, electricity_connection)
        WHERE property_id = ?
      `, [
        'landSize' in updates ? (updates.landSize || null) : null,
        'landType' in updates ? (updates.landType || null) : null,
        'zoning' in updates ? (updates.zoning || null) : null,
        'roadAccess' in updates ? (updates.roadAccess || null) : null,
        'waterConnection' in updates ? (updates.waterConnection || null) : null,
        'electricityConnection' in updates ? (updates.electricityConnection || null) : null,
        propertyId
      ]);
    }

    // Return the updated property
    const updatedProperties = await readProperties();
    const updatedProperty = updatedProperties.find(p => p.id === propertyId);
    
    if (!updatedProperty) {
      throw new Error('Property not found after update');
    }
    
    return updatedProperty;
  } catch (error) {
    logger.error('Error updating property:', error);
    throw error;
  }
}

// Get a single property by ID
export async function getProperty(propertyId: string): Promise<Property | null> {
  try {
    const properties = await readProperties();
    return properties.find(p => p.id === propertyId) || null;
  } catch (error) {
    logger.error('Error getting property:', error);
    throw error;
  }
}

// Legacy compatibility - convert old plots to new format
export async function migrateLegacyPlots() {
  try {
    logger.info('🔄 Migrating legacy plots to new property system...');
    
    // Get legacy plots
    const legacyPlotsResult = await db.execute(`
      SELECT * FROM plots
    `);

    for (const legacyPlot of legacyPlotsResult.rows) {
      const newPropertyId = `legacy-${legacyPlot.id}`;
      const now = new Date().toISOString();

      // Insert as new property
      await db.execute(`
        INSERT INTO properties (
          id, property_number, property_type, village_name, area_name,
          image_url, image_hint, description, price, price_negotiable,
          status, category, images, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        newPropertyId,
        legacyPlot.plot_number,
        'Plot',
        legacyPlot.village_name,
        legacyPlot.area_name,
        legacyPlot.image_url,
        legacyPlot.image_hint || '',
        legacyPlot.description || '',
        legacyPlot.price,
        Boolean(legacyPlot.price_negotiable),
        legacyPlot.status || 'Available',
        legacyPlot.category || 'Normal',
        '[]',
        now,
        now
      ]);

      // Insert plot details
      await db.execute(`
        INSERT INTO plot_details (
          property_id, plot_size, plot_facing, price_per_sqft
        ) VALUES (?, ?, ?, ?)
      `, [
        newPropertyId,
        legacyPlot.plot_size,
        legacyPlot.plot_facing,
        legacyPlot.price_per_sqft
      ]);
    }

    logger.info('✅ Legacy plots migration completed');
  } catch (error) {
    logger.error('❌ Error migrating legacy plots:', error);
    throw error;
  }
}

// Clear all properties from database
export const clearProperties = async (): Promise<void> => {
  try {
    logger.info('Clearing all properties...');
    
    // Clear all tables
    await db.execute('DELETE FROM land_details');
    await db.execute('DELETE FROM house_details');
    await db.execute('DELETE FROM plot_details');
    await db.execute('DELETE FROM properties');
    
    logger.info('✅ All properties cleared');
  } catch (error) {
    logger.error('Error clearing properties:', error);
    throw error;
  }
}

// Delete a property by ID
export async function deleteProperty(propertyId: string): Promise<boolean> {
  try {
    // Delete from specific detail tables first (foreign key constraints)
    await db.execute('DELETE FROM plot_details WHERE property_id = ?', [propertyId]);
    await db.execute('DELETE FROM house_details WHERE property_id = ?', [propertyId]);
    await db.execute('DELETE FROM land_details WHERE property_id = ?', [propertyId]);
    
    // Delete from main properties table
    const result = await db.execute('DELETE FROM properties WHERE id = ?', [propertyId]);
    
    logger.info('✅ Property deleted:', propertyId);
    return result.rowsAffected > 0;
  } catch (error) {
    logger.error('Error deleting property:', error);
    return false;
  }
}

// Alias for getAllProperties for compatibility
export const getAllProperties = readProperties;
