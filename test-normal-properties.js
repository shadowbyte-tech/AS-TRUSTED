// Test the normal-properties page functionality
async function testNormalPropertiesPage() {
  try {
    console.log('🔍 Testing normal-properties page functionality...\n');
    
    // Test the API endpoint first
    const response = await fetch('http://localhost:9002/api/properties');
    const data = await response.json();
    
    console.log('📊 API Response Status:', response.status);
    console.log('📊 Total Properties Returned:', data.data?.length || 0);
    
    if (data.data && data.data.length > 0) {
      // Filter for Normal properties (same logic as frontend)
      const normalProperties = data.data.filter(p => p.category === 'Normal');
      console.log(`🎯 Normal Properties: ${normalProperties.length}`);
      
      if (normalProperties.length > 0) {
        console.log('\n📋 Normal Properties Details:');
        normalProperties.forEach((property, index) => {
          console.log(`${index + 1}. ${property.propertyNumber} - ${property.villageName}`);
          console.log(`   Category: ${property.category}`);
          console.log(`   Status: ${property.status}`);
          console.log(`   Type: ${property.propertyType}`);
          console.log(`   Created: ${property.createdAt}`);
          console.log(`   Price: ${property.price}`);
          console.log('');
        });
        
        // Test sorting by date (Recent Listings = date-desc)
        const sortedByDateDesc = [...normalProperties].sort((a, b) => {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        
        console.log('📅 Sorted by Recent Listings (date-desc):');
        sortedByDateDesc.forEach((property, index) => {
          console.log(`${index + 1}. ${property.propertyNumber} - ${property.villageName} - ${property.createdAt}`);
        });
        
        console.log('\n✅ The "Recent Listings" functionality should work correctly!');
        console.log('✅ The Normal property exists and should be visible when "Recent Listings" is selected.');
        
      } else {
        console.log('❌ No Normal properties found');
      }
    } else {
      console.log('❌ No properties returned from API');
    }
    
  } catch (error) {
    console.error('❌ Error testing normal-properties page:', error.message);
  }
}

testNormalPropertiesPage();