const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = dir + '/' + file;
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else if (file.endsWith('route.ts')) {
            results.push(file);
        }
    });
    return results;
}

const routes = walk('src/app/api');
const targetLine = "export const dynamic = 'force-dynamic';";

let modifiedCount = 0;

for (const file of routes) {
    const originalContent = fs.readFileSync(file, 'utf8');
    let content = originalContent;
    
    // Remove existing instances of export const dynamic = 'force-dynamic'; 
    // to avoid redeclaration errors
    const dynamicRegex = /export\s+const\s+dynamic\s*=\s*['"]force-dynamic['"];?\s*\r?\n?/g;
    content = content.replace(dynamicRegex, '');
    
    // Add it exactly to the very top, before any imports
    const newContent = `${targetLine}\n\n${content.trimStart()}`;
    
    if (newContent !== originalContent) {
        fs.writeFileSync(file, newContent, 'utf8');
        modifiedCount++;
    }
}

console.log(`Successfully updated ${modifiedCount} out of ${routes.length} API route files.`);
