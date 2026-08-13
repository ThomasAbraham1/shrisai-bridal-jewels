import { BaseCrudService } from './src/integrations/BaseCrudService.ts';

async function main() {
  try {
    console.log("Fetching rentbycategory...");
    const cats = await BaseCrudService.getAll('rentbycategory');
    console.log("Categories:", JSON.stringify(cats.items, null, 2));

    console.log("Fetching rentalproducts...");
    const prods = await BaseCrudService.getAll('rentalproducts');
    console.log("Products:", JSON.stringify(prods.items, null, 2));
  } catch (e) {
    console.error(e);
  }
}
main();
