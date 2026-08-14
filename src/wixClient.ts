import { createClient, OAuthStrategy } from '@wix/sdk';
import { products, collections } from '@wix/stores';
import { currentCart, checkout } from '@wix/ecom';
import { redirects } from '@wix/redirects';
import { items } from '@wix/data';
import { members } from '@wix/members';

// Attempt to load existing tokens from local storage
let tokens = undefined;
try {
  const storedTokens = localStorage.getItem('wix_tokens');
  if (storedTokens) {
    tokens = JSON.parse(storedTokens);
  }
} catch (e) {
  console.warn('Failed to parse Wix tokens from local storage', e);
}

const wixClient = createClient({
  modules: {
    products,
    collections,
    currentCart,
    checkout,
    redirects,
    items,
    members,
  },
  auth: OAuthStrategy({
    clientId: import.meta.env.VITE_WIX_CLIENT_ID,
    tokens,
  }),
});

export default wixClient;
