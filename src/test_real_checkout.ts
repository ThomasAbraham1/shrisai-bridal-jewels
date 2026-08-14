import { createClient, OAuthStrategy } from '@wix/sdk';
import { currentCart } from '@wix/ecom';

const wixClient = createClient({
  modules: { currentCart },
  auth: OAuthStrategy({
    clientId: '92d2529f-5c59-4a09-9313-b0766785a9f3',
  }),
});

async function testCheckout() {
  try {
    // Clear existing cart
    try { await wixClient.currentCart.deleteCurrentCart(); } catch (_) {}

    // Try adding with customLineItems (requires admin perms apparently)
    const result = await (wixClient.currentCart.addToCurrentCart as any)({
      customLineItems: [{
        quantity: 1,
        price: '2500',
        productName: { original: 'Royal Elephant Temple Maang Tika', translated: 'Royal Elephant Temple Maang Tika' },
        itemType: { preset: 'PHYSICAL' },
      }]
    });
    console.log("SUCCESS cart:", result.cart?._id);
    
    // Create checkout from cart
    const { checkoutId } = await wixClient.currentCart.createCheckoutFromCurrentCart({
      channelType: currentCart.ChannelType.WEB
    });
    console.log("checkoutId:", checkoutId);
  } catch (err: any) {
    console.error("ERROR:", err.details?.applicationError?.description || err.message);
  }
}

testCheckout();
