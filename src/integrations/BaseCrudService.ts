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

// In-memory cache for dynamic category lookup from Wix
let cachedCategoryMap: Record<string, string> | null = null;
let lastCategoryFetch = 0;

async function getCategoryLookup(): Promise<Record<string, string>> {
  const now = Date.now();
  if (cachedCategoryMap && (now - lastCategoryFetch < 60000)) {
    return cachedCategoryMap;
  }
  try {
    const result = await wixClient.categories.queryCategories({
      treeReference: { appNamespace: '@wix/stores' }
    }).eq('visible', true).find();
    
    const map: Record<string, string> = {};
    result.items.forEach(c => {
      if (c._id && c.name) {
        map[c._id] = c.name;
      }
    });
    cachedCategoryMap = map;
    lastCategoryFetch = now;
    return map;
  } catch (error) {
    console.warn('Failed to load dynamic category map from Wix:', error);
    return cachedCategoryMap || {};
  }
}

// ─── Map a Wix Stores product to the old Products entity shape ───────────────
function mapWixProduct(p: any, collectionMap: Record<string, string> = {}): Products {
  const media = p.media?.items ?? [];
  const mainImage = media[0]?.image?.url ?? p.media?.mainMedia?.image?.url ?? '';
  const gallery = media.slice(1).map((m: any) => m.image?.url ?? '');

  const priceOriginal = p.price?.price ?? 0;
  const priceDiscounted = p.price?.discountedPrice ?? priceOriginal;
  const hasDiscount = priceDiscounted < priceOriginal;

  // Resolve category name(s) dynamically from Wix Store category IDs (collectionIds)
  const matchedCategories = (p.collectionIds || [])
    .map((id: string) => collectionMap[id])
    .filter(Boolean);

  const categoryNames = matchedCategories.length > 0
    ? matchedCategories.join(', ')
    : ((p.sku && (categoryMap as any)[p.sku]) ? (categoryMap as any)[p.sku] : (p.name ?? ''));

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
      try {
        const result = await wixClient.categories.queryCategories({
          treeReference: { appNamespace: '@wix/stores' }
        }).eq('visible', true).find();
        
        const sortedItems = [...result.items].sort((a, b) => (a.parentCategory?.index ?? 0) - (b.parentCategory?.index ?? 0));
        const items = sortedItems.map((c, index) => ({
          _id: c._id ?? '',
          categoryName: c.name ?? '',
          categoryImage: parseWixImageUrl(c.media?.mainMedia?.image?.url ?? ''),
          slug: c.slug ?? '',
          displayOrder: index + 1,
        })) as unknown as T[];
        return { items, hasNext: false };
      } catch (e) {
        console.error('Failed to query categories in BaseCrudService:', e);
        return { items: [], hasNext: false };
      }
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
      const categoryLookup = await getCategoryLookup();
      const limit = options.limit ?? 200;
      let query = wixClient.products.queryProducts();
      if (limit) query = query.limit(limit > 100 ? 100 : limit);
      
      const result = await query.find();
      const items = result.items.map(p => mapWixProduct(p, categoryLookup)) as unknown as T[];
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
      const categoryLookup = await getCategoryLookup();
      const result = await wixClient.products.getProduct(id);
      const product = result?.product || result;
      return mapWixProduct(product, categoryLookup) as unknown as T;
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
