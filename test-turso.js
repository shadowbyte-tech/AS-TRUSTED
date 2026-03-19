// Quick Turso connection test
const { createClient } = require('@libsql/client');

async function testTursoConnection() {
  try {
    console.log('Testing Turso connection...');
    
    const db = createClient({
      url: process.env.TURSO_DATABASE_URL || 'libsql://as-trusted-db-xxxxx.turso.io',
      authToken: process.env.TURSO_AUTH_TOKEN || 'your-token-here',
    });

    // Test query
    const result = await db.execute('SELECT COUNT(*) as count FROM plots');
    console.log('✅ Turso connection successful!');
    console.log(`📊 Found ${result.rows[0].count} plots in database`);
    
    return true;
  } catch (error) {
    console.error('❌ Turso connection failed:', error.message);
    return false;
  }
}

testTursoConnection();
