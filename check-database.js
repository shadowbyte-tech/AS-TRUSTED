import { createClient } from '@libsql/client';

async function checkDatabase() {
  const db = createClient({ url: 'file:./data/as-trusted.db' });
  
  try {
    // Check all properties
    const allResult = await db.execute('SELECT COUNT(*) as count FROM properties');
    console.log('✅ Total Properties:', allResult.rows[0].count);
    
    // Check by type
    const plotResult = await db.execute("SELECT COUNT(*) as count FROM properties WHERE property_type = 'Plot'");
    const houseResult = await db.execute("SELECT COUNT(*) as count FROM properties WHERE property_type = 'House'");
    const landResult = await db.execute("SELECT COUNT(*) as count FROM properties WHERE property_type = 'Land'");
    
    console.log('📊 Properties by Type:');
    console.log('  Plots:', plotResult.rows[0].count);
    console.log('  Houses:', houseResult.rows[0].count);
    console.log('  Land:', landResult.rows[0].count);
    
    // Check by category
    const normalResult = await db.execute("SELECT COUNT(*) as count FROM properties WHERE category = 'Normal'");
    const premiumResult = await db.execute("SELECT COUNT(*) as count FROM properties WHERE category = 'Premium'");
    const luxuryResult = await db.execute("SELECT COUNT(*) as count FROM properties WHERE category = 'Luxury'");
    
    console.log('\n📊 Properties by Category:');
    console.log('  Normal:', normalResult.rows[0].count);
    console.log('  Premium:', premiumResult.rows[0].count);
    console.log('  Luxury:', luxuryResult.rows[0].count);
    
    // Show actual Normal properties
    const normalProperties = await db.execute("SELECT id, property_number, property_type, village_name, category, status, created_at FROM properties WHERE category = 'Normal'");
    console.log('\n📋 Normal Properties:');
    normalProperties.rows.forEach(row => {
      console.log(`  ${row.property_number} (${row.property_type}) - ${row.village_name} - ${row.status} - Created: ${row.created_at}`);
    });
    
    // Show ALL properties to debug
    const allProperties = await db.execute("SELECT id, property_number, property_type, village_name, category, status, created_at FROM properties");
    console.log('\n📋 ALL Properties:');
    allProperties.rows.forEach(row => {
      console.log(`  ${row.property_number} (${row.property_type}) - ${row.village_name} - Category: ${row.category} - ${row.status} - Created: ${row.created_at}`);
    });
    
    console.log('\n🎉 Complete Property System Ready!');
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkDatabase();