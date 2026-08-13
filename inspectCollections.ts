import { createClient, OAuthStrategy } from '@wix/sdk';

const wixClient = createClient({
  auth: OAuthStrategy({ clientId: '92d2529f-5c59-4a09-9313-b0766785a9f3' }),
});

async function run() {
  const token = await wixClient.auth.generateVisitorTokens();
  const res = await fetch('https://www.wixapis.com/stores/v1/collections', {
    headers: {
      Authorization: token.accessToken.value
    }
  });
  console.log(await res.json());
}
run();
