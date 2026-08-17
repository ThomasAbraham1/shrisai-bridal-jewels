/**
 * BaseCrudService - Shim that replaces @wix/codegen-framework-packages
 * Maps the old Wix Vibe CMS calls to the Wix Stores SDK (wixClient)
 */
import wixClient from '@/wixClient';
import type { Products, ShopbyCategory } from '@/entities';
import categoryMap from './categoryMap.json';


// ─── Map a Wix CMS Category ──────────────────────────────────────────────────
function parseWixImageUrl(wixUrl: string): string {
  if (!wixUrl) return '';
  if (wixUrl.startsWith('wix:image://v1/')) {
    const id = wixUrl.split('/')[3]; 
    return `https://static.wixstatic.com/media/${id}`;
  }
  return wixUrl;
}

function mapWixCategory(c: any): ShopbyCategory {
  return {
    _id: c._id ?? '',
    categoryName: c.data?.categoryName ?? c.categoryName ?? '',
    categoryImage: parseWixImageUrl(c.data?.categoryImage ?? c.categoryImage ?? ''),
    slug: c.data?.slug ?? c.slug ?? '',
    displayOrder: c.data?.displayOrder ?? c.displayOrder ?? 0,
  };
}

// Remove HARDCODED_CATEGORIES
// ─── Map a Wix Stores product to the old Products entity shape ───────────────
function mapWixProduct(p: any, collectionMap: Record<string, string> = {}): Products {
  const media = p.media?.items ?? [];
  const mainImage = media[0]?.image?.url ?? p.media?.mainMedia?.image?.url ?? '';
  const gallery = media.slice(1).map((m: any) => m.image?.url ?? '');

  const priceOriginal = p.price?.price ?? 0;
  const priceDiscounted = p.price?.discountedPrice ?? priceOriginal;
  const hasDiscount = priceDiscounted < priceOriginal;

  // Since Wix Headless Stores V3 SDK doesn't expose collection names dynamically yet,
  // we use the exact mapping from the original Wix CMS export based on the SKU!
  const categoryNames = (p.sku && categoryMap[p.sku as keyof typeof categoryMap]) ? categoryMap[p.sku as keyof typeof categoryMap] : (p.name ?? '');

  return {
    _id: p._id ?? '',
    itemName: p.name ?? '',
    itemImage: mainImage,
    itemDescription: p.description ?? '',
    ourPrice: priceDiscounted,
    mrp: priceOriginal,
    itemPrice: priceOriginal,
    enableDiscount: hasDiscount,
    isBestSeller: [p.ribbon, ...(p.ribbons ?? []), ...(p.additionalRibbons ?? [])].some((r: any) => {
      if (!r) return false;
      const text = (typeof r === 'string' ? r : (r.text || r.name || '')).toLowerCase();
      return text.includes('best seller') || text.includes('bestseller');
    }),
    newArrival: [p.ribbon, ...(p.ribbons ?? []), ...(p.additionalRibbons ?? [])].some((r: any) => {
      if (!r) return false;
      const text = (typeof r === 'string' ? r : (r.text || r.name || '')).toLowerCase();
      return text.includes('new');
    }),
    category: categoryNames,
    skuCode: p.sku ?? '',
    stockQuantity: p.stock?.quantity ?? (p.stock?.inStock ? 999 : 0),
    enableInventoryTracking: p.stock?.trackInventory ?? false,
    productGallery: gallery[0] ?? '',
    productGallery2: gallery[1] ?? '',
    productGallery3: gallery[2] ?? '',
    productGallery4: gallery[3] ?? '',
    productGallery5: gallery[4] ?? '',
    isAvailable: p.stock?.inStock ?? true,
  };
}

// ─── Public API ──────────────────────────────────────────────────────────────
export const BaseCrudService = {
  /**
   * Fetch all items from a collection.
   * Supports 'jewelleryproducts' and 'jewellerycategories'.
   */
  getAll: async <T>(
    collectionId: string,
    filters?: Record<string, any>,
    options: { limit?: number; skip?: number } = {}
  ): Promise<{ items: T[]; hasNext: boolean }> => {
    if (collectionId === 'jewellerycategories') {
      const items = [
        {
          _id: "afa487cd-c7b1-4f44-b6a1-3f572a79c747",
          categoryName: "Neckpiece",
          categoryImage: "https://static.wixstatic.com/media/b9ec8c_f90d908421184b2fa9199bfdaff85162~mv2.png",
          slug: "neckpiece",
          displayOrder: 1,
        },
        {
          _id: "1df5b053-c2c2-468a-b8c4-1ee7ae6db5ab",
          categoryName: "Earrings",
          categoryImage: "https://static.wixstatic.com/media/b9ec8c_6fa4292e82fc439e9ae319fed6a2932c~mv2.png",
          slug: "earrings",
          displayOrder: 2,
        },
        {
          _id: "3523ab16-e577-4826-90fd-2a1c95479f3a",
          categoryName: "Bangles",
          categoryImage: "https://static.wixstatic.com/media/b9ec8c_9b54d3ed68904e6d8b9ca068129c4708~mv2.png",
          slug: "bangles",
          displayOrder: 3,
        },
        {
          _id: "03c5ab36-695c-41a5-9f74-63e4e917a71c",
          categoryName: "Maatal",
          categoryImage: "https://static.wixstatic.com/media/b9ec8c_5b8770d16c5c4b7fadab8a8e8a064f1e~mv2.png",
          slug: "maatal",
          displayOrder: 4,
        },
        {
          _id: "0a06fc0d-72d1-4f0b-a3f0-56dfc742a687",
          categoryName: "Haaram",
          categoryImage: "https://static.wixstatic.com/media/b9ec8c_902402768f5b450ba11605ae629766ba~mv2.png",
          slug: "haaram",
          displayOrder: 5,
        },
        {
          _id: "e8675833-bbe4-4289-8a4f-3487f498ca18",
          categoryName: "Chutti",
          categoryImage: "https://static.wixstatic.com/media/b9ec8c_d986cd18b0f84281b88e2cc750af9660~mv2.png",
          slug: "chutti",
          displayOrder: 6,
        },
      ];
      return { items: items as unknown as T[], hasNext: false };
    }
    if (collectionId === 'rentbycategory') {
      const res = await wixClient.items.query('rentbycategory').find();
      const items = res.items.map(i => {
        const d = { ...i };
        if (d.categoryImage) d.categoryImage = parseWixImageUrl(d.categoryImage);
        return d;
      }) as unknown as T[];
      return { items, hasNext: false };
    }
    if (collectionId === 'rentalproducts') {
      const res = await wixClient.items.query('rentalproducts').find();
      const items = res.items.map(i => {
        const d = { ...i };
        if (d.image) d.image = parseWixImageUrl(d.image);
        if (d.productGallery) d.productGallery = parseWixImageUrl(d.productGallery);
        if (d.productGallery2) d.productGallery2 = parseWixImageUrl(d.productGallery2);
        if (d.productGallery3) d.productGallery3 = parseWixImageUrl(d.productGallery3);
        if (d.productGallery4) d.productGallery4 = parseWixImageUrl(d.productGallery4);
        if (d.productGallery5) d.productGallery5 = parseWixImageUrl(d.productGallery5);
        return d;
      }) as unknown as T[];
      return { items, hasNext: false };
    }

    if (collectionId === 'jewelleryproducts') {
      const limit = options.limit ?? 200;
      let query = wixClient.products.queryProducts();
      if (limit) query = query.limit(limit > 100 ? 100 : limit);
      
      const result = await query.find();
      const items = result.items.map(p => mapWixProduct(p, {})) as unknown as T[];
      return { items, hasNext: result.hasNext() };
    }

    try {
      const res = await wixClient.items.query(collectionId).find();
      const items = res.items.map(i => ({ ...i })) as unknown as T[];
      return { items, hasNext: false };
    } catch (error) {
      console.warn(`BaseCrudService.getAll: unknown/failed collection "${collectionId}"`, error);
      return { items: [], hasNext: false };
    }
  },

  /**
   * Fetch a single item by ID.
   */
  getById: async <T>(collectionId: string, id: string): Promise<T | null> => {
    if (collectionId === 'jewelleryproducts') {
      const result = await wixClient.products.getProduct(id);
      const product = result?.product || result;
      return mapWixProduct(product, {}) as unknown as T;
    }
    if (collectionId === 'rentalproducts') {
      const res = await wixClient.items.query('rentalproducts').eq('_id', id).find();
      const item = res.items[0];
      if (item) {
        const d = { ...item };
        if (d.image) d.image = parseWixImageUrl(d.image);
        if (d.productGallery) d.productGallery = parseWixImageUrl(d.productGallery);
        if (d.productGallery2) d.productGallery2 = parseWixImageUrl(d.productGallery2);
        if (d.productGallery3) d.productGallery3 = parseWixImageUrl(d.productGallery3);
        if (d.productGallery4) d.productGallery4 = parseWixImageUrl(d.productGallery4);
        if (d.productGallery5) d.productGallery5 = parseWixImageUrl(d.productGallery5);
        return d as unknown as T;
      }
      return null;
    }
    try {
      const res = await wixClient.items.query(collectionId).eq('_id', id).find();
      const item = res.items[0];
      if (item) return { ...item } as unknown as T;
      return null;
    } catch (error) {
      console.warn(`BaseCrudService.getById: unknown/failed collection "${collectionId}"`, error);
      return null;
    }
  },

  /**
   * Create a new item (e.g. contact enquiry) — no-op shim for now.
   */
  create: async <T>(_collectionId: string, _data: Partial<T>): Promise<T | null> => {
    console.warn('BaseCrudService.create: not implemented in headless mode');
    return null;
  },
};
