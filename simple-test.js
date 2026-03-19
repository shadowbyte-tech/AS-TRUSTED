const { createClient } = require('@libsql/client');

async function testDB() {
  try {
    console.log('Testing local SQLite...');
    const db = createClient({ url: 'file:./data/as-trusted.db' });
    const result = await db.execute('SELECT COUNT(*) as count FROM plots');
    console.log('SUCCESS: Found', result.rows[0].count, 'plots');
  } catch (error) {
    console.log('FAILED:', error.message);
  }
}

testDB();
