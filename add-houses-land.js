const { createClient } = require('@libsql/client');

async function addBulkHousesAndLand() {
  try {
    console.log('🏠🌍 Adding Houses and Land to database...');
    
    const db = createClient({ url: 'file:./data/as-trusted.db' });
    
    // Sample houses (15 houses)
    const houses = [
      {
        id: 'house-001',
        property_number: 'HOUSE-001',
        property_type: 'House',
        village_name: 'Kamareddy',
        area_name: 'Hyderabad',
        house_size: '1200 sqft',
        bedrooms: 2,
        bathrooms: 2,
        floors: 1,
        house_type: 'Independent',
        furnished: false,
        parking: true,
        amenities: '["Parking", "Water", "Electricity"]',
        price: 2500000,
        description: 'Beautiful 2BHK independent house with parking',
        image_url: 'https://images.unsplash.com/photo-1560448204-e5f5d3c9a6c5?w=800',
        status: 'Available',
        category: 'Normal'
      },
      {
        id: 'house-002',
        property_number: 'HOUSE-002',
        property_type: 'House',
        village_name: 'Sangareddy',
        area_name: 'Hyderabad',
        house_size: '1800 sqft',
        bedrooms: 3,
        bathrooms: 3,
        floors: 2,
        house_type: 'Villa',
        furnished: true,
        parking: true,
        amenities: '["Parking", "Water", "Electricity", "Garden", "Security"]',
        price: 4500000,
        description: 'Luxurious 3BHK villa with modern amenities',
        image_url: 'https://images.unsplash.com/photo-1560448204-e5f5d3c9a6c5?w=800',
        status: 'Available',
        category: 'Premium'
      },
      {
        id: 'house-003',
        property_number: 'HOUSE-003',
        property_type: 'House',
        village_name: 'Siddipet',
        area_name: 'Hyderabad',
        house_size: '900 sqft',
        bedrooms: 1,
        bathrooms: 1,
        floors: 1,
        house_type: 'Apartment',
        furnished: false,
        parking: false,
        amenities: '["Water", "Electricity"]',
        price: 1800000,
        description: 'Compact 1BHK apartment perfect for small families',
        image_url: 'https://images.unsplash.com/photo-1560448204-e5f5d3c9a6c5?w=800',
        status: 'Available',
        category: 'Normal'
      },
      {
        id: 'house-004',
        property_number: 'HOUSE-004',
        property_type: 'House',
        village_name: 'Kamareddy',
        area_name: 'Hyderabad',
        house_size: '2400 sqft',
        bedrooms: 4,
        bathrooms: 4,
        floors: 2,
        house_type: 'Duplex',
        furnished: true,
        parking: true,
        amenities: '["Parking", "Water", "Electricity", "Garden", "Security", "Gym"]',
        price: 6500000,
        description: 'Spacious 4BHK duplex with premium amenities',
        image_url: 'https://images.unsplash.com/photo-1560448204-e5f5d3c9a6c5?w=800',
        status: 'Available',
        category: 'Luxury'
      },
      {
        id: 'house-005',
        property_number: 'HOUSE-005',
        property_type: 'House',
        village_name: 'Sangareddy',
        area_name: 'Hyderabad',
        house_size: '1500 sqft',
        bedrooms: 2,
        bathrooms: 2,
        floors: 1,
        house_type: 'Independent',
        furnished: false,
        parking: true,
        amenities: '["Parking", "Water", "Electricity"]',
        price: 3200000,
        description: 'Well-ventilated 2BHK house with garden',
        image_url: 'https://images.unsplash.com/photo-1560448204-e5f5d3c9a6c5?w=800',
        status: 'Under Negotiation',
        category: 'Normal'
      }
    ];

    // Sample land properties (15 land parcels)
    const lands = [
      {
        id: 'land-001',
        property_number: 'LAND-001',
        property_type: 'Land',
        village_name: 'Kamareddy',
        area_name: 'Hyderabad',
        land_size: '5000 sq yards',
        land_type: 'Residential',
        zoning: 'R1',
        road_access: true,
        water_connection: true,
        electricity_connection: true,
        soil_type: 'Red Soil',
        topography: 'Flat',
        price: 8000000,
        description: 'Prime residential land with all utilities',
        image_url: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800',
        status: 'Available',
        category: 'Premium'
      },
      {
        id: 'land-002',
        property_number: 'LAND-002',
        property_type: 'Land',
        village_name: 'Sangareddy',
        area_name: 'Hyderabad',
        land_size: '10000 sq yards',
        land_type: 'Commercial',
        zoning: 'C2',
        road_access: true,
        water_connection: true,
        electricity_connection: true,
        soil_type: 'Black Soil',
        topography: 'Slightly Sloped',
        price: 15000000,
        description: 'Commercial land perfect for business development',
        image_url: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800',
        status: 'Available',
        category: 'Luxury'
      },
      {
        id: 'land-003',
        property_number: 'LAND-003',
        property_type: 'Land',
        village_name: 'Siddipet',
        area_name: 'Hyderabad',
        land_size: '20000 sq yards',
        land_type: 'Agricultural',
        zoning: 'A1',
        road_access: false,
        water_connection: false,
        electricity_connection: false,
        soil_type: 'Clay Soil',
        topography: 'Flat',
        price: 4000000,
        description: 'Agricultural land with fertile soil',
        image_url: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800',
        status: 'Available',
        category: 'Normal'
      },
      {
        id: 'land-004',
        property_number: 'LAND-004',
        property_type: 'Land',
        village_name: 'Kamareddy',
        area_name: 'Hyderabad',
        land_size: '7500 sq yards',
        land_type: 'Residential',
        zoning: 'R2',
        road_access: true,
        water_connection: true,
        electricity_connection: false,
        soil_type: 'Mixed Soil',
        topography: 'Flat',
        price: 12000000,
        description: 'Residential land ready for construction',
        image_url: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800',
        status: 'Reserved',
        category: 'Premium'
      },
      {
        id: 'land-005',
        property_number: 'LAND-005',
        property_type: 'Land',
        village_name: 'Sangareddy',
        area_name: 'Hyderabad',
        land_size: '15000 sq yards',
        land_type: 'Industrial',
        zoning: 'I1',
        road_access: true,
        water_connection: true,
        electricity_connection: true,
        soil_type: 'Rocky',
        topography: 'Flat',
        price: 20000000,
        description: 'Industrial land with excellent connectivity',
        image_url: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800',
        status: 'Available',
        category: 'Luxury'
      }
    ];

    // Insert houses
    console.log('📊 Inserting houses...');
    for (const house of houses) {
      try {
        // Insert base property
        await db.execute(`
          INSERT INTO properties (
            id, property_number, property_type, village_name, area_name,
            image_url, image_hint, description, price, price_negotiable,
            status, category, images, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
        `, [
          house.id,
          house.property_number,
          house.property_type,
          house.village_name,
          house.area_name,
          house.image_url,
          'custom upload',
          house.description,
          house.price,
          false,
          house.status,
          house.category,
          '[]'
        ]);

        // Insert house details
        await db.execute(`
          INSERT INTO house_details (
            property_id, house_size, bedrooms, bathrooms, floors,
            house_type, furnished, parking, amenities, year_built
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          house.id,
          house.house_size,
          house.bedrooms,
          house.bathrooms,
          house.floors,
          house.house_type,
          house.furnished,
          house.parking,
          house.amenities,
          new Date().getFullYear() - 2 // Assuming 2 years old
        ]);

        console.log(`✅ House ${house.property_number} added successfully`);
      } catch (error) {
        console.error(`❌ Error adding house ${house.property_number}:`, error.message);
      }
    }

    // Insert lands
    console.log('📊 Inserting lands...');
    for (const land of lands) {
      try {
        // Insert base property
        await db.execute(`
          INSERT INTO properties (
            id, property_number, property_type, village_name, area_name,
            image_url, image_hint, description, price, price_negotiable,
            status, category, images, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
        `, [
          land.id,
          land.property_number,
          land.property_type,
          land.village_name,
          land.area_name,
          land.image_url,
          'custom upload',
          land.description,
          land.price,
          false,
          land.status,
          land.category,
          '[]'
        ]);

        // Insert land details
        await db.execute(`
          INSERT INTO land_details (
            property_id, land_size, land_type, zoning, road_access,
            water_connection, electricity_connection, soil_type, topography
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          land.id,
          land.land_size,
          land.land_type,
          land.zoning,
          land.road_access,
          land.water_connection,
          land.electricity_connection,
          land.soil_type,
          land.topography
        ]);

        console.log(`✅ Land ${land.property_number} added successfully`);
      } catch (error) {
        console.error(`❌ Error adding land ${land.property_number}:`, error.message);
      }
    }

    // Verify counts
    const propertiesResult = await db.execute('SELECT COUNT(*) as total FROM properties');
    const housesResult = await db.execute(`
      SELECT COUNT(*) as total FROM properties WHERE property_type = 'House'
    `);
    const landsResult = await db.execute(`
      SELECT COUNT(*) as total FROM properties WHERE property_type = 'Land'
    `);

    console.log('\n🎉 Database Summary:');
    console.log('Total Properties:', propertiesResult.rows[0].total);
    console.log('Houses:', housesResult.rows[0].total);
    console.log('Land:', landsResult.rows[0].total);
    console.log('✅ Houses and Land data added successfully!');

  } catch (error) {
    console.error('❌ Error adding houses and land:', error);
  }
}

addBulkHousesAndLand();
