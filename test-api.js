// Test the API endpoint to see what data is being returned
async function testAPI() {
  try {
    console.log('🔍 Testing /api/properties endpoint...\n');
    
    const response = await fetch('http://localhost:9002/api/properties');
    const data = await response.json();
    
    console.log('📊 API Response Status:', response.status);
    console.log('📊 Total Properties Returned:', data.data?.length || 0);
    
    if (data.data && data.data.length > 0) {
      console.log('\n📋 All Properties from API:');
      data.data.forEach((property, index) => {
        console.log(`${index + 1}. ${property.propertyNumber} (${property.propertyType})`);
        console.log(`   Village: ${property.villageName}`);
        console.log(`   Category: ${property.category}`);
        console.log(`   Status: ${property.status}`);
        console.log(`   Created: ${property.createdAt}`);
        console.log(`   Price: ${property.price}`);
        console.log(`   Full Property:`, JSON.stringify(property, null, 2));
        console.log('');
      });
      
      // Filter for Normal properties
      const normalProperties = data.data.filter(p => p.category === 'Normal');
      console.log(`🎯 Normal Properties: ${normalProperties.length}`);
      normalProperties.forEach((property, index) => {
        console.log(`${index + 1}. ${property.propertyNumber} - ${property.villageName} - ${property.status}`);
        console.log(`   Has required House fields:`, {
          houseSize: property.houseSize,
          bedrooms: property.bedrooms,
          bathrooms: property.bathrooms,
          floors: property.floors
        });
      });
    } else {
      console.log('❌ No properties returned from API');
    }
    
  } catch (error) {
    console.error('❌ Error testing API:', error.message);
  }
}

testAPI();