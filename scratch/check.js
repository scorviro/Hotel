const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../public/preloaderlogo.png');
const buffer = fs.readFileSync(filePath);

// Read PNG dimensions
const width = buffer.readInt32BE(16);
const height = buffer.readInt32BE(20);
const colorType = buffer.readUInt8(25);

console.log(`PNG Dimensions: ${width}x${height}`);
console.log(`Color Type: ${colorType} (6 means RGBA, 2 means RGB)`);
