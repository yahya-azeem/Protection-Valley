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
  stock: number;
  size?: string;
  color?: string;
  pack_quantity: number;
  texture?: string;
  image_url?: string;
  images: string[];
  in_stock: boolean;
  wholesale_price?: number;
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
  id?: number;
  name: string;
  email: string;
  role: 'retail' | 'wholesale' | 'admin' | 'Member';
  token?: string;
  provider?: string;
  picture?: string;
  wholesale_discount?: number;
}


export interface ApiProduct {
  id?: number;
  name: string;
  description?: string;
  price: number;
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

export interface OrderItem {
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  sku?: string;
}

export interface Address {
  first_name: string;
  last_name: string;
  address_line1: string;
  address_line2?: string | null;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone?: string | null;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'completed' | 'cancelled';

export interface Order {
  id: string;
  customer_id: number;
  customer_name: string;
  customer_email: string;
  items: OrderItem[];
  subtotal: number;
  shipping_cost: number;
  sales_tax: number;
  total: number;
  status: OrderStatus;
  shipping_address: Address;
  payment_method: string;
  carrier?: string | null;
  tracking_number?: string | null;
  shipping_label_url?: string | null;
  shipping_label_printed: boolean;
  shipping_label_printed_at?: string | null;
  created_at: string;
  updated_at: string;
}
