// Direct database test without Next.js
const { createClient } = require('@libsql/client');

async function testDirectDB() {
  try {
    console.log('🔧 Testing direct database connection...');
    
    const db = createClient({ url: 'file:./data/as-trusted.db' });
    const result = await db.execute('SELECT * FROM plots ORDER BY created_at DESC');
    
    console.log('✅ Database working!');
    console.log('📊 Found', result.rows.length, 'plots:');
    result.rows.forEach((plot, index) => {
      console.log(`  ${index + 1}. ${plot.plot_number} - ${plot.village_name} - ₹${plot.price}`);
    });
    
    return result.rows;
  } catch (error) {
    console.error('❌ Database failed:', error.message);
    return [];
  }
}

testDirectDB();
