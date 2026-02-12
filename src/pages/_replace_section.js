const fs = require('fs');

const mainFile = 'c:/Users/abdo_/Desktop/My Apps/memora/src/pages/LandingPageNew.js';
const newSectionFile = 'c:/Users/abdo_/Desktop/My Apps/memora/src/pages/_features_section.tmp.jsx';

const content = fs.readFileSync(mainFile, 'utf8');
const lines = content.split(/\r?\n/);

const newSection = fs.readFileSync(newSectionFile, 'utf8').split(/\r?\n/);

// Features section: lines 889-1037 (1-indexed)
// In 0-indexed: 888-1036
// Keep lines 0-887 (before), insert new section, then lines 1037+ (after)
const before = lines.slice(0, 888);   // lines 1-888
const after = lines.slice(1037);      // lines 1038+

const result = [...before, ...newSection, ...after];

fs.writeFileSync(mainFile, result.join('\r\n'), 'utf8');

console.log(`Done. Before: ${lines.length} lines, After: ${result.length} lines`);
console.log(`Kept ${before.length} lines before, inserted ${newSection.length} new lines, kept ${after.length} lines after`);
