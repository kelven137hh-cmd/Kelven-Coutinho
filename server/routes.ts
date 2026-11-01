import express, { Response } from 'express';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { db, hashPassword, verifyPassword, User, Business, Catalog, Category, Product } from './db.js';
import { generateToken, requireAuth, requireAdmin, AuthenticatedRequest } from './auth.js';

export const apiRouter = express.Router();

// Helper to create slugs
function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

// ==========================================
// 1. AUTHENTICATION & PROFILES
// ==========================================

apiRouter.post('/auth/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Por favor introduza o seu nome completo.' });
  }

  if (!email || !email.trim()) {
    return res.status(400).json({ error: 'Por favor introduza um endereço de email.' });
  }

  const normalizedEmail = email.toLowerCase().trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(normalizedEmail)) {
    return res.status(400).json({ error: 'Endereço de email inválido. Verifique o formato.' });
  }

  if (!password || password.length < 6) {
    return res.status(400).json({ error: 'A palavra-passe deve conter pelo menos 6 caracteres.' });
  }

  if (confirmPassword !== undefined && password !== confirmPassword) {
    return res.status(400).json({ error: 'As palavras-passe introduzidas não coincidem.' });
  }

  const existingUser = db.get('users').find((u) => u.email === normalizedEmail);
  if (existingUser) {
    return res.status(409).json({ error: 'Já existe uma conta associada a este endereço de email. Inicie sessão.' });
  }

  const newUser: User = {
    id: `usr_${crypto.randomUUID().substring(0, 8)}`,
    name: name.trim(),
    email: normalizedEmail,
    password_hash: hashPassword(password),
    role: 'user',
    plan_id: 'free',
    is_suspended: false,
    created_at: new Date().toISOString(),
  };

  db.update('users', (users) => [...users, newUser]);

  // Generate token and auto-login
  const token = generateToken(newUser);
  const { password_hash: _, ...safeUser } = newUser;

  return res.status(201).json({
    token,
    user: safeUser,
    message: 'Conta criada com sucesso! Bem-vindo ao Catafy.',
  });
});

apiRouter.post('/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !email.trim()) {
    return res.status(400).json({ error: 'Por favor introduza o seu endereço de email.' });
  }

  if (!password) {
    return res.status(400).json({ error: 'Por favor introduza a sua palavra-passe.' });
  }

  const normalizedEmail = email.toLowerCase().trim();
  const user = db.get('users').find((u) => u.email === normalizedEmail);

  if (!user) {
    return res.status(401).json({ error: 'Email não registado. Verifique o endereço ou crie uma nova conta.' });
  }

  if (!verifyPassword(password, user.password_hash)) {
    return res.status(401).json({ error: 'Palavra-passe incorreta. Por favor verifique e tente novamente.' });
  }

  if (user.is_suspended) {
    return res.status(403).json({ error: 'Sua conta foi suspensa pela administração do Catafy. Contacte o suporte.' });
  }

  const token = generateToken(user);
  const { password_hash: _, ...safeUser } = user;

  return res.json({
    token,
    user: safeUser,
    message: 'Sessão iniciada com sucesso no Catafy.',
  });
});

apiRouter.post('/auth/recover-password', (req, res) => {
  const { email } = req.body;
  if (!email || !email.trim()) {
    return res.status(400).json({ error: 'Por favor introduza o seu endereço de email.' });
  }

  const normalizedEmail = email.toLowerCase().trim();
  const user = db.get('users').find((u) => u.email === normalizedEmail);

  if (!user) {
    return res.status(404).json({ error: 'Não encontramos nenhuma conta com este endereço de email.' });
  }

  return res.json({
    message: `Instruções de recuperação foram enviadas para ${normalizedEmail}. Verifique a sua caixa de entrada.`,
  });
});

apiRouter.get('/auth/me', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { password_hash: _, ...safeUser } = req.user!;
  return res.json({ user: safeUser });
});

// ==========================================
// 2. BUSINESSES (MULTI-BUSINESS)
// ==========================================

apiRouter.get('/businesses', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const userBusinesses = db.get('businesses').filter((b) => b.user_id === userId);
  return res.json({ businesses: userBusinesses });
});

apiRouter.post('/businesses', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const { name, category, description, logo_url, cover_url, phone, whatsapp, address, instagram, facebook, website } = req.body;

  if (!name || !category) {
    return res.status(400).json({ error: 'Nome e segmento da empresa são obrigatórios.' });
  }

  const newBusiness: Business = {
    id: `biz_${crypto.randomUUID().substring(0, 8)}`,
    user_id: userId,
    name: name.trim(),
    category: category || 'restaurant',
    description: description || '',
    logo_url: logo_url || '',
    cover_url: cover_url || '',
    phone: phone || '',
    whatsapp: whatsapp || '',
    address: address || '',
    instagram: instagram || '',
    facebook: facebook || '',
    website: website || '',
    created_at: new Date().toISOString(),
  };

  db.update('businesses', (bizs) => [...bizs, newBusiness]);

  // Auto-create sample default category for ease of onboarding
  const defaultCategoryNames: Record<string, string[]> = {
    restaurant: ['Pratos Principais', 'Entradas', 'Bebidas'],
    pizzeria: ['Pizzas Salgadas', 'Pizzas Doces', 'Bebidas'],
    fashion: ['Vestuário', 'Calçado', 'Acessórios'],
    barbershop: ['Cortes', 'Barba', 'Tratamentos'],
    supermarket: ['Alimentação', 'Hortifruti', 'Bebidas'],
    bakery: ['Pães & Broas', 'Pastelaria', 'Cafetaria'],
    services: ['Serviços Principais', 'Consultoria'],
    other: ['Geral', 'Destaques'],
  };

  const initialCats = defaultCategoryNames[category] || ['Produtos Principais'];
  const newCategories: Category[] = initialCats.map((catName, idx) => ({
    id: `catg_${crypto.randomUUID().substring(0, 8)}`,
    business_id: newBusiness.id,
    name: catName,
    sort_order: idx + 1,
  }));

  db.update('categories', (cats) => [...cats, ...newCategories]);

  return res.status(201).json({ business: newBusiness, categories: newCategories });
});

apiRouter.put('/businesses/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const { id } = req.params;
  const updates = req.body;

  const currentBiz = db.get('businesses').find((b) => b.id === id && b.user_id === userId);
  if (!currentBiz) {
    return res.status(404).json({ error: 'Negócio não encontrado ou sem permissão.' });
  }

  const updatedBiz: Business = {
    ...currentBiz,
    ...updates,
    id: currentBiz.id,
    user_id: currentBiz.user_id,
  };

  db.update('businesses', (bizs) => bizs.map((b) => (b.id === id ? updatedBiz : b)));

  return res.json({ business: updatedBiz });
});

apiRouter.delete('/businesses/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const { id } = req.params;

  const currentBiz = db.get('businesses').find((b) => b.id === id && b.user_id === userId);
  if (!currentBiz) {
    return res.status(404).json({ error: 'Negócio não encontrado ou sem permissão.' });
  }

  // Cascade delete
  db.update('businesses', (bizs) => bizs.filter((b) => b.id !== id));
  db.update('catalogs', (cats) => cats.filter((c) => c.business_id !== id));
  db.update('products', (prods) => prods.filter((p) => p.business_id !== id));
  db.update('categories', (cats) => cats.filter((c) => c.business_id !== id));

  return res.json({ success: true, message: 'Negócio e todos os seus catálogos e produtos associados foram eliminados.' });
});

// ==========================================
// 3. CATALOGS
// ==========================================

apiRouter.get('/catalogs', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const userCatalogs = db.get('catalogs').filter((c) => c.user_id === userId);

  // Attach business info
  const businesses = db.get('businesses');
  const enrichedCatalogs = userCatalogs.map((catalog) => ({
    ...catalog,
    business: businesses.find((b) => b.id === catalog.business_id),
  }));

  return res.json({ catalogs: enrichedCatalogs });
});

apiRouter.get('/catalogs/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const { id } = req.params;
  const catalog = db.get('catalogs').find((c) => c.id === id && c.user_id === userId);
  if (!catalog) return res.status(404).json({ error: 'Catálogo não encontrado.' });

  const business = db.get('businesses').find((b) => b.id === catalog.business_id);
  const categories = db.get('categories').filter((cat) => cat.business_id === catalog.business_id);
  const products = db.get('products').filter((prod) => prod.business_id === catalog.business_id);

  return res.json({ catalog, business, categories, products });
});

apiRouter.post('/catalogs', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const {
    business_id,
    title,
    slug: rawSlug,
    description,
    template,
    typography,
    primary_color,
    secondary_color,
    font_family,
    cover_url,
    logo_url,
    welcome_message,
    currency,
    allow_orders,
    is_active,
  } = req.body;

  if (!business_id || !title) {
    return res.status(400).json({ error: 'Negócio e título do catálogo são obrigatórios.' });
  }

  // Check business ownership
  const business = db.get('businesses').find((b) => b.id === business_id && b.user_id === userId);
  if (!business) {
    return res.status(403).json({ error: 'Negócio inválido ou sem permissão.' });
  }

  // Ensure unique slug
  let candidateSlug = slugify(rawSlug || title);
  if (!candidateSlug) candidateSlug = `catalogo-${Date.now()}`;

  const existingSlug = db.get('catalogs').find((c) => c.slug === candidateSlug);
  if (existingSlug) {
    candidateSlug = `${candidateSlug}-${crypto.randomBytes(2).toString('hex')}`;
  }

  const newCatalog: Catalog = {
    id: `cat_${crypto.randomUUID().substring(0, 8)}`,
    business_id,
    user_id: userId,
    title: title.trim(),
    slug: candidateSlug,
    description: description || '',
    template: template || 'modern',
    typography: typography || 'moderna',
    primary_color: primary_color || '#0f172a',
    secondary_color: secondary_color || '#475569',
    font_family: font_family || 'Plus Jakarta Sans',
    cover_url: cover_url || business.cover_url || '',
    logo_url: logo_url || business.logo_url || '',
    welcome_message: welcome_message || `Bem-vindo ao nosso catálogo! Faça seu pedido ou tire dúvidas pelo WhatsApp.`,
    currency: currency || '€',
    allow_orders: allow_orders !== false,
    is_active: is_active !== false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  db.update('catalogs', (catalogs) => [...catalogs, newCatalog]);

  return res.status(201).json({ catalog: newCatalog });
});

apiRouter.put('/catalogs/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const { id } = req.params;
  const updates = req.body;

  const current = db.get('catalogs').find((c) => c.id === id && c.user_id === userId);
  if (!current) {
    return res.status(404).json({ error: 'Catálogo não encontrado.' });
  }

  // If slug was updated, ensure uniqueness
  let newSlug = current.slug;
  if (updates.slug && updates.slug !== current.slug) {
    const slugCheck = slugify(updates.slug);
    const existing = db.get('catalogs').find((c) => c.slug === slugCheck && c.id !== id);
    if (existing) {
      return res.status(409).json({ error: 'Este link já está a ser utilizado por outro catálogo. Escolha outro slug.' });
    }
    newSlug = slugCheck;
  }

  const updatedCatalog: Catalog = {
    ...current,
    ...updates,
    slug: newSlug,
    updated_at: new Date().toISOString(),
    id: current.id,
    user_id: current.user_id,
  };

  db.update('catalogs', (cats) => cats.map((c) => (c.id === id ? updatedCatalog : c)));

  return res.json({ catalog: updatedCatalog });
});

apiRouter.delete('/catalogs/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const { id } = req.params;

  const current = db.get('catalogs').find((c) => c.id === id && c.user_id === userId);
  if (!current) {
    return res.status(404).json({ error: 'Catálogo não encontrado.' });
  }

  db.update('catalogs', (cats) => cats.filter((c) => c.id !== id));
  db.update('catalog_views', (views) => views.filter((v) => v.catalog_id !== id));
  db.update('whatsapp_clicks', (clks) => clks.filter((c) => c.catalog_id !== id));

  return res.json({ success: true, message: 'Catálogo eliminado com sucesso.' });
});

// ==========================================
// 4. CATEGORIES
// ==========================================

apiRouter.get('/categories', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const { businessId } = req.query;

  if (!businessId) {
    return res.status(400).json({ error: 'businessId é obrigatório.' });
  }

  const business = db.get('businesses').find((b) => b.id === businessId && b.user_id === userId);
  if (!business) return res.status(403).json({ error: 'Sem permissão para este negócio.' });

  const categories = db.get('categories')
    .filter((cat) => cat.business_id === businessId)
    .sort((a, b) => a.sort_order - b.sort_order);

  return res.json({ categories });
});

apiRouter.post('/categories', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const { business_id, name, sort_order } = req.body;

  if (!business_id || !name) {
    return res.status(400).json({ error: 'business_id e nome são obrigatórios.' });
  }

  const business = db.get('businesses').find((b) => b.id === business_id && b.user_id === userId);
  if (!business) return res.status(403).json({ error: 'Sem permissão para este negócio.' });

  const newCat: Category = {
    id: `catg_${crypto.randomUUID().substring(0, 8)}`,
    business_id,
    name: name.trim(),
    sort_order: sort_order || 0,
  };

  db.update('categories', (cats) => [...cats, newCat]);
  return res.status(201).json({ category: newCat });
});

apiRouter.put('/categories/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const { id } = req.params;
  const { name, sort_order } = req.body;

  const currentCat = db.get('categories').find((c) => c.id === id);
  if (!currentCat) return res.status(404).json({ error: 'Categoria não encontrada.' });

  const business = db.get('businesses').find((b) => b.id === currentCat.business_id && b.user_id === userId);
  if (!business) return res.status(403).json({ error: 'Sem permissão.' });

  const updated: Category = {
    ...currentCat,
    name: name !== undefined ? name.trim() : currentCat.name,
    sort_order: sort_order !== undefined ? sort_order : currentCat.sort_order,
  };

  db.update('categories', (cats) => cats.map((c) => (c.id === id ? updated : c)));
  return res.json({ category: updated });
});

apiRouter.delete('/categories/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const { id } = req.params;

  const currentCat = db.get('categories').find((c) => c.id === id);
  if (!currentCat) return res.status(404).json({ error: 'Categoria não encontrada.' });

  const business = db.get('businesses').find((b) => b.id === currentCat.business_id && b.user_id === userId);
  if (!business) return res.status(403).json({ error: 'Sem permissão.' });

  db.update('categories', (cats) => cats.filter((c) => c.id !== id));
  // Unassign products from this category
  db.update('products', (prods) => prods.map((p) => (p.category_id === id ? { ...p, category_id: '' } : p)));

  return res.json({ success: true });
});

// ==========================================
// 5. PRODUCTS & SERVICES
// ==========================================

apiRouter.get('/products', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const { businessId, categoryId } = req.query;

  if (!businessId) {
    return res.status(400).json({ error: 'businessId é obrigatório.' });
  }

  const business = db.get('businesses').find((b) => b.id === businessId && b.user_id === userId);
  if (!business) return res.status(403).json({ error: 'Sem permissão para este negócio.' });

  let prods = db.get('products').filter((p) => p.business_id === businessId);
  if (categoryId) {
    prods = prods.filter((p) => p.category_id === categoryId);
  }

  prods.sort((a, b) => a.sort_order - b.sort_order);

  return res.json({ products: prods });
});

apiRouter.post('/products', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const {
    business_id,
    category_id,
    name,
    description,
    price,
    promo_price,
    image_url,
    is_available,
    sort_order,
    segment_data,
  } = req.body;

  if (!business_id || !name) {
    return res.status(400).json({ error: 'Negócio e nome do produto são obrigatórios.' });
  }

  const business = db.get('businesses').find((b) => b.id === business_id && b.user_id === userId);
  if (!business) return res.status(403).json({ error: 'Sem permissão para este negócio.' });

  const newProduct: Product = {
    id: `prod_${crypto.randomUUID().substring(0, 8)}`,
    business_id,
    category_id: category_id || '',
    name: name.trim(),
    description: description || '',
    price: Number(price) || 0,
    promo_price: promo_price ? Number(promo_price) : null,
    image_url: image_url || '',
    is_available: is_available !== false,
    sort_order: sort_order || 0,
    segment_data: segment_data || {},
    created_at: new Date().toISOString(),
  };

  db.update('products', (prods) => [...prods, newProduct]);
  return res.status(201).json({ product: newProduct });
});

apiRouter.put('/products/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const { id } = req.params;
  const updates = req.body;

  const current = db.get('products').find((p) => p.id === id);
  if (!current) return res.status(404).json({ error: 'Produto não encontrado.' });

  const business = db.get('businesses').find((b) => b.id === current.business_id && b.user_id === userId);
  if (!business) return res.status(403).json({ error: 'Sem permissão.' });

  const updated: Product = {
    ...current,
    ...updates,
    price: updates.price !== undefined ? Number(updates.price) : current.price,
    promo_price: updates.promo_price !== undefined ? (updates.promo_price ? Number(updates.promo_price) : null) : current.promo_price,
    id: current.id,
    business_id: current.business_id,
  };

  db.update('products', (prods) => prods.map((p) => (p.id === id ? updated : p)));
  return res.json({ product: updated });
});

apiRouter.post('/products/:id/duplicate', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const { id } = req.params;

  const current = db.get('products').find((p) => p.id === id);
  if (!current) return res.status(404).json({ error: 'Produto não encontrado.' });

  const business = db.get('businesses').find((b) => b.id === current.business_id && b.user_id === userId);
  if (!business) return res.status(403).json({ error: 'Sem permissão.' });

  const duplicated: Product = {
    ...current,
    id: `prod_${crypto.randomUUID().substring(0, 8)}`,
    name: `${current.name} (Cópia)`,
    created_at: new Date().toISOString(),
  };

  db.update('products', (prods) => [...prods, duplicated]);
  return res.status(201).json({ product: duplicated });
});

apiRouter.delete('/products/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const { id } = req.params;

  const current = db.get('products').find((p) => p.id === id);
  if (!current) return res.status(404).json({ error: 'Produto não encontrado.' });

  const business = db.get('businesses').find((b) => b.id === current.business_id && b.user_id === userId);
  if (!business) return res.status(403).json({ error: 'Sem permissão.' });

  db.update('products', (prods) => prods.filter((p) => p.id !== id));
  return res.json({ success: true, message: 'Produto removido com sucesso.' });
});

// ==========================================
// 6. PUBLIC CATALOG & STORE ACCESS
// ==========================================

apiRouter.get(['/public/catalogs/:slug', '/public/catalog/:slug'], (req, res) => {
  const { slug } = req.params;
  const catalog = db.get('catalogs').find((c) => c.slug === slug);

  if (!catalog) {
    return res.status(404).json({ error: 'Catálogo não encontrado ou link expirado.' });
  }

  const business = db.get('businesses').find((b) => b.id === catalog.business_id);
  if (!business) {
    return res.status(404).json({ error: 'Empresa associada não encontrada.' });
  }

  // Check if owner is suspended
  const owner = db.get('users').find((u) => u.id === catalog.user_id);
  if (owner?.is_suspended) {
    return res.status(403).json({ error: 'Este catálogo está temporariamente indisponível.' });
  }

  const categories = db.get('categories')
    .filter((cat) => cat.business_id === catalog.business_id)
    .sort((a, b) => a.sort_order - b.sort_order);

  const products = db.get('products')
    .filter((prod) => prod.business_id === catalog.business_id && prod.is_available)
    .sort((a, b) => a.sort_order - b.sort_order);

  return res.json({
    catalog,
    business: {
      id: business.id,
      name: business.name,
      category: business.category,
      description: business.description,
      logo_url: catalog.logo_url || business.logo_url,
      cover_url: catalog.cover_url || business.cover_url,
      phone: business.phone,
      whatsapp: business.whatsapp,
      address: business.address,
      instagram: business.instagram,
      facebook: business.facebook,
      website: business.website,
    },
    categories,
    products,
  });
});

apiRouter.post('/public/track/view', (req, res) => {
  const { catalog_id, referrer } = req.body;
  if (!catalog_id) return res.status(400).json({ error: 'catalog_id é obrigatório.' });

  const catalog = db.get('catalogs').find((c) => c.id === catalog_id);
  if (catalog) {
    const viewEntry = {
      id: `vw_${crypto.randomUUID().substring(0, 8)}`,
      catalog_id,
      business_id: catalog.business_id,
      referrer: referrer || 'direct',
      created_at: new Date().toISOString(),
    };
    db.update('catalog_views', (views) => [...views, viewEntry]);
  }

  return res.json({ success: true });
});

apiRouter.post('/public/track/whatsapp', (req, res) => {
  const { catalog_id, product_id, product_name, message_snippet } = req.body;
  if (!catalog_id) return res.status(400).json({ error: 'catalog_id é obrigatório.' });

  const catalog = db.get('catalogs').find((c) => c.id === catalog_id);
  if (catalog) {
    const clickEntry = {
      id: `clk_${crypto.randomUUID().substring(0, 8)}`,
      catalog_id,
      business_id: catalog.business_id,
      product_id: product_id || null,
      product_name: product_name || null,
      message_snippet: message_snippet ? message_snippet.substring(0, 200) : '',
      created_at: new Date().toISOString(),
    };
    db.update('whatsapp_clicks', (clks) => [...clks, clickEntry]);
  }

  return res.json({ success: true });
});

// ==========================================
// 7. ANALYTICS (REAL STATS)
// ==========================================

apiRouter.get('/analytics', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const userCatalogs = db.get('catalogs').filter((c) => c.user_id === userId);
  const catalogIds = userCatalogs.map((c) => c.id);

  const views = db.get('catalog_views').filter((v) => catalogIds.includes(v.catalog_id));
  const whatsappClicks = db.get('whatsapp_clicks').filter((c) => catalogIds.includes(c.catalog_id));

  // Compute daily stats for the last 14 days
  const dailyStats: Record<string, { date: string; views: number; clicks: number }> = {};
  for (let i = 13; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000);
    const key = d.toISOString().split('T')[0];
    dailyStats[key] = { date: key, views: 0, clicks: 0 };
  }

  views.forEach((v) => {
    const day = v.created_at.split('T')[0];
    if (dailyStats[day]) {
      dailyStats[day].views++;
    }
  });

  whatsappClicks.forEach((c) => {
    const day = c.created_at.split('T')[0];
    if (dailyStats[day]) {
      dailyStats[day].clicks++;
    }
  });

  // Top products clicked
  const productClicksMap: Record<string, { name: string; count: number }> = {};
  whatsappClicks.forEach((clk) => {
    const name = clk.product_name || 'Pedido Geral';
    if (!productClicksMap[name]) {
      productClicksMap[name] = { name, count: 0 };
    }
    productClicksMap[name].count++;
  });

  const topProducts = Object.values(productClicksMap)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Stats per catalog
  const catalogBreakdown = userCatalogs.map((cat) => {
    const catViews = views.filter((v) => v.catalog_id === cat.id).length;
    const catClicks = whatsappClicks.filter((c) => c.catalog_id === cat.id).length;
    const conversion = catViews > 0 ? ((catClicks / catViews) * 100).toFixed(1) : '0.0';
    return {
      id: cat.id,
      title: cat.title,
      slug: cat.slug,
      views: catViews,
      clicks: catClicks,
      conversionRate: `${conversion}%`,
    };
  });

  return res.json({
    totalViews: views.length,
    totalClicks: whatsappClicks.length,
    overallConversionRate: views.length > 0 ? ((whatsappClicks.length / views.length) * 100).toFixed(1) : '0.0',
    timeline: Object.values(dailyStats),
    topProducts,
    catalogs: catalogBreakdown,
  });
});

// ==========================================
// 8. IMAGE UPLOAD & ASSETS
// ==========================================

apiRouter.post('/upload', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const dataUrl = req.body.dataUrl || req.body.image;
  const filename = req.body.filename;
  if (!dataUrl) {
    return res.status(400).json({ error: 'Nenhum ficheiro fornecido.' });
  }

  // If it's already a full URL, return it
  if (dataUrl.startsWith('http://') || dataUrl.startsWith('https://') || dataUrl.startsWith('/src/')) {
    return res.json({ url: dataUrl });
  }

  try {
    const uploadsDir = path.resolve(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const matches = dataUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      // If it's arbitrary string, just return
      return res.json({ url: dataUrl });
    }

    const ext = matches[1].split('/')[1] || 'jpg';
    const safeName = `img_${Date.now()}_${crypto.randomBytes(4).toString('hex')}.${ext}`;
    const filePath = path.join(uploadsDir, safeName);

    fs.writeFileSync(filePath, Buffer.from(matches[2], 'base64'));

    return res.json({ url: `/uploads/${safeName}` });
  } catch (err) {
    console.error('Upload error:', err);
    // Fallback: return dataUrl directly so nothing breaks
    return res.json({ url: dataUrl });
  }
});

// ==========================================
// 9. SUPER ADMIN CONSOLE
// ==========================================

apiRouter.get('/admin/overview', requireAdmin, (_req: AuthenticatedRequest, res: Response) => {
  const users = db.get('users');
  const businesses = db.get('businesses');
  const catalogs = db.get('catalogs');
  const products = db.get('products');
  const views = db.get('catalog_views');
  const clicks = db.get('whatsapp_clicks');

  return res.json({
    totalUsers: users.length,
    totalBusinesses: businesses.length,
    totalCatalogs: catalogs.length,
    totalProducts: products.length,
    totalViews: views.length,
    totalWhatsAppClicks: clicks.length,
  });
});

apiRouter.get('/admin/users', requireAdmin, (_req: AuthenticatedRequest, res: Response) => {
  const users = db.get('users');
  const businesses = db.get('businesses');
  const catalogs = db.get('catalogs');

  const detailedUsers = users.map((u) => {
    const userBizs = businesses.filter((b) => b.user_id === u.id);
    const userCats = catalogs.filter((c) => c.user_id === u.id);
    const { password_hash: _, ...safeUser } = u;
    return {
      ...safeUser,
      businessesCount: userBizs.length,
      catalogsCount: userCats.length,
    };
  });

  return res.json({ users: detailedUsers });
});

apiRouter.post('/admin/users/:id/toggle-suspend', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const user = db.get('users').find((u) => u.id === id);
  if (!user) return res.status(404).json({ error: 'Utilizador não encontrado.' });
  if (user.role === 'admin') return res.status(400).json({ error: 'Não é possível suspender um administrador do sistema.' });

  const updated: User = {
    ...user,
    is_suspended: !user.is_suspended,
  };

  db.update('users', (users) => users.map((u) => (u.id === id ? updated : u)));
  return res.json({ user: updated, message: updated.is_suspended ? 'Conta suspensa com sucesso.' : 'Conta reativada com sucesso.' });
});

apiRouter.post('/admin/users/:id/update-plan', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { plan_id } = req.body;
  const user = db.get('users').find((u) => u.id === id);
  if (!user) return res.status(404).json({ error: 'Utilizador não encontrado.' });

  const updated: User = {
    ...user,
    plan_id: plan_id || user.plan_id,
  };

  db.update('users', (users) => users.map((u) => (u.id === id ? updated : u)));
  return res.json({ user: updated, message: 'Plano atualizado com sucesso.' });
});
