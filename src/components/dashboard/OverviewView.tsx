import React from 'react';
import {
  Store,
  BookOpen,
  Package,
  Eye,
  Plus,
  ArrowUpRight,
  MessageCircle,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { Business, Catalog, Product, AnalyticsData } from '../../types';

interface OverviewViewProps {
  businesses: Business[];
  catalogs: Catalog[];
  products: Product[];
  analytics: AnalyticsData | null;
  onNewCatalog: () => void;
  onNewBusiness: () => void;
  onSelectTab: (tab: string) => void;
  onOpenPublicCatalog: (slug: string) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  businesses,
  catalogs,
  products,
  analytics,
  onNewCatalog,
  onNewBusiness,
  onSelectTab,
  onOpenPublicCatalog,
}) => {
  const totalViews = analytics?.totalViews ?? 0;
  const totalClicks = analytics?.totalClicks ?? 0;

  const statCards = [
    {
      label: 'Total de Negócios',
      value: businesses.length,
      icon: Store,
      tab: 'businesses',
      actionText: 'Gerir empresas',
      color: 'text-[#6D28D9] bg-purple-50',
    },
    {
      label: 'Total de Catálogos',
      value: catalogs.length,
      icon: BookOpen,
      tab: 'catalogs',
      actionText: 'Ver catálogos',
      color: 'text-[#9333EA] bg-violet-50',
    },
    {
      label: 'Total de Produtos',
      value: products.length,
      icon: Package,
      tab: 'products',
      actionText: 'Gerir inventário',
      color: 'text-[#FF7A00] bg-orange-50',
    },
    {
      label: 'Visualizações dos Catálogos',
      value: totalViews,
      icon: Eye,
      tab: 'analytics',
      actionText: 'Ver estatísticas',
      color: 'text-emerald-700 bg-emerald-50',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5 max-w-xl">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17152B] tracking-tight">
            Bem-vindo ao seu painel Catafy
          </h1>
          <p className="text-sm text-[#77758A] leading-relaxed">
            Aqui você acompanha o desempenho dos seus catálogos digitais, publica novos produtos e recebe pedidos diretamente no WhatsApp.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={onNewBusiness}
            className="py-2.5 px-4 bg-white border border-slate-200 hover:border-[#6D28D9] rounded-xl text-xs font-semibold text-[#17152B] transition-colors shadow-2xs cursor-pointer"
          >
            + Adicionar Empresa
          </button>
          <button
            onClick={onNewCatalog}
            className="py-2.5 px-5 btn-catafy-gradient text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>+ Criar novo catálogo</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              onClick={() => onSelectTab(stat.tab)}
              className="bg-white rounded-2xl p-5 border border-slate-100 shadow-2xs hover:border-[#6D28D9]/40 hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#77758A]">{stat.label}</span>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${stat.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div className="my-4">
                <span className="text-3xl font-extrabold text-[#17152B] font-mono tabular-nums">
                  {stat.value}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-[#77758A] font-medium pt-2 border-t border-slate-100">
                <span className="group-hover:text-[#6D28D9]">{stat.actionText}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* 2-Column Split: Catalogs in Live Action & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Catalogs */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-2xs p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-[#17152B] text-base">Meus Catálogos Publicados</h3>
                <p className="text-xs text-[#77758A]">Links públicos ativos no Catafy</p>
              </div>
              <button
                onClick={() => onSelectTab('catalogs')}
                className="text-xs font-semibold text-[#6D28D9] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Ver todos</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {catalogs.length === 0 ? (
              <div className="py-12 text-center space-y-3">
                <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
                <p className="text-sm font-semibold text-[#17152B]">Nenhum catálogo criado ainda</p>
                <p className="text-xs text-[#77758A] max-w-sm mx-auto">
                  Crie seu primeiro catálogo em poucos cliques e comece a divulgar seus produtos.
                </p>
                <button
                  onClick={onNewCatalog}
                  className="mt-2 py-2 px-4 btn-catafy-gradient text-white rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Criar primeiro catálogo
                </button>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {catalogs.slice(0, 4).map((cat) => (
                  <div key={cat.id} className="py-3.5 flex items-center justify-between gap-4">
                    <div className="min-w-0 flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-2xs"
                        style={{ backgroundColor: cat.primary_color || '#6D28D9' }}
                      >
                        {cat.title.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-[#17152B] truncate">{cat.title}</h4>
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                              cat.is_active
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {cat.is_active ? 'Publicado' : 'Rascunho'}
                          </span>
                        </div>
                        <p className="text-xs text-[#77758A] font-mono truncate">/loja/{cat.slug}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => onOpenPublicCatalog(cat.slug)}
                        className="py-1.5 px-3 rounded-lg border border-slate-200 hover:bg-[#F8F7FC] text-xs font-semibold text-[#17152B] flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <span>Abrir</span>
                        <ExternalLink className="w-3 h-3 text-slate-400" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {catalogs.length > 0 && (
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-[#77758A]">
              <span>{catalogs.filter((c) => c.is_active).length} de {catalogs.length} catálogos ativos</span>
              <button
                onClick={onNewCatalog}
                className="font-bold text-[#6D28D9] hover:underline cursor-pointer"
              >
                + Adicionar outro catálogo
              </button>
            </div>
          )}
        </div>

        {/* WhatsApp Conversions & Quick Health */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-2xs p-6 space-y-6">
          <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-[#17152B] text-base">Conversão WhatsApp</h3>
              <p className="text-xs text-[#77758A]">Interações reais dos visitantes</p>
            </div>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <MessageCircle className="w-4 h-4" />
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-100">
              <span className="text-xs font-semibold text-emerald-800 block">Total de Cliques no WhatsApp</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-extrabold text-emerald-950 font-mono tabular-nums">
                  {totalClicks}
                </span>
                <span className="text-xs text-emerald-700 font-medium">pedidos iniciados</span>
              </div>
            </div>

            <div className="p-4 bg-[#F8F7FC] rounded-2xl border border-slate-100 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#17152B] font-medium">Taxa de Conversão</span>
                <span className="font-bold font-mono text-[#6D28D9]">
                  {analytics?.overallConversionRate || '0.0'}%
                </span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-[#6D28D9] to-[#FF7A00] h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, Number(analytics?.overallConversionRate || 0) * 4)}%` }}
                />
              </div>
            </div>

            <div className="pt-2">
              <span className="text-xs font-bold text-[#17152B] block mb-2">Produtos Mais Pedidos</span>
              {analytics?.topProducts && analytics.topProducts.length > 0 ? (
                <div className="space-y-2">
                  {analytics.topProducts.slice(0, 3).map((prod, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs text-[#77758A]">
                      <span className="truncate pr-2">{prod.name}</span>
                      <span className="font-mono font-bold text-[#17152B] shrink-0">
                        {prod.count} {prod.count === 1 ? 'pedido' : 'pedidos'}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[#77758A]">Nenhum clique registado ainda.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
