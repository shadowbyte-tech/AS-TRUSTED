import { promises as fs } from 'fs';
import path from 'path';

async function fixDuplicatePlotNumbers() {
  try {
    const dataDir = path.join(process.cwd(), 'data');
    const plotsData = await fs.readFile(path.join(dataDir, 'plots.json'), 'utf8');
    const plots = JSON.parse(plotsData);
    
    // Track plot numbers
    const plotNumbers = new Set();
    const duplicates = [];
    
    // Fix duplicates by adding suffixes
    const fixedPlots = plots.map((plot, index) => {
      let plotNumber = plot.plotNumber;
      let suffix = '';
      let counter = 1;
      
      while (plotNumbers.has(plotNumber + suffix)) {
        suffix = `-${counter}`;
        counter++;
      }
      
      plotNumbers.add(plotNumber + suffix);
      
      if (suffix) {
        duplicates.push({
          originalId: plot.id,
          originalNumber: plot.plotNumber,
          newNumber: plotNumber + suffix,
          villageName: plot.villageName
        });
      }
      
      return {
        ...plot,
        plotNumber: plotNumber + suffix
      };
    });
    
    // Save fixed data
    await fs.writeFile(
      path.join(dataDir, 'plots.json'),
      JSON.stringify(fixedPlots, null, 2),
      'utf8'
    );
    
    console.log(`✅ Fixed ${duplicates.length} duplicate plot numbers`);
    console.log('📝 Duplicates fixed:', duplicates);
    
    return {
      success: true,
      duplicatesFixed: duplicates.length,
      totalPlots: fixedPlots.length,
      duplicates: duplicates
    };
    
  } catch (error) {
    console.error('❌ Failed to fix duplicates:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Run the fix
fixDuplicatePlotNumbers().then(result => {
  console.log('Result:', result);
});
