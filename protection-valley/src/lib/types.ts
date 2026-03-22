export interface ProductColor {
  name: string;
  hex: string;
  image: string;
}

export interface Product {
  id: number | string;
  ebay_id: string;
  group_id?: string;
  name: string;
  price: number;
  quantity: number;
  sku?: string;
  model_number?: string;
  color?: string;
  size?: string;
  texture?: string;
  image_url?: string;
}

export interface GroupedProduct {
  model_number: string;
  name: string;
  category: string;
  description?: string;
  variants: Product[];
}

export interface CartItem {
  id: number | string;
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
