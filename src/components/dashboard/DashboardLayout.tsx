import React, { useState } from 'react';
import {
  LayoutDashboard,
  Store,
  BookOpen,
  Package,
  Layers,
  Palette,
  BarChart3,
  CreditCard,
  Settings,
  HelpCircle,
  ShieldCheck,
  LogOut,
  Plus,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export type DashboardTab =
  | 'overview'
  | 'businesses'
  | 'catalogs'
  | 'builder'
  | 'products'
  | 'categories'
  | 'templates'
  | 'analytics'
  | 'plans'
  | 'settings'
  | 'help'
  | 'admin';

interface DashboardLayoutProps {
  activeTab: DashboardTab;
  onSelectTab: (tab: DashboardTab) => void;
  onNewCatalog: () => void;
  onOpenPublicCatalog?: (slug: string) => void;
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  activeTab,
  onSelectTab,
  onNewCatalog,
  children,
}) => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'overview', label: 'Visão Geral', icon: LayoutDashboard },
    { id: 'businesses', label: 'Meus Negócios', icon: Store },
    { id: 'catalogs', label: 'Meus Catálogos', icon: BookOpen },
    { id: 'products', label: 'Produtos', icon: Package },
    { id: 'categories', label: 'Categorias', icon: Layers },
    { id: 'templates', label: 'Modelos', icon: Palette },
    { id: 'analytics', label: 'Estatísticas', icon: BarChart3 },
    { id: 'plans', label: 'Planos & Faturação', icon: CreditCard },
    { id: 'settings', label: 'Configurações', icon: Settings },
    { id: 'help', label: 'Ajuda & Dicas', icon: HelpCircle },
  ];

  const handleNavClick = (tab: DashboardTab) => {
    onSelectTab(tab);
    setMobileMenuOpen(false);
  };

  const currentTabLabel =
    navItems.find((i) => i.id === activeTab)?.label ||
    (activeTab === 'builder' ? 'Criador de Catálogos' : activeTab === 'admin' ? 'Painel Super Admin' : 'Painel');

  const userInitial = (user?.name?.charAt(0) || user?.email?.charAt(0) || 'C').toUpperCase();

  return (
    <div className="min-h-screen bg-[#F8F7FC] flex flex-col md:flex-row text-[#17152B]">
      {/* Mobile Top Header */}
      <header className="md:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 -ml-2 rounded-xl text-[#17152B] hover:bg-slate-100"
            aria-label="Abrir menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-[#6D28D9] via-[#9333EA] to-[#FF7A00] text-white flex items-center justify-center font-bold text-xs shadow-xs">
              C
            </div>
            <span className="font-extrabold text-[#17152B] tracking-tight text-lg">Catafy</span>
          </div>
        </div>

        <button
          onClick={onNewCatalog}
          className="py-1.5 px-3 btn-catafy-gradient text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Novo Catálogo</span>
        </button>
      </header>

      {/* Sidebar Navigation (Matching visual reference faithfully) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-100 flex flex-col justify-between transition-transform duration-200 ease-in-out md:static md:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full overflow-y-auto">
          {/* Top Brand Mark */}
          <div className="p-6 pb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#6D28D9] via-[#9333EA] to-[#FF7A00] text-white flex items-center justify-center font-extrabold text-xl shadow-md shadow-purple-500/20">
                C
              </div>
              <div>
                <span className="font-extrabold text-[#17152B] tracking-tight text-xl block leading-tight">
                  Catafy
                </span>
                <span className="text-xs text-[#77758A] font-medium">Plataforma SaaS</span>
              </div>
            </div>

            <button
              onClick={() => setMobileMenuOpen(false)}
              className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Big CTA Button: + Criar novo catálogo */}
          <div className="px-5 py-3">
            <button
              type="button"
              onClick={() => {
                onNewCatalog();
                setMobileMenuOpen(false);
              }}
              className="w-full py-3 px-4 btn-catafy-gradient text-white text-sm font-bold rounded-2xl flex items-center justify-center gap-2 shadow-md cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Criar novo catálogo</span>
            </button>
          </div>

          {/* Navigation Links with custom active styling */}
          <nav className="px-4 py-2 space-y-1 flex-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id as DashboardTab)}
                  className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-2xl text-xs font-semibold transition-all cursor-pointer text-left relative ${
                    isActive
                      ? 'bg-[#EDE9FE] text-[#6D28D9] font-bold shadow-2xs'
                      : 'text-[#17152B] hover:bg-[#F8F7FC] hover:text-[#6D28D9]'
                  }`}
                >
                  {isActive && (
                    <span className="absolute left-0 top-2 bottom-2 w-1.5 bg-[#6D28D9] rounded-r-full" />
                  )}
                  <Icon
                    className={`w-5 h-5 shrink-0 transition-colors ${
                      isActive ? 'text-[#6D28D9]' : 'text-[#77758A]'
                    }`}
                  />
                  <span className="truncate text-[13px]">{item.label}</span>
                </button>
              );
            })}

            {/* Super Admin section if role === 'admin' */}
            {user?.role === 'admin' && (
              <div className="pt-3 mt-3 border-t border-slate-100">
                <span className="px-3.5 text-[10px] font-bold uppercase tracking-wider text-amber-700 block mb-1">
                  Administração Geral
                </span>
                <button
                  onClick={() => handleNavClick('admin')}
                  className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-2xl text-xs font-semibold transition-all cursor-pointer relative ${
                    activeTab === 'admin'
                      ? 'bg-amber-100/70 text-amber-900 font-bold'
                      : 'text-amber-800 hover:bg-amber-50/50'
                  }`}
                >
                  <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0" />
                  <span className="text-[13px]">Painel Super Admin</span>
                </button>
              </div>
            )}
          </nav>

          {/* Bottom User Profile Section (Matching Reference Visual) */}
          <div className="p-5 border-t border-slate-100 bg-white">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3 min-w-0 pr-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#6D28D9] to-[#9333EA] text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
                  {userInitial}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-[#17152B] truncate leading-tight">
                    {user?.name || 'Kelven'}
                  </p>
                  <p className="text-[11px] text-[#77758A] truncate leading-tight">
                    {user?.email || 'kelven137hh@gmail.com'}
                  </p>
                </div>
              </div>

              <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-lg font-bold shrink-0">
                {user?.plan_id || 'FREE'}
              </span>
            </div>

            <button
              onClick={logout}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold text-[#77758A] hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Terminar Sessão</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="hidden md:flex bg-white border-b border-slate-100 px-8 py-4 items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2 text-xs text-[#77758A] font-medium">
            <span className="font-bold text-[#6D28D9]">Catafy</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <span className="text-[#17152B] font-semibold">{currentTabLabel}</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onNewCatalog}
              className="py-2.5 px-4 btn-catafy-gradient text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Novo Catálogo</span>
            </button>
          </div>
        </header>

        {/* Viewport Content */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
};
