import fs from 'fs';
import { parse } from 'csv-parse/sync';

const inputPath = 'C:\\Users\\cta10\\Downloads\\Shrisai CMS\\products.csv';

const rawContent = fs.readFileSync(inputPath, 'utf8');
const inputContent = rawContent.replace(/^\uFEFF/, '');
const records = parse(inputContent, {
  columns: true,
  skip_empty_lines: true
});

const map = {};

for (const record of records) {
  const sku = record['SKU Code'] || '';
  const category = record['Category'] || '';
  if (sku) {
    map[sku] = category;
  }
}

fs.writeFileSync('C:\\Projects\\Shrisai Bridal Jewels\\src\\integrations\\categoryMap.json', JSON.stringify(map, null, 2));
console.log('Successfully created categoryMap.json');
