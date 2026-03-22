export interface ProductColor {
  name: string;
  hex: string;
  image: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  wholesalePrice: number;
  category: string;
  type: string;
  image: string;
  images: string[];
  description: string;
  sizes: string[];
  colors: ProductColor[];
  stock: number;
  sku?: string;
  ebayId?: string;
}

export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  color: string;
  size: string;
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
