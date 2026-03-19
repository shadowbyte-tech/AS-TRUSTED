const { createClient } = require('@libsql/client');

async function checkTables() {
  try {
    const db = createClient({ url: 'file:./data/as-trusted.db' });
    
    const result = await db.execute('SELECT name FROM sqlite_master WHERE type="table"');
    console.log('📋 Tables in database:');
    result.rows.forEach(row => console.log('  -', row.name));
    
    // Check properties table structure
    const propertiesResult = await db.execute('PRAGMA table_info(properties)');
    console.log('\n🏠 Properties table columns:');
    propertiesResult.rows.forEach(col => console.log('  -', col.name, ':', col.type));
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkTables();
