import {
  User,
  Business,
  Catalog,
  Category,
  Product,
  PublicCatalogPayload,
  AnalyticsData,
} from '../types';

const TOKEN_KEY = 'catafy_auth_token';
const LEGACY_TOKEN_KEY = 'catalogohub_auth_token';

export const api = {
  getToken(): string | null {
    try {
      return localStorage.getItem(TOKEN_KEY) || localStorage.getItem(LEGACY_TOKEN_KEY);
    } catch {
      return null;
    }
  },

  setToken(token: string) {
    try {
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.removeItem(LEGACY_TOKEN_KEY);
    } catch {
      // ignore
    }
  },

  clearToken() {
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(LEGACY_TOKEN_KEY);
    } catch {
      // ignore
    }
  },

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken();
    const headers = new Headers(options.headers || {});

    if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
      headers.set('Content-Type', 'application/json');
    }

    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    const res = await fetch(`/api${endpoint}`, {
      ...options,
      headers,
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data.error || data.message || `Erro na requisição (${res.status})`);
    }

    return data as T;
  },

  // Auth
  async register(name: string, email: string, password: string, confirmPassword?: string) {
    const res = await this.request<{ token: string; user: User; message: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, confirmPassword }),
    });
    this.setToken(res.token);
    return res;
  },

  async login(email: string, password: string) {
    const res = await this.request<{ token: string; user: User; message: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.setToken(res.token);
    return res;
  },

  async recoverPassword(email: string) {
    return this.request<{ message: string }>('/auth/recover-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  async getMe() {
    return this.request<{ user: User }>('/auth/me');
  },

  // Businesses
  async getBusinesses() {
    return this.request<{ businesses: Business[] }>('/businesses');
  },

  async createBusiness(data: Partial<Business>) {
    return this.request<{ business: Business; categories: Category[] }>('/businesses', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateBusiness(id: string, data: Partial<Business>) {
    return this.request<{ business: Business }>(`/businesses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteBusiness(id: string) {
    return this.request<{ success: boolean; message: string }>(`/businesses/${id}`, {
      method: 'DELETE',
    });
  },

  // Catalogs
  async getCatalogs() {
    return this.request<{ catalogs: Catalog[] }>('/catalogs');
  },

  async getCatalog(id: string) {
    return this.request<{ catalog: Catalog; business: Business; categories: Category[]; products: Product[] }>(`/catalogs/${id}`);
  },

  async createCatalog(data: Partial<Catalog>) {
    return this.request<{ catalog: Catalog }>('/catalogs', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateCatalog(id: string, data: Partial<Catalog>) {
    return this.request<{ catalog: Catalog }>(`/catalogs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteCatalog(id: string) {
    return this.request<{ success: boolean; message: string }>(`/catalogs/${id}`, {
      method: 'DELETE',
    });
  },

  // Categories
  async getCategories(businessId: string) {
    return this.request<{ categories: Category[] }>(`/categories?businessId=${encodeURIComponent(businessId)}`);
  },

  async createCategory(business_id: string, name: string, sort_order?: number) {
    return this.request<{ category: Category }>('/categories', {
      method: 'POST',
      body: JSON.stringify({ business_id, name, sort_order }),
    });
  },

  async updateCategory(id: string, data: Partial<Category>) {
    return this.request<{ category: Category }>(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteCategory(id: string) {
    return this.request<{ success: boolean }>(`/categories/${id}`, {
      method: 'DELETE',
    });
  },

  // Products
  async getProducts(businessId: string, categoryId?: string) {
    let url = `/products?businessId=${encodeURIComponent(businessId)}`;
    if (categoryId) url += `&categoryId=${encodeURIComponent(categoryId)}`;
    return this.request<{ products: Product[] }>(url);
  },

  async createProduct(data: Partial<Product>) {
    return this.request<{ product: Product }>('/products', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateProduct(id: string, data: Partial<Product>) {
    return this.request<{ product: Product }>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async duplicateProduct(id: string) {
    return this.request<{ product: Product }>(`/products/${id}/duplicate`, {
      method: 'POST',
    });
  },

  async deleteProduct(id: string) {
    return this.request<{ success: boolean }>(`/products/${id}`, {
      method: 'DELETE',
    });
  },

  // Analytics
  async getAnalytics(businessId?: string, catalogId?: string) {
    let url = '/analytics';
    const params = new URLSearchParams();
    if (businessId) params.append('businessId', businessId);
    if (catalogId) params.append('catalogId', catalogId);
    if (params.toString()) url += `?${params.toString()}`;
    return this.request<AnalyticsData>(url);
  },

  // Upload
  async uploadImage(dataUrl: string, filename?: string) {
    return this.request<{ url: string }>('/upload', {
      method: 'POST',
      body: JSON.stringify({ dataUrl, filename }),
    });
  },

  // Public Catalog
  async getPublicCatalog(slug: string) {
    return this.request<PublicCatalogPayload>(`/public/catalogs/${encodeURIComponent(slug)}`);
  },

  async trackPublicView(catalog_id: string, referrer?: string) {
    try {
      await this.request('/public/track/view', {
        method: 'POST',
        body: JSON.stringify({ catalog_id, referrer: referrer || document.referrer || 'direct' }),
      });
    } catch {
      // quiet tracking
    }
  },

  async trackWhatsAppClick(catalog_id: string, product_id?: string | null, product_name?: string | null, message_snippet?: string) {
    try {
      await this.request('/public/track/whatsapp', {
        method: 'POST',
        body: JSON.stringify({ catalog_id, product_id, product_name, message_snippet }),
      });
    } catch {
      // quiet tracking
    }
  },

  // Admin
  async getAdminOverview() {
    return this.request<{
      totalUsers: number;
      totalBusinesses: number;
      totalCatalogs: number;
      totalProducts: number;
      totalViews: number;
      totalWhatsAppClicks: number;
    }>('/admin/overview');
  },

  async getAdminUsers() {
    return this.request<{ users: User[] }>('/admin/users');
  },

  async toggleSuspendUser(id: string) {
    return this.request<{ user: User; message: string }>(`/admin/users/${id}/toggle-suspend`, {
      method: 'POST',
    });
  },

  async updateUserPlan(id: string, plan_id: string) {
    return this.request<{ user: User; message: string }>(`/admin/users/${id}/update-plan`, {
      method: 'POST',
      body: JSON.stringify({ plan_id }),
    });
  },
};
