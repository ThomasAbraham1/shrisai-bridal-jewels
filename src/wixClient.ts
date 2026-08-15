import { createClient, OAuthStrategy } from '@wix/sdk';
import { products, collections } from '@wix/stores';
import { currentCart, checkout, orders } from '@wix/ecom';
import { redirects } from '@wix/redirects';
import { items } from '@wix/data';
import { members } from '@wix/members';
import { forms, submissions } from '@wix/forms';

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
    orders,
    redirects,
    items,
    members,
    forms,
    submissions,
  },
  auth: OAuthStrategy({
    clientId: import.meta.env.VITE_WIX_CLIENT_ID,
    tokens,
  }),
});

export default wixClient;
