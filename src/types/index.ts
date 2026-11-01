export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  plan_id: 'free' | 'pro' | 'business';
  is_suspended: boolean;
  created_at: string;
  businessesCount?: number;
  catalogsCount?: number;
}

export type BusinessCategory =
  | 'restaurant'
  | 'pizzeria'
  | 'fashion'
  | 'barbershop'
  | 'supermarket'
  | 'bakery'
  | 'services'
  | 'other';

export interface Business {
  id: string;
  user_id: string;
  name: string;
  category: BusinessCategory;
  description: string;
  logo_url: string;
  cover_url: string;
  phone: string;
  whatsapp: string;
  address: string;
  instagram?: string;
  facebook?: string;
  website?: string;
  created_at: string;
}

export type CatalogTemplate = 'classic' | 'modern' | 'premium' | 'minimal' | 'compact';
export type CatalogTypography = 'moderna' | 'elegante' | 'minimalista' | 'contemporanea' | 'comercial';

export interface Catalog {
  id: string;
  business_id: string;
  user_id: string;
  title: string;
  slug: string;
  description: string;
  template: CatalogTemplate;
  typography?: CatalogTypography;
  primary_color: string;
  secondary_color: string;
  font_family: string;
  cover_url: string;
  logo_url: string;
  welcome_message: string;
  currency: string;
  allow_orders: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  business?: Business;
}

export interface Category {
  id: string;
  business_id: string;
  name: string;
  sort_order: number;
}

export interface Product {
  id: string;
  business_id: string;
  category_id: string;
  name: string;
  description: string;
  price: number;
  promo_price?: number | null;
  image_url: string;
  is_available: boolean;
  sort_order: number;
  segment_data?: {
    ingredients?: string;
    sizes?: { name: string; price: number }[];
    colors?: string[];
    clothing_sizes?: string[];
    service_duration?: string;
    sku?: string;
  };
  created_at: string;
}

export interface PublicCatalogPayload {
  catalog: Catalog;
  business: Business;
  categories: Category[];
  products: Product[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: { name: string; price: number };
  selectedColor?: string;
  selectedClothingSize?: string;
  notes?: string;
}

export interface AnalyticsData {
  totalViews: number;
  totalClicks: number;
  overallConversionRate: string;
  timeline: { date: string; views: number; clicks: number }[];
  topProducts: { name: string; count: number }[];
  catalogs: {
    id: string;
    title: string;
    slug: string;
    views: number;
    clicks: number;
    conversionRate: string;
  }[];
}
