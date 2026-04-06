export interface ProductColor {
  name: string;
  hex: string;
  image: string;
}

export interface ProductVariant {
  id: number;
  product_id: number;
  sku: string;
  ebay_item_id?: string;
  original_name: string;
  price: number;
  wholesale_price: number;
  stock: number;
  size?: string;
  color?: string;
  pack_quantity: number;
  texture?: string;
  image_url?: string;
  images: string[];
  in_stock: boolean;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  category: string;
  image_url: string;
  images: string[];
  model_number: string;
  variants: ProductVariant[];
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  id: number | string;
  variant_id?: number | string;
  ebay_id: string;
  name: string;
  price: number;
  image: string;
  color?: string;
  size?: string;
  texture?: string;
  quantity: number;
}

export interface UserData {
  name: string;
  email: string;
  role: 'retail' | 'wholesale' | 'admin';
  provider?: string;
}

export interface ApiProduct {
  id?: number;
  name: string;
  description?: string;
  price: number;
  wholesale_price?: number;
  category?: string;
  type?: string;
  image_url?: string;
  image?: string;
  images?: string[];
  sizes?: string[];
  colors?: ProductColor[];
  stock?: number;
}

export interface SyncResponse {
  synced: number;
  created: number;
  updated: number;
  errors: string[];
}

export type SortOption = 'featured' | 'price-low' | 'price-high' | 'name';

export interface Review {
  id: string;
  user_id: number;
  product_id: number;
  user_name: string;
  rating: number;
  comment: string;
  is_verified: boolean;
  created_at: string;
}

export interface CreateReviewRequest {
  product_id: number;
  rating: number;
  comment: string;
}
