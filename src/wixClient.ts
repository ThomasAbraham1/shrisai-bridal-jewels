import { createClient, OAuthStrategy } from '@wix/sdk';
import { products, collections } from '@wix/stores';
import { currentCart, checkout } from '@wix/ecom';
import { redirects } from '@wix/redirects';
import { items } from '@wix/data';

const wixClient = createClient({
  modules: {
    products,
    collections,
    currentCart,
    checkout,
    redirects,
    items,
  },
  auth: OAuthStrategy({
    clientId: import.meta.env.VITE_WIX_CLIENT_ID,
  }),
});

export default wixClient;
