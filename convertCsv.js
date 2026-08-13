import fs from 'fs';
import { parse } from 'csv-parse/sync';
import { stringify } from 'csv-stringify/sync';

const inputPath = 'C:\\Users\\cta10\\Downloads\\Shrisai CMS\\products.csv';
const outputPath = 'C:\\Users\\cta10\\Downloads\\Ready_To_Import_Products.csv';

// Read the old CSV
const rawContent = fs.readFileSync(inputPath, 'utf8');
const inputContent = rawContent.replace(/^\uFEFF/, '');
const records = parse(inputContent, {
  columns: true,
  skip_empty_lines: true
});

const templatePath = 'C:\\Users\\cta10\\Downloads\\Wix_Store_Products_Template.csv';
const templateContent = fs.readFileSync(templatePath, 'utf8');
const templateHeaders = templateContent.split('\n')[0].trim().split(',');

const outputRecords = [];

for (const record of records) {
  // Extract images - ensure 'Product Image' is first!
  const images = [];
  const addImage = (url) => {
    if (url && url.startsWith('wix:image')) {
      const match = url.match(/wix:image:\/\/v1\/([^/]+)/);
      if (match && match[1]) images.push(`https://static.wixstatic.com/media/${match[1]}`);
    }
  };
  
  // 1. Add Main Image first
  addImage(record['Product Image']);
  
  // 2. Add Gallery Images
  for (const key of Object.keys(record)) {
    if (key.includes('Gallery')) {
      addImage(record[key]);
    }
  }

  let title = record['Product Title'] || 'Unnamed Product';
  if (title.length > 80) {
    const truncated = title.substring(0, 80);
    const lastSpace = truncated.lastIndexOf(' ');
    title = lastSpace > 0 ? truncated.substring(0, lastSpace) : truncated;
  }

  const handle = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  let ribbon = '';
  if (record['Is Best Seller'] === 'true') ribbon = 'Best Seller';
  else if (record['New Arrival'] === 'true') ribbon = 'New Arrival';
  
  // 1. Create PRODUCT row
  const productRow = {};
  for (const header of templateHeaders) {
    productRow[header] = '';
  }

  productRow['handle'] = handle;
  productRow['fieldType'] = 'PRODUCT';
  productRow['name'] = title;
  productRow['visible'] = 'TRUE';
  productRow['plainDescription'] = record['Description'] || '';
  
  // Fix category slugs so they don't end in dashes (which caused partial imports)
  const safeCategory = record['Category'] ? record['Category'].trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : '';
  productRow['categorySlugs'] = safeCategory;
  productRow['primaryCategorySlug'] = safeCategory;
  
  productRow['ribbon'] = ribbon;
  productRow['price'] = record['Our Price (Selling Price)'] || '';
  productRow['strikethroughPrice'] = record['MRP (Original Price)'] || '';
  productRow['cost'] = record['Purchase Price'] || '';
  
  // Fix inventory so it doesn't pass an empty string or whitespace (which caused the 4 failures)
  if (record['Enable Inventory Tracking'] === 'true') {
    const stock = record['Stock Quantity'] ? record['Stock Quantity'].trim() : '';
    productRow['inventory'] = stock ? stock : '0';
  } else {
    productRow['inventory'] = 'IN_STOCK';
  }
  
  productRow['sku'] = record['SKU Code'] || '';
  
  outputRecords.push(productRow);

  // 2. Create MEDIA rows for each image
  for (const imgUrl of images) {
    const mediaRow = {};
    for (const header of templateHeaders) {
      mediaRow[header] = '';
    }
    mediaRow['handle'] = handle;
    mediaRow['fieldType'] = 'MEDIA';
    mediaRow['media'] = imgUrl;
    outputRecords.push(mediaRow);
  }
}

const outputCsv = stringify(outputRecords, { header: true, columns: templateHeaders });
fs.writeFileSync(outputPath, outputCsv);
console.log(`Successfully converted ${outputRecords.length} products to ${outputPath}`);
