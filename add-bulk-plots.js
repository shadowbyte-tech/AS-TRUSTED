const { createClient } = require('@libsql/client');

async function addBulkPlots() {
  try {
    console.log('🚀 Adding 40-50 plots to database...');
    
    const db = createClient({ url: 'file:./data/as-trusted.db' });
    
    // Sample plot data for 45 plots
    const plots = [
      // Kamareddy (15 plots) - Starting from plot-50
      { id: 'plot-50', plot_number: 'PLOT-050', village_name: 'Kamareddy', area_name: 'Hyderabad', plot_size: '200 sq yards', plot_facing: 'South', price: 1100000, description: 'Affordable plot in Kamareddy with good connectivity', image_url: 'https://images.unsplash.com/photo-1560449018-8e5f71b4c0c?w=800', status: 'Available' },
      { id: 'plot-51', plot_number: 'PLOT-051', village_name: 'Kamareddy', area_name: 'Hyderabad', plot_size: '250 sq yards', plot_facing: 'East', price: 1400000, description: 'Spacious plot with road access', image_url: 'https://images.unsplash.com/photo-1560449018-8e5f71b4c0c?w=800', status: 'Available' },
      { id: 'plot-52', plot_number: 'PLOT-052', village_name: 'Kamareddy', area_name: 'Hyderabad', plot_size: '300 sq yards', plot_facing: 'West', price: 1700000, description: 'Premium plot with DTCP approval', image_url: 'https://images.unsplash.com/photo-1560449018-8e5f71b4c0c?w=800', status: 'Available' },
      { id: 'plot-53', plot_number: 'PLOT-053', village_name: 'Kamareddy', area_name: 'Hyderabad', plot_size: '200 sq yards', plot_facing: 'North-East', price: 1200000, description: 'Vastu compliant plot in prime location', image_url: 'https://images.unsplash.com/photo-1560449018-8e5f71b4c0c?w=800', status: 'Available' },
      { id: 'plot-54', plot_number: 'PLOT-054', village_name: 'Kamareddy', area_name: 'Hyderabad', plot_size: '350 sq yards', plot_facing: 'North-West', price: 2000000, description: 'Large plot perfect for duplex construction', image_url: 'https://images.unsplash.com/photo-1560449018-8e5f71b4c0c?w=800', status: 'Available' },
      { id: 'plot-55', plot_number: 'PLOT-055', village_name: 'Kamareddy', area_name: 'Hyderabad', plot_size: '220 sq yards', plot_facing: 'South-East', price: 1300000, description: 'Corner plot with compound wall', image_url: 'https://images.unsplash.com/photo-1560449018-8e5f71b4c0c?w=800', status: 'Available' },
      { id: 'plot-56', plot_number: 'PLOT-056', village_name: 'Kamareddy', area_name: 'Hyderabad', plot_size: '280 sq yards', plot_facing: 'South-West', price: 1600000, description: 'Ready to construct with all amenities', image_url: 'https://images.unsplash.com/photo-1560449018-8e5f71b4c0c?w=800', status: 'Available' },
      { id: 'plot-57', plot_number: 'PLOT-057', village_name: 'Kamareddy', area_name: 'Hyderabad', plot_size: '200 sq yards', plot_facing: 'North', price: 1150000, description: 'Budget-friendly plot for first-time buyers', image_url: 'https://images.unsplash.com/photo-1560449018-8e5f71b4c0c?w=800', status: 'Available' },
      { id: 'plot-58', plot_number: 'PLOT-058', village_name: 'Kamareddy', area_name: 'Hyderabad', plot_size: '400 sq yards', plot_facing: 'East', price: 2300000, description: 'Ultra-premium plot with luxury amenities', image_url: 'https://images.unsplash.com/photo-1560449018-8e5f71b4c0c?w=800', status: 'Available' },
      { id: 'plot-13', plot_number: 'PLOT-013', village_name: 'Kamareddy', area_name: 'Hyderabad', plot_size: '180 sq yards', plot_facing: 'West', price: 1000000, description: 'Compact plot perfect for small families', image_url: 'https://images.unsplash.com/photo-1560449018-8e5f71b4c0c?w=800', status: 'Available' },
      { id: 'plot-14', plot_number: 'PLOT-014', village_name: 'Kamareddy', area_name: 'Hyderabad', plot_size: '250 sq yards', plot_facing: 'North', price: 1450000, description: 'Well-developed area with schools nearby', image_url: 'https://images.unsplash.com/photo-1560449018-8e5f71b4c0c?w=800', status: 'Available' },
      { id: 'plot-15', plot_number: 'PLOT-015', village_name: 'Kamareddy', area_name: 'Hyderabad', plot_size: '300 sq yards', plot_facing: 'South', price: 1750000, description: 'Investment plot with high appreciation potential', image_url: 'https://images.unsplash.com/photo-1560449018-8e5f71b4c0c?w=800', status: 'Available' },
      { id: 'plot-16', plot_number: 'PLOT-016', village_name: 'Kamareddy', area_name: 'Hyderabad', plot_size: '220 sq yards', plot_facing: 'East', price: 1250000, description: 'Near upcoming metro station', image_url: 'https://images.unsplash.com/photo-1560449018-8e5f71b4c0c?w=800', status: 'Available' },
      { id: 'plot-17', plot_number: 'PLOT-017', village_name: 'Kamareddy', area_name: 'Hyderabad', plot_size: '350 sq yards', plot_facing: 'West', price: 1950000, description: 'Premium corner plot with wide road access', image_url: 'https://images.unsplash.com/photo-1560449018-8e5f71b4c0c?w=800', status: 'Available' },
      { id: 'plot-18', plot_number: 'PLOT-018', village_name: 'Kamareddy', area_name: 'Hyderabad', plot_size: '200 sq yards', plot_facing: 'North-East', price: 1180000, description: 'Vastu compliant with water connection', image_url: 'https://images.unsplash.com/photo-1560449018-8e5f71b4c0c?w=800', status: 'Available' },
      
      // Sangareddy (15 plots)
      { id: 'plot-19', plot_number: 'PLOT-019', village_name: 'Sangareddy', area_name: 'Hyderabad', plot_size: '200 sq yards', plot_facing: 'North', price: 1350000, description: 'Prime location in Sangareddy with highway access', image_url: 'https://images.unsplash.com/photo-1560449018-8e5f71b4c0c?w=800', status: 'Available' },
      { id: 'plot-20', plot_number: 'PLOT-020', village_name: 'Sangareddy', area_name: 'Hyderabad', plot_size: '250 sq yards', plot_facing: 'East', price: 1650000, description: 'Spacious plot with excellent connectivity', image_url: 'https://images.unsplash.com/photo-1560449018-8e5f71b4c0c?w=800', status: 'Available' },
      { id: 'plot-21', plot_number: 'PLOT-021', village_name: 'Sangareddy', area_name: 'Hyderabad', plot_size: '300 sq yards', plot_facing: 'South', price: 1950000, description: 'Premium plot with all approvals', image_url: 'https://images.unsplash.com/photo-1560449018-8e5f71b4c0c?w=800', status: 'Available' },
      { id: 'plot-22', plot_number: 'PLOT-022', village_name: 'Sangareddy', area_name: 'Hyderabad', plot_size: '200 sq yards', plot_facing: 'West', price: 1400000, description: 'Affordable plot with good infrastructure', image_url: 'https://images.unsplash.com/photo-1560449018-8e5f71b4c0c?w=800', status: 'Available' },
      { id: 'plot-23', plot_number: 'PLOT-023', village_name: 'Sangareddy', area_name: 'Hyderabad', plot_size: '350 sq yards', plot_facing: 'North-East', price: 2250000, description: 'Large plot for luxury construction', image_url: 'https://images.unsplash.com/photo-1560449018-8e5f71b4c0c?w=800', status: 'Available' },
      { id: 'plot-24', plot_number: 'PLOT-024', village_name: 'Sangareddy', area_name: 'Hyderabad', plot_size: '220 sq yards', plot_facing: 'North-West', price: 1500000, description: 'Corner plot with compound wall', image_url: 'https://images.unsplash.com/photo-1560449018-8e5f71b4c0c?w=800', status: 'Available' },
      { id: 'plot-25', plot_number: 'PLOT-025', village_name: 'Sangareddy', area_name: 'Hyderabad', plot_size: '280 sq yards', plot_facing: 'South-East', price: 1800000, description: 'Ready to construct plot', image_url: 'https://images.unsplash.com/photo-1560449018-8e5f71b4c0c?w=800', status: 'Available' },
      { id: 'plot-26', plot_number: 'PLOT-026', village_name: 'Sangareddy', area_name: 'Hyderabad', plot_size: '200 sq yards', plot_facing: 'South-West', price: 1450000, description: 'Near IT corridor', image_url: 'https://images.unsplash.com/photo-1560449018-8e5f71b4c0c?w=800', status: 'Available' },
      { id: 'plot-27', plot_number: 'PLOT-027', village_name: 'Sangareddy', area_name: 'Hyderabad', plot_size: '400 sq yards', plot_facing: 'North', price: 2600000, description: 'Ultra-premium plot with luxury features', image_url: 'https://images.unsplash.com/photo-1560449018-8e5f71b4c0c?w=800', status: 'Available' },
      { id: 'plot-28', plot_number: 'PLOT-028', village_name: 'Sangareddy', area_name: 'Hyderabad', plot_size: '180 sq yards', plot_facing: 'East', price: 1250000, description: 'Budget plot for small families', image_url: 'https://images.unsplash.com/photo-1560449018-8e5f71b4c0c?w=800', status: 'Available' },
      { id: 'plot-29', plot_number: 'PLOT-029', village_name: 'Sangareddy', area_name: 'Hyderabad', plot_size: '250 sq yards', plot_facing: 'West', price: 1700000, description: 'Well-developed residential area', image_url: 'https://images.unsplash.com/photo-1560449018-8e5f71b4c0c?w=800', status: 'Available' },
      { id: 'plot-30', plot_number: 'PLOT-030', village_name: 'Sangareddy', area_name: 'Hyderabad', plot_size: '300 sq yards', plot_facing: 'South', price: 2000000, description: 'Investment plot with high returns', image_url: 'https://images.unsplash.com/photo-1560449018-8e5f71b4c0c?w=800', status: 'Available' },
      { id: 'plot-31', plot_number: 'PLOT-031', village_name: 'Sangareddy', area_name: 'Hyderabad', plot_size: '220 sq yards', plot_facing: 'North-East', price: 1550000, description: 'Near upcoming commercial complex', image_url: 'https://images.unsplash.com/photo-1560449018-8e5f71b4c0c?w=800', status: 'Available' },
      { id: 'plot-32', plot_number: 'PLOT-032', village_name: 'Sangareddy', area_name: 'Hyderabad', plot_size: '350 sq yards', plot_facing: 'North-West', price: 2300000, description: 'Premium corner plot', image_url: 'https://images.unsplash.com/photo-1560449018-8e5f71b4c0c?w=800', status: 'Available' },
      { id: 'plot-33', plot_number: 'PLOT-033', village_name: 'Sangareddy', area_name: 'Hyderabad', plot_size: '200 sq yards', plot_facing: 'South-East', price: 1480000, description: 'Vastu compliant with all amenities', image_url: 'https://images.unsplash.com/photo-1560449018-8e5f71b4c0c?w=800', status: 'Available' },
      
      // Siddipet (15 plots)
      { id: 'plot-34', plot_number: 'PLOT-034', village_name: 'Siddipet', area_name: 'Hyderabad', plot_size: '200 sq yards', plot_facing: 'North', price: 1600000, description: 'Prime location in Siddipet', image_url: 'https://images.unsplash.com/photo-1560449018-8e5f71b4c0c?w=800', status: 'Available' },
      { id: 'plot-35', plot_number: 'PLOT-035', village_name: 'Siddipet', area_name: 'Hyderabad', plot_size: '250 sq yards', plot_facing: 'East', price: 1900000, description: 'Spacious plot with excellent infrastructure', image_url: 'https://images.unsplash.com/photo-1560449018-8e5f71b4c0c?w=800', status: 'Available' },
      { id: 'plot-36', plot_number: 'PLOT-036', village_name: 'Siddipet', area_name: 'Hyderabad', plot_size: '300 sq yards', plot_facing: 'South', price: 2200000, description: 'Premium plot with DTCP approval', image_url: 'https://images.unsplash.com/photo-1560449018-8e5f71b4c0c?w=800', status: 'Available' },
      { id: 'plot-37', plot_number: 'PLOT-037', village_name: 'Siddipet', area_name: 'Hyderabad', plot_size: '200 sq yards', plot_facing: 'West', price: 1650000, description: 'Affordable plot in developing area', image_url: 'https://images.unsplash.com/photo-1560449018-8e5f71b4c0c?w=800', status: 'Available' },
      { id: 'plot-38', plot_number: 'PLOT-038', village_name: 'Siddipet', area_name: 'Hyderabad', plot_size: '350 sq yards', plot_facing: 'North-East', price: 2500000, description: 'Large plot for luxury homes', image_url: 'https://images.unsplash.com/photo-1560449018-8e5f71b4c0c?w=800', status: 'Available' },
      { id: 'plot-39', plot_number: 'PLOT-039', village_name: 'Siddipet', area_name: 'Hyderabad', plot_size: '220 sq yards', plot_facing: 'North-West', price: 1750000, description: 'Corner plot with wide road access', image_url: 'https://images.unsplash.com/photo-1560449018-8e5f71b4c0c?w=800', status: 'Available' },
      { id: 'plot-40', plot_number: 'PLOT-040', village_name: 'Siddipet', area_name: 'Hyderabad', plot_size: '280 sq yards', plot_facing: 'South-East', price: 2050000, description: 'Ready to construct with all facilities', image_url: 'https://images.unsplash.com/photo-1560449018-8e5f71b4c0c?w=800', status: 'Available' },
      { id: 'plot-41', plot_number: 'PLOT-041', village_name: 'Siddipet', area_name: 'Hyderabad', plot_size: '200 sq yards', plot_facing: 'South-West', price: 1700000, description: 'Near educational institutions', image_url: 'https://images.unsplash.com/photo-1560449018-8e5f71b4c0c?w=800', status: 'Available' },
      { id: 'plot-42', plot_number: 'PLOT-042', village_name: 'Siddipet', area_name: 'Hyderabad', plot_size: '400 sq yards', plot_facing: 'North', price: 2850000, description: 'Ultra-premium plot with luxury amenities', image_url: 'https://images.unsplash.com/photo-1560449018-8e5f71b4c0c?w=800', status: 'Available' },
      { id: 'plot-43', plot_number: 'PLOT-043', village_name: 'Siddipet', area_name: 'Hyderabad', plot_size: '180 sq yards', plot_facing: 'East', price: 1500000, description: 'Budget plot for first-time buyers', image_url: 'https://images.unsplash.com/photo-1560449018-8e5f71b4c0c?w=800', status: 'Available' },
      { id: 'plot-44', plot_number: 'PLOT-044', village_name: 'Siddipet', area_name: 'Hyderabad', plot_size: '250 sq yards', plot_facing: 'West', price: 1950000, description: 'Well-developed residential area', image_url: 'https://images.unsplash.com/photo-1560449018-8e5f71b4c0c?w=800', status: 'Available' },
      { id: 'plot-45', plot_number: 'PLOT-045', village_name: 'Siddipet', area_name: 'Hyderabad', plot_size: '300 sq yards', plot_facing: 'South', price: 2250000, description: 'Investment plot with high appreciation', image_url: 'https://images.unsplash.com/photo-1560449018-8e5f71b4c0c?w=800', status: 'Available' },
      { id: 'plot-46', plot_number: 'PLOT-046', village_name: 'Siddipet', area_name: 'Hyderabad', plot_size: '220 sq yards', plot_facing: 'North-East', price: 1800000, description: 'Near upcoming commercial hub', image_url: 'https://images.unsplash.com/photo-1560449018-8e5f71b4c0c?w=800', status: 'Available' },
      { id: 'plot-47', plot_number: 'PLOT-047', village_name: 'Siddipet', area_name: 'Hyderabad', plot_size: '350 sq yards', plot_facing: 'North-West', price: 2550000, description: 'Premium corner plot with luxury features', image_url: 'https://images.unsplash.com/photo-1560449018-8e5f71b4c0c?w=800', status: 'Available' },
      { id: 'plot-48', plot_number: 'PLOT-048', village_name: 'Siddipet', area_name: 'Hyderabad', plot_size: '200 sq yards', plot_facing: 'South-East', price: 1730000, description: 'Vastu compliant plot with all approvals', image_url: 'https://images.unsplash.com/photo-1560449018-8e5f71b4c0c?w=800', status: 'Available' }
    ];
    
    console.log(`📊 Inserting ${plots.length} plots...`);
    
    // Insert all plots
    for (const plot of plots) {
      await db.execute({
        sql: `
          INSERT INTO plots (id, plot_number, village_name, area_name, plot_size, plot_facing, price, description, image_url, status)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        args: [
          plot.id, plot.plot_number, plot.village_name, plot.area_name,
          plot.plot_size, plot.plot_facing, plot.price, plot.description,
          plot.image_url, plot.status
        ]
      });
    }
    
    // Verify insertion
    const result = await db.execute('SELECT COUNT(*) as count FROM plots');
    const totalPlots = result.rows[0].count;
    
    console.log(`✅ SUCCESS! Added ${plots.length} new plots`);
    console.log(`📊 Total plots in database: ${totalPlots}`);
    console.log(`🎯 Database is ready for production!`);
    
    return totalPlots;
    
  } catch (error) {
    console.error('❌ Error adding plots:', error.message);
    return 0;
  }
}

addBulkPlots();
