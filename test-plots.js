const { readPlots } = require('./src/lib/mongodb-database.js');

async function testPlots() {
  try {
    console.log('Testing plot data loading...');
    const plots = await readPlots();
    console.log('✅ Successfully loaded', plots.length, 'plots');
    
    if (plots.length > 0) {
      console.log('\n📋 Sample plot data:');
      console.log('First plot:', {
        id: plots[0].id,
        plotNumber: plots[0].plotNumber,
        villageName: plots[0].villageName,
        areaName: plots[0].areaName,
        price: plots[0].price
      });
    }
    
    console.log('\n🎉 Plot data loading is working correctly!');
  } catch (error) {
    console.error('❌ Error loading plots:', error.message);
  }
}

testPlots();
