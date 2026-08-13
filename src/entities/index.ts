/**
 * Auto-generated entity types
 * Contains all CMS collection interfaces in a single file 
 * NOTE: Runtime placeholder consts below are needed because TypeScript interfaces
 * are erased at compile time and Vite's ES module resolution requires actual exports.
 */

// Runtime placeholders — TypeScript merges these with the interface declarations below
export const BusinessInformation = null as unknown as BusinessInformation;
export const ContactInquiries = null as unknown as ContactInquiries;
export const ShopbyCategory = null as unknown as ShopbyCategory;
export const Products = null as unknown as Products;
export const RentalProducts = null as unknown as RentalProducts;
export const RentByCategory = null as unknown as RentByCategory;
export const Videos = null as unknown as Videos;

/**
 * Collection ID: businessinformation
 * Interface for BusinessInformation
 */
export interface BusinessInformation {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  address?: string;
  /** @wixFieldType text */
  phoneNumber?: string;
  /** @wixFieldType text */
  workingHours?: string;
  /** @wixFieldType text */
  whatsAppNumber?: string;
  /** @wixFieldType url */
  mapLink?: string;
}


/**
 * Collection ID: contactinquiries
 * Interface for ContactInquiries
 */
export interface ContactInquiries {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  name?: string;
  /** @wixFieldType text */
  email?: string;
  /** @wixFieldType text */
  phone?: string;
  /** @wixFieldType text */
  message?: string;
  /** @wixFieldType text */
  inquiryType?: string;
}


/**
 * Collection ID: jewellerycategories
 * Interface for ShopbyCategory
 */
export interface ShopbyCategory {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  categoryName?: string;
  /** @wixFieldType image - Contains image URL, render with <Image> component, NOT as text */
  categoryImage?: string;
  /** @wixFieldType text */
  description?: string;
  /** @wixFieldType text */
  slug?: string;
  /** @wixFieldType boolean */
  isFeatured?: boolean;
  /** @wixFieldType number */
  displayOrder?: number;
}


/**
 * Collection ID: jewelleryproducts
 * @catalog This collection is an eCommerce catalog
 * Interface for Products
 */
export interface Products {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType boolean */
  enableDiscount?: boolean;
  /** @wixFieldType image - Contains image URL, render with <Image> component, NOT as text */
  consolidatedProductGallery?: string;
  /** @wixFieldType image - Contains image URL, render with <Image> component, NOT as text */
  productGallery5?: string;
  /** @wixFieldType image - Contains image URL, render with <Image> component, NOT as text */
  productGallery4?: string;
  /** @wixFieldType image - Contains image URL, render with <Image> component, NOT as text */
  productGallery3?: string;
  /** @wixFieldType image - Contains image URL, render with <Image> component, NOT as text */
  productGallery2?: string;
  /** @wixFieldType boolean */
  featuredProduct?: boolean;
  /** @wixFieldType number */
  reviewCount?: number;
  /** @wixFieldType number */
  averageRating?: number;
  /** @wixFieldType number */
  initialSoldCount?: number;
  /** @wixFieldType boolean */
  enableInventoryTracking?: boolean;
  /** @wixFieldType number */
  stockQuantity?: number;
  /** @wixFieldType text */
  skuCode?: string;
  /** @wixFieldType image - Contains image URL, render with <Image> component, NOT as text */
  productGallery?: string;
  /** @wixFieldType number */
  ourPrice?: number;
  /** @wixFieldType number */
  mrp?: number;
  /** @wixFieldType boolean */
  isBestSeller?: boolean;
  /** @wixFieldType boolean */
  newArrival?: boolean;
  /** @wixFieldType text */
  itemName?: string;
  /** @wixFieldType image - Contains image URL, render with <Image> component, NOT as text */
  itemImage?: string;
  /** @wixFieldType text */
  itemDescription?: string;
  /** @wixFieldType number */
  itemPrice?: number;
  /** @wixFieldType number */
  rentalPrice?: number;
  /** @wixFieldType text */
  category?: string;
  /** @wixFieldType boolean */
  isAvailable?: boolean;
  /** @wixFieldType text */
  specifications?: string;
}


/**
 * Collection ID: rentalproducts
 * @catalog This collection is an eCommerce catalog
 * Interface for RentalProducts
 */
export interface RentalProducts {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  name?: string;
  /** @wixFieldType image - Contains image URL, render with <Image> component, NOT as text */
  productGallery5?: string;
  /** @wixFieldType image - Contains image URL, render with <Image> component, NOT as text */
  productGallery4?: string;
  /** @wixFieldType image - Contains image URL, render with <Image> component, NOT as text */
  productGallery3?: string;
  /** @wixFieldType image - Contains image URL, render with <Image> component, NOT as text */
  productGallery2?: string;
  /** @wixFieldType image - Contains image URL, render with <Image> component, NOT as text */
  productGallery?: string;
  /** @wixFieldType text */
  rentalDurationTerms?: string;
  /** @wixFieldType boolean */
  availabilityStatus?: boolean;
  /** @wixFieldType number */
  price?: number;
  /** @wixFieldType image - Contains image URL, render with <Image> component, NOT as text */
  image?: string;
  /** @wixFieldType text */
  description?: string;
  /** @wixFieldType text */
  slug?: string;
}


/**
 * Collection ID: rentbycategory
 * Interface for RentByCategory
 */
export interface RentByCategory {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  categoryName?: string;
  /** @wixFieldType text */
  slug?: string;
  /** @wixFieldType number */
  displayOrder?: number;
}


/**
 * Collection ID: videos
 * Interface for Videos
 */
export interface Videos {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType image - Contains image URL, render with <Image> component, NOT as text */
  videoThumbnail?: string;
  /** @wixFieldType url */
  videoUrl?: string;
  /** @wixFieldType text */
  title?: string;
  /** @wixFieldType url */
  instagramLink?: string;
  /** @wixFieldType text */
  videoDuration?: string;
}
