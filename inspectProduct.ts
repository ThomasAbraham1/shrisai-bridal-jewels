import { createClient, OAuthStrategy } from '@wix/sdk';
import { collections } from '@wix/stores';

const wixClient = createClient({
  modules: { collections },
  auth: OAuthStrategy({ clientId: '92d2529f-5c59-4a09-9313-b0766785a9f3' }),
});

wixClient.collections.queryCollections().limit(2).find()
  .then(res => console.log(JSON.stringify(res.items, null, 2)))
  .catch(console.error);
