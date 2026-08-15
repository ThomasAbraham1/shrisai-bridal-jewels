import { createClient, OAuthStrategy } from '@wix/sdk';
import { products } from '@wix/stores';

const wixClient = createClient({
  modules: {
    products,
  },
  auth: OAuthStrategy({
    clientId: '7031bfcc-0211-48b6-8c64-b800e80351b6',
  }),
});

async function main() {
  try {
    const res = await wixClient.products.queryProducts().limit(2).find();
    res.items.forEach((p: any) => {
      console.log(`Product: ${p.name}`);
      console.log(`collectionIds:`, p.collectionIds);
    });
  } catch (err) {
    console.error(err);
  }
}

main();
