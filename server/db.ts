import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

export interface User {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  role: 'user' | 'admin';
  plan_id: 'free' | 'pro' | 'business';
  is_suspended: boolean;
  created_at: string;
}

export interface Business {
  id: string;
  user_id: string;
  name: string;
  category: 'restaurant' | 'pizzeria' | 'fashion' | 'barbershop' | 'supermarket' | 'bakery' | 'services' | 'other';
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

export interface Catalog {
  id: string;
  business_id: string;
  user_id: string;
  title: string;
  slug: string;
  description: string;
  template: 'classic' | 'modern' | 'premium' | 'minimal' | 'compact';
  typography?: string;
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

export interface CatalogView {
  id: string;
  catalog_id: string;
  business_id: string;
  referrer: string;
  created_at: string;
}

export interface WhatsAppClick {
  id: string;
  catalog_id: string;
  business_id: string;
  product_id?: string | null;
  product_name?: string | null;
  message_snippet: string;
  created_at: string;
}

export interface DatabaseSchema {
  users: User[];
  businesses: Business[];
  catalogs: Catalog[];
  categories: Category[];
  products: Product[];
  catalog_views: CatalogView[];
  whatsapp_clicks: WhatsAppClick[];
}

const DB_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'database.json');

// Password hash helper using built-in scrypt
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = crypto.scryptSync(password, salt, 64);
  return `${salt}:${derivedKey.toString('hex')}`;
}

export function verifyPassword(password: string, combined: string): boolean {
  try {
    const [salt, key] = combined.split(':');
    if (!salt || !key) return false;
    const derivedKey = crypto.scryptSync(password, salt, 64);
    return crypto.timingSafeEqual(Buffer.from(key, 'hex'), derivedKey);
  } catch {
    return false;
  }
}

class Database {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.load();
  }

  private load(): DatabaseSchema {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }

    if (fs.existsSync(DB_FILE)) {
      try {
        const content = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(content);
      } catch (err) {
        console.error('Failed to parse database.json, seeding new db:', err);
      }
    }

    const seeded = this.getSeedData();
    this.persist(seeded);
    return seeded;
  }

  public persist(data?: DatabaseSchema) {
    if (data) this.data = data;
    try {
      if (!fs.existsSync(DB_DIR)) {
        fs.mkdirSync(DB_DIR, { recursive: true });
      }
      const tmpFile = `${DB_FILE}.tmp`;
      fs.writeFileSync(tmpFile, JSON.stringify(this.data, null, 2), 'utf-8');
      fs.renameSync(tmpFile, DB_FILE);
    } catch (err) {
      console.error('Failed to persist database:', err);
    }
  }

  public get<K extends keyof DatabaseSchema>(table: K): DatabaseSchema[K] {
    return this.data[table];
  }

  public update<K extends keyof DatabaseSchema>(table: K, updater: (items: DatabaseSchema[K]) => DatabaseSchema[K]) {
    this.data[table] = updater(this.data[table]);
    this.persist();
  }

  private getSeedData(): DatabaseSchema {
    const adminId = 'usr_admin_01';
    const demoUserId = 'usr_demo_01';

    const users: User[] = [
      {
        id: adminId,
        name: 'Administrador Catafy',
        email: 'admin@catafy.com',
        password_hash: hashPassword('admin123'),
        role: 'admin',
        plan_id: 'business',
        is_suspended: false,
        created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
      },
      {
        id: demoUserId,
        name: 'Lucas Martins',
        email: 'demo@catafy.com',
        password_hash: hashPassword('demo123'),
        role: 'user',
        plan_id: 'pro',
        is_suspended: false,
        created_at: new Date(Date.now() - 20 * 86400000).toISOString(),
      },
    ];

    const bizPizzaId = 'biz_pizza_01';
    const bizFashionId = 'biz_fashion_02';
    const bizBarberId = 'biz_barber_03';

    const businesses: Business[] = [
      {
        id: bizPizzaId,
        user_id: demoUserId,
        name: 'Forno & Brasa — Pizzaria Artesanal',
        category: 'pizzeria',
        description: 'Pizzas fermentadas naturalmente por 48 horas em forno a lenha, queijos artesanais e ingredientes italianos selecionados.',
        logo_url: 'https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?w=200&auto=format&fit=crop&q=80',
        cover_url: '/src/assets/images/food_artisan_pizza_1793488874759.jpg',
        phone: '+351 912 345 678',
        whatsapp: '+351912345678',
        address: 'Rua das Flores 142, Lisboa',
        instagram: '@fornoebrasa.pizzaria',
        facebook: 'fornoebrasa',
        created_at: new Date(Date.now() - 18 * 86400000).toISOString(),
      },
      {
        id: bizFashionId,
        user_id: demoUserId,
        name: 'Aura Concept Store',
        category: 'fashion',
        description: 'Moda minimalista, peças atemporais em linho puro e acessórios artesanais para o dia a dia contemporâneo.',
        logo_url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200&auto=format&fit=crop&q=80',
        cover_url: '/src/assets/images/fashion_boutique_items_1793488875071.jpg',
        phone: '+351 925 889 112',
        whatsapp: '+351925889112',
        address: 'Avenida da Liberdade 89, Lisboa',
        instagram: '@aura.conceptstore',
        created_at: new Date(Date.now() - 15 * 86400000).toISOString(),
      },
      {
        id: bizBarberId,
        user_id: demoUserId,
        name: 'Gentleman\'s Grooming Barber',
        category: 'barbershop',
        description: 'Cortes clássicos, barba na navalha com toalha quente e atendimento personalizado em ambiente exclusivo.',
        logo_url: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=200&auto=format&fit=crop&q=80',
        cover_url: '/src/assets/images/barber_grooming_station_1793488875178.jpg',
        phone: '+351 933 445 566',
        whatsapp: '+351933445566',
        address: 'Praça do Comércio 24, Porto',
        instagram: '@gentlemans.barber',
        created_at: new Date(Date.now() - 10 * 86400000).toISOString(),
      },
    ];

    const catalogs: Catalog[] = [
      {
        id: 'cat_pizza_01',
        business_id: bizPizzaId,
        user_id: demoUserId,
        title: 'Menu Forno & Brasa',
        slug: 'pizzaria-forno-e-brasa',
        description: 'Escolha suas pizzas favoritas e faça seu pedido direto pelo WhatsApp!',
        template: 'modern',
        primary_color: '#dc2626',
        secondary_color: '#991b1b',
        font_family: 'Plus Jakarta Sans',
        cover_url: '/src/assets/images/food_artisan_pizza_1793488874759.jpg',
        logo_url: 'https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?w=200&auto=format&fit=crop&q=80',
        welcome_message: 'Seja bem-vindo ao Forno & Brasa! Selecione os itens que deseja e envie seu pedido diretamente pelo WhatsApp.',
        currency: '€',
        allow_orders: true,
        is_active: true,
        created_at: new Date(Date.now() - 18 * 86400000).toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'cat_fashion_02',
        business_id: bizFashionId,
        user_id: demoUserId,
        title: 'Coleção Essenciais de Linho',
        slug: 'aura-concept',
        description: 'Peças exclusivas e sustentáveis. Fale conosco para reservar suas peças.',
        template: 'premium',
        primary_color: '#475569',
        secondary_color: '#1e293b',
        font_family: 'Playfair Display',
        cover_url: '/src/assets/images/fashion_boutique_items_1793488875071.jpg',
        logo_url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200&auto=format&fit=crop&q=80',
        welcome_message: 'Explore nossa seleção especial. Ao clicar em reservar, nossa equipe atenderá você com exclusividade.',
        currency: '€',
        allow_orders: true,
        is_active: true,
        created_at: new Date(Date.now() - 15 * 86400000).toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'cat_barber_03',
        business_id: bizBarberId,
        user_id: demoUserId,
        title: 'Menu de Serviços & Agendamento',
        slug: 'gentleman-barber',
        description: 'Tabela de serviços e agendamento instantâneo via WhatsApp.',
        template: 'classic',
        primary_color: '#0f172a',
        secondary_color: '#334155',
        font_family: 'Plus Jakarta Sans',
        cover_url: '/src/assets/images/barber_grooming_station_1793488875178.jpg',
        logo_url: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=200&auto=format&fit=crop&q=80',
        welcome_message: 'Confira nossos serviços premium e agende seu horário com um de nossos mestres barbeiros.',
        currency: '€',
        allow_orders: true,
        is_active: true,
        created_at: new Date(Date.now() - 10 * 86400000).toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];

    const catPizzasSpec = 'cat_spec_01';
    const catPizzasTrad = 'cat_trad_02';
    const catBebidas = 'cat_beb_03';
    const catFashionTop = 'cat_fsh_top';
    const catFashionAcess = 'cat_fsh_acs';
    const catBarberCortes = 'cat_brb_crt';
    const catBarberTrat = 'cat_brb_trt';

    const categories: Category[] = [
      { id: catPizzasSpec, business_id: bizPizzaId, name: 'Pizzas Especiais', sort_order: 1 },
      { id: catPizzasTrad, business_id: bizPizzaId, name: 'Pizzas Tradicionais', sort_order: 2 },
      { id: catBebidas, business_id: bizPizzaId, name: 'Bebidas & Sobremesas', sort_order: 3 },
      { id: catFashionTop, business_id: bizFashionId, name: 'Vestuário & Camisas', sort_order: 1 },
      { id: catFashionAcess, business_id: bizFashionId, name: 'Acessórios & Couro', sort_order: 2 },
      { id: catBarberCortes, business_id: bizBarberId, name: 'Cortes & Barba', sort_order: 1 },
      { id: catBarberTrat, business_id: bizBarberId, name: 'Tratamentos & Cuidados', sort_order: 2 },
    ];

    const products: Product[] = [
      {
        id: 'prod_pz_01',
        business_id: bizPizzaId,
        category_id: catPizzasSpec,
        name: 'Margherita Verace D.O.P.',
        description: 'Molho San Marzano D.O.P., mozzarella di bufala campana fresca, manjericão orgânico e fio de azeite extra virgem.',
        price: 14.50,
        promo_price: null,
        image_url: '/src/assets/images/food_artisan_pizza_1793488874759.jpg',
        is_available: true,
        sort_order: 1,
        segment_data: {
          ingredients: 'Molho San Marzano, Mozzarella di Bufala, Manjericão, Azeite E.V.',
          sizes: [
            { name: 'Individual (28cm)', price: 14.50 },
            { name: 'Família (35cm)', price: 21.00 },
          ],
        },
        created_at: new Date(Date.now() - 17 * 86400000).toISOString(),
      },
      {
        id: 'prod_pz_02',
        business_id: bizPizzaId,
        category_id: catPizzasSpec,
        name: 'Tartufo & Prosciutto Crudo',
        description: 'Creme de trufas negras de Norcia, mozzarella fior di latte, presunto cru di Parma 24 meses e rúcula fresca selvagem.',
        price: 19.90,
        promo_price: 17.90,
        image_url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80',
        is_available: true,
        sort_order: 2,
        segment_data: {
          ingredients: 'Creme de trufa negra, Fior di latte, Prosciutto di Parma, Rúcula selvagem',
          sizes: [
            { name: 'Individual (28cm)', price: 17.90 },
            { name: 'Família (35cm)', price: 26.50 },
          ],
        },
        created_at: new Date(Date.now() - 17 * 86400000).toISOString(),
      },
      {
        id: 'prod_pz_03',
        business_id: bizPizzaId,
        category_id: catPizzasTrad,
        name: 'Diavola com Nduja Calabresa',
        description: 'Molho de tomate italiano, mozzarella, salame picante artesanal, nduja da Calábria e orégãos frescos.',
        price: 15.50,
        promo_price: null,
        image_url: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=600&auto=format&fit=crop&q=80',
        is_available: true,
        sort_order: 3,
        segment_data: {
          ingredients: 'Molho artesanal, Fior di latte, Salame picante, Nduja calabresa',
          sizes: [
            { name: 'Individual (28cm)', price: 15.50 },
            { name: 'Família (35cm)', price: 22.50 },
          ],
        },
        created_at: new Date(Date.now() - 17 * 86400000).toISOString(),
      },
      {
        id: 'prod_pz_04',
        business_id: bizPizzaId,
        category_id: catBebidas,
        name: 'Tiramisù Tradizionale al Mascarpone',
        description: 'Receita clássica italiana com biscoitos savoiardi embebidos em café espresso, creme de mascarpone e cacau amargo.',
        price: 6.50,
        promo_price: null,
        image_url: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600&auto=format&fit=crop&q=80',
        is_available: true,
        sort_order: 4,
        segment_data: {
          ingredients: 'Mascarpone artesanal, Café espresso, Cacau Valrhona 70%, Biscoito Savoiardi',
        },
        created_at: new Date(Date.now() - 17 * 86400000).toISOString(),
      },
      {
        id: 'prod_fsh_01',
        business_id: bizFashionId,
        category_id: catFashionTop,
        name: 'Camisa Oversized em Linho Puro',
        description: 'Feita com linho 100% europeu pré-lavado, caimento relaxado e botões em madrepérola natural.',
        price: 89.00,
        promo_price: null,
        image_url: '/src/assets/images/fashion_boutique_items_1793488875071.jpg',
        is_available: true,
        sort_order: 1,
        segment_data: {
          clothing_sizes: ['S', 'M', 'L', 'XL'],
          colors: ['Areia Natural', 'Branco Puro', 'Verde Oliva'],
          sku: 'AUR-LIN-01',
        },
        created_at: new Date(Date.now() - 14 * 86400000).toISOString(),
      },
      {
        id: 'prod_fsh_02',
        business_id: bizFashionId,
        category_id: catFashionAcess,
        name: 'Relógio Minimalista com Bracelete em Pele',
        description: 'Caixa em aço inoxidável escovado 38mm, mostrador branco clean e bracelete artesanal em pele italiana caramelo.',
        price: 145.00,
        promo_price: 129.00,
        image_url: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=600&auto=format&fit=crop&q=80',
        is_available: true,
        sort_order: 2,
        segment_data: {
          colors: ['Caramelo & Prata', 'Preto & Grafite'],
          sku: 'AUR-WAT-09',
        },
        created_at: new Date(Date.now() - 14 * 86400000).toISOString(),
      },
      {
        id: 'prod_brb_01',
        business_id: bizBarberId,
        category_id: catBarberCortes,
        name: 'Corte Tradicional + Lavagem',
        description: 'Avaliação visagista, corte com tesoura e máquina, lavagem refrescante com massagem capilar e finalização com pomada.',
        price: 22.00,
        promo_price: null,
        image_url: '/src/assets/images/barber_grooming_station_1793488875178.jpg',
        is_available: true,
        sort_order: 1,
        segment_data: {
          service_duration: '45 minutos',
        },
        created_at: new Date(Date.now() - 9 * 86400000).toISOString(),
      },
      {
        id: 'prod_brb_02',
        business_id: bizBarberId,
        category_id: catBarberCortes,
        name: 'Barba Terapia com Toalha Quente',
        description: 'Design de barba com navalha clássica, óleos essenciais, 2 toalhas quentes aromáticas e bálsamo hidratante.',
        price: 18.00,
        promo_price: null,
        image_url: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&auto=format&fit=crop&q=80',
        is_available: true,
        sort_order: 2,
        segment_data: {
          service_duration: '35 minutos',
        },
        created_at: new Date(Date.now() - 9 * 86400000).toISOString(),
      },
    ];

    // Seed realistic views and WhatsApp clicks for analytics
    const catalog_views: CatalogView[] = [];
    const whatsapp_clicks: WhatsAppClick[] = [];

    // Past 14 days of realistic analytics
    const catIds = ['cat_pizza_01', 'cat_fashion_02', 'cat_barber_03'];
    for (let day = 14; day >= 0; day--) {
      const dayDate = new Date(Date.now() - day * 86400000);
      const viewsCount = Math.floor(12 + Math.random() * 25);
      for (let v = 0; v < viewsCount; v++) {
        const catId = catIds[Math.floor(Math.random() * catIds.length)];
        const bizId = catId === 'cat_pizza_01' ? bizPizzaId : (catId === 'cat_fashion_02' ? bizFashionId : bizBarberId);
        catalog_views.push({
          id: `vw_${day}_${v}_${Math.random().toString(36).substring(7)}`,
          catalog_id: catId,
          business_id: bizId,
          referrer: v % 2 === 0 ? 'instagram' : (v % 3 === 0 ? 'whatsapp' : 'direct'),
          created_at: new Date(dayDate.getTime() + Math.random() * 80000000).toISOString(),
        });
      }

      // WhatsApp clicks (approx 15-25% conversion)
      const clicksCount = Math.floor(2 + Math.random() * 6);
      for (let c = 0; c < clicksCount; c++) {
        const catId = catIds[Math.floor(Math.random() * catIds.length)];
        const bizId = catId === 'cat_pizza_01' ? bizPizzaId : (catId === 'cat_fashion_02' ? bizFashionId : bizBarberId);
        const prod = catId === 'cat_pizza_01' ? products[0] : (catId === 'cat_fashion_02' ? products[4] : products[6]);
        whatsapp_clicks.push({
          id: `clk_${day}_${c}_${Math.random().toString(36).substring(7)}`,
          catalog_id: catId,
          business_id: bizId,
          product_id: prod?.id || null,
          product_name: prod?.name || 'Pedido Completo',
          message_snippet: `Olá! Gostaria de pedir: ${prod?.name}`,
          created_at: new Date(dayDate.getTime() + Math.random() * 80000000).toISOString(),
        });
      }
    }

    return {
      users,
      businesses,
      catalogs,
      categories,
      products,
      catalog_views,
      whatsapp_clicks,
    };
  }
}

export const db = new Database();
