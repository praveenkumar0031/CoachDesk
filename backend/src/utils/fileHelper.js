const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '../data/coaches.json');

// Read JSON data
const readData = () => {
  if (!fs.existsSync(DATA_FILE)) return [];
  const data = fs.readFileSync(DATA_FILE, 'utf8');
  return JSON.parse(data || '[]');
};

// Write JSON data
const writeData = (data) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

module.exports = { readData, writeData };
