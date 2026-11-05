import React, { useState, useEffect, useCallback } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { AuthModal } from './components/AuthModal';
import { DashboardLayout, DashboardTab } from './components/dashboard/DashboardLayout';
import { OverviewView } from './components/dashboard/OverviewView';
import { BusinessesView } from './components/dashboard/BusinessesView';
import { CatalogsView } from './components/dashboard/CatalogsView';
import { CatalogBuilder } from './components/dashboard/CatalogBuilder';
import { ProductsView } from './components/dashboard/ProductsView';
import { CategoriesView } from './components/dashboard/CategoriesView';
import { TemplatesView } from './components/dashboard/TemplatesView';
import { AnalyticsView } from './components/dashboard/AnalyticsView';
import { PlansView } from './components/dashboard/PlansView';
import { SettingsView } from './components/dashboard/SettingsView';
import { HelpView } from './components/dashboard/HelpView';
import { AdminView } from './components/dashboard/AdminView';
import { PublicCatalog } from './components/public/PublicCatalog';
import { AuthPage } from './components/AuthPage';
import { Business, Catalog, Product, AnalyticsData, CatalogTemplate } from './types';
import { api } from './lib/api';

function AppContent() {
  const { user, isLoading: authLoading } = useAuth();

  // Route extraction from URL
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');

  // Auth modal
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authInitialTab, setAuthInitialTab] = useState<'login' | 'register'>('register');

  // Dashboard Data State
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [catalogs, setCatalogs] = useState<Catalog[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loadingDashboard, setLoadingDashboard] = useState(false);

  // Catalog Builder state
  const [builderCatalog, setBuilderCatalog] = useState<Catalog | null>(null);
  const [builderBusinessId, setBuilderBusinessId] = useState<string | null>(null);

  // Sync browser back/forward history
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Check if current route is a public catalog (supporting full Unicode/accents, encoded characters, trailing slashes)
  const publicSlugMatch = currentPath.match(/^\/(?:loja|catalog)\/([^/?#]+)/i);
  const publicCatalogSlug = publicSlugMatch ? decodeURIComponent(publicSlugMatch[1].trim()) : null;

  // Route helpers for auth and dashboard protection
  const getAuthMode = (path: string): 'login' | 'register' | 'recover' | null => {
    const p = path.toLowerCase().replace(/\/$/, '');
    if (p === '/login' || p === '/entrar') return 'login';
    if (p === '/register' || p === '/cadastro' || p === '/criar-conta') return 'register';
    if (p === '/recuperar-senha' || p === '/recover') return 'recover';
    return null;
  };

  const isDashboardRoute = (path: string): boolean => {
    const p = path.toLowerCase().replace(/\/$/, '');
    return [
      '/dashboard',
      '/painel',
      '/negocios',
      '/catalogos',
      '/produtos',
      '/categorias',
      '/modelos',
      '/estatisticas',
      '/planos',
      '/configuracoes',
      '/ajuda',
      '/admin',
      '/builder',
    ].some((r) => p === r || p.startsWith(`${r}/`));
  };

  // Sync activeTab with URL for authenticated users
  useEffect(() => {
    const p = currentPath.toLowerCase().replace(/\/$/, '');
    if (p === '/negocios') setActiveTab('businesses');
    else if (p === '/catalogos') setActiveTab('catalogs');
    else if (p === '/produtos') setActiveTab('products');
    else if (p === '/categorias') setActiveTab('categories');
    else if (p === '/modelos') setActiveTab('templates');
    else if (p === '/estatisticas') setActiveTab('analytics');
    else if (p === '/planos') setActiveTab('plans');
    else if (p === '/configuracoes') setActiveTab('settings');
    else if (p === '/ajuda') setActiveTab('help');
    else if (p === '/admin') setActiveTab('admin');
    else if (p === '/dashboard' || p === '/painel') setActiveTab('overview');
  }, [currentPath]);

  // Load dashboard data when user is authenticated
  const loadDashboardData = useCallback(async () => {
    if (!user) return;
    setLoadingDashboard(true);
    try {
      const [bizRes, catRes, anaRes] = await Promise.all([
        api.getBusinesses(),
        api.getCatalogs(),
        api.getAnalytics().catch(() => null),
      ]);
      setBusinesses(bizRes.businesses);
      setCatalogs(catRes.catalogs);
      setAnalytics(anaRes);

      // Load products for all user businesses
      if (bizRes.businesses.length > 0) {
        const prodPromises = bizRes.businesses.map((b) => api.getProducts(b.id));
        const prodResults = await Promise.all(prodPromises);
        const allProds = prodResults.flatMap((r) => r.products);
        setProducts(allProds);
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoadingDashboard(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user, loadDashboardData]);

  // 1. Public Catalog Route (100% No Auth Required)
  if (publicCatalogSlug) {
    return (
      <PublicCatalog
        slug={publicCatalogSlug}
        onGoHome={() => navigateTo('/')}
      />
    );
  }

  // 2. Loading Session Check
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="w-10 h-10 border-3 border-slate-200 border-t-[#6D28D9] rounded-full animate-spin mb-4" />
        <p className="text-xs font-semibold text-slate-500">A inicializar Catafy...</p>
      </div>
    );
  }

  // 3. Unauthenticated Routes (Login, Register, or Protected Dashboard Interception)
  if (!user) {
    const authMode = getAuthMode(currentPath);

    // Explicit login, register, recover page
    if (authMode) {
      return (
        <AuthPage
          initialMode={authMode}
          onSuccess={() => navigateTo('/dashboard')}
          onGoHome={() => navigateTo('/')}
        />
      );
    }

    // Attempted to access protected dashboard route without logging in
    if (isDashboardRoute(currentPath)) {
      return (
        <AuthPage
          initialMode="login"
          redirectMessage="Por favor inicie sessão para aceder ao painel de gestão da Catafy."
          onSuccess={() => navigateTo('/dashboard')}
          onGoHome={() => navigateTo('/')}
        />
      );
    }
  }

  // 4. Authenticated: Render SaaS Dashboard
  if (user) {
    // If user is logged in but visiting auth URLs (/login, /register), redirect to dashboard
    if (getAuthMode(currentPath)) {
      navigateTo('/dashboard');
    }

    return (
      <DashboardLayout
        activeTab={activeTab}
        onSelectTab={(tab) => {
          if (tab !== 'builder') setBuilderCatalog(null);
          setActiveTab(tab);
          const routeMap: Record<DashboardTab, string> = {
            overview: '/dashboard',
            businesses: '/negocios',
            catalogs: '/catalogos',
            builder: '/builder',
            products: '/produtos',
            categories: '/categorias',
            templates: '/modelos',
            analytics: '/estatisticas',
            plans: '/planos',
            settings: '/configuracoes',
            help: '/ajuda',
            admin: '/admin',
          };
          window.history.pushState({}, '', routeMap[tab] || '/dashboard');
        }}
        onNewCatalog={() => {
          setBuilderCatalog(null);
          setBuilderBusinessId(businesses[0]?.id || null);
          setActiveTab('builder');
        }}
        onOpenPublicCatalog={(slug) => navigateTo(`/loja/${slug}`)}
      >
        {activeTab === 'overview' && (
          <OverviewView
            businesses={businesses}
            catalogs={catalogs}
            products={products}
            analytics={analytics}
            onNewCatalog={() => {
              setBuilderCatalog(null);
              setBuilderBusinessId(businesses[0]?.id || null);
              setActiveTab('builder');
            }}
            onNewBusiness={() => setActiveTab('businesses')}
            onSelectTab={(tab) => setActiveTab(tab as DashboardTab)}
            onOpenPublicCatalog={(slug) => navigateTo(`/loja/${slug}`)}
          />
        )}

        {activeTab === 'businesses' && (
          <BusinessesView
            businesses={businesses}
            catalogs={catalogs}
            products={products}
            onRefresh={loadDashboardData}
            onNewCatalogForBusiness={(bizId) => {
              setBuilderCatalog(null);
              setBuilderBusinessId(bizId);
              setActiveTab('builder');
            }}
          />
        )}

        {activeTab === 'catalogs' && (
          <CatalogsView
            catalogs={catalogs}
            businesses={businesses}
            onRefresh={loadDashboardData}
            onNewCatalog={() => {
              setBuilderCatalog(null);
              setBuilderBusinessId(businesses[0]?.id || null);
              setActiveTab('builder');
            }}
            onEditCatalog={(cat) => {
              setBuilderCatalog(cat);
              setBuilderBusinessId(cat.business_id);
              setActiveTab('builder');
            }}
            onOpenPublicCatalog={(slug) => navigateTo(`/loja/${slug}`)}
          />
        )}

        {activeTab === 'builder' && (
          <CatalogBuilder
            initialCatalog={builderCatalog}
            initialBusinessId={builderBusinessId}
            businesses={businesses}
            onFinish={() => {
              loadDashboardData();
              setActiveTab('catalogs');
            }}
            onCancel={() => setActiveTab('catalogs')}
            onOpenPublicCatalog={(slug) => navigateTo(`/loja/${slug}`)}
          />
        )}

        {activeTab === 'products' && (
          <ProductsView
            businesses={businesses}
            onRefresh={loadDashboardData}
          />
        )}

        {activeTab === 'categories' && (
          <CategoriesView
            businesses={businesses}
            onRefresh={loadDashboardData}
          />
        )}

        {activeTab === 'templates' && (
          <TemplatesView
            onSelectTemplateForNewCatalog={(tpl: CatalogTemplate) => {
              setBuilderCatalog(null);
              setBuilderBusinessId(businesses[0]?.id || null);
              setActiveTab('builder');
            }}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsView
            businesses={businesses}
            catalogs={catalogs}
          />
        )}

        {activeTab === 'plans' && (
          <PlansView
            businesses={businesses}
            catalogs={catalogs}
            products={products}
          />
        )}

        {activeTab === 'settings' && <SettingsView />}

        {activeTab === 'help' && <HelpView />}

        {activeTab === 'admin' && user.role === 'admin' && <AdminView />}
      </DashboardLayout>
    );
  }

  // Logged-out: Render Commercial Landing Page
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar
        onOpenAuth={(tab = 'register') => {
          setAuthInitialTab(tab);
          setAuthModalOpen(true);
        }}
        onGoToDashboard={() => setActiveTab('overview')}
        onViewDemoCatalog={() => navigateTo('/loja/pizzaria-forno-e-brasa')}
      />

      <LandingPage
        onOpenAuth={(tab = 'register') => {
          setAuthInitialTab(tab);
          setAuthModalOpen(true);
        }}
        onViewDemoCatalog={(slug = 'pizzaria-forno-e-brasa') => navigateTo(`/loja/${slug}`)}
      />

      <AuthModal
        isOpen={authModalOpen}
        initialTab={authInitialTab}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={() => {
          setAuthModalOpen(false);
          setActiveTab('overview');
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
