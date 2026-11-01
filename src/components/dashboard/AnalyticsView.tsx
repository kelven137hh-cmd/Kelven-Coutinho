import React, { useState, useEffect } from 'react';
import { BarChart3, Eye, MessageCircle, TrendingUp, Calendar, BookOpen } from 'lucide-react';
import { AnalyticsData, Business, Catalog } from '../../types';
import { api } from '../../lib/api';

interface AnalyticsViewProps {
  businesses: Business[];
  catalogs: Catalog[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ businesses, catalogs }) => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .getAnalytics()
      .then((data) => setAnalytics(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center text-xs text-slate-400">
        A carregar métricas analíticas...
      </div>
    );
  }

  const maxDailyViews = Math.max(1, ...(analytics?.timeline.map((t) => t.views) || [1]));

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Estatísticas & Desempenho</h2>
        <p className="text-xs sm:text-sm text-slate-500">
          Métricas consolidadas de acessos aos catálogos e intenções de compra no WhatsApp.
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Visualizações Totais</span>
            <Eye className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
            {analytics?.totalViews ?? 0}
          </div>
          <p className="text-[11px] text-slate-400">Total de acessos únicos aos seus links</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-emerald-800 text-xs font-semibold">
            <span>Cliques no WhatsApp</span>
            <MessageCircle className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
            {analytics?.totalClicks ?? 0}
          </div>
          <p className="text-[11px] text-emerald-700 font-medium">Pedidos ou conversas iniciadas</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Taxa Geral de Conversão</span>
            <TrendingUp className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
            {analytics?.overallConversionRate || '0.0'}%
          </div>
          <p className="text-[11px] text-slate-400">Visitantes que clicaram em comprar</p>
        </div>
      </div>

      {/* Visual Timeline Bar Chart (Past 14 Days) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Histórico dos Últimos 14 Dias</h3>
            <p className="text-xs text-slate-400">Evolução diária de visualizações e cliques</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium">
            <div className="flex items-center gap-1.5 text-slate-700">
              <span className="w-3 h-3 rounded-sm bg-slate-900" />
              <span>Visualizações</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-700">
              <span className="w-3 h-3 rounded-sm bg-emerald-500" />
              <span>WhatsApp</span>
            </div>
          </div>
        </div>

        {analytics?.timeline && analytics.timeline.length > 0 ? (
          <div className="pt-6">
            <div className="h-44 flex items-end gap-2 sm:gap-4 px-2">
              {analytics.timeline.map((day, idx) => {
                const viewHeightPercent = Math.max(8, (day.views / maxDailyViews) * 100);
                const clickHeightPercent = Math.max(4, (day.clicks / maxDailyViews) * 100);
                const dayLabel = day.date.slice(5); // MM-DD

                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                    <div className="w-full flex items-end justify-center gap-1 h-full">
                      {/* View Bar */}
                      <div
                        className="w-full max-w-[16px] bg-slate-900 rounded-t-sm group-hover:bg-slate-800 transition-all relative"
                        style={{ height: `${viewHeightPercent}%` }}
                        title={`${day.views} visualizações em ${day.date}`}
                      />
                      {/* Click Bar */}
                      <div
                        className="w-full max-w-[16px] bg-emerald-500 rounded-t-sm group-hover:bg-emerald-600 transition-all relative"
                        style={{ height: `${clickHeightPercent}%` }}
                        title={`${day.clicks} cliques WhatsApp em ${day.date}`}
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono whitespace-nowrap">
                      {dayLabel}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <p className="text-xs text-slate-400 py-8 text-center">Sem dados de histórico para o período.</p>
        )}
      </div>

      {/* 2 Tables: Breakdown by Catalog & Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Breakdown by Catalog */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-base">Desempenho por Catálogo</h3>
            <BookOpen className="w-4 h-4 text-slate-400" />
          </div>

          {analytics?.catalogs && analytics.catalogs.length > 0 ? (
            <div className="divide-y divide-slate-100 text-xs">
              {analytics.catalogs.map((c) => (
                <div key={c.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <span className="font-bold text-slate-900 block truncate">{c.title}</span>
                    <span className="text-[11px] text-slate-400 font-mono truncate">/loja/{c.slug}</span>
                  </div>

                  <div className="text-right shrink-0 space-y-0.5">
                    <div className="flex items-center gap-3 font-mono">
                      <span className="text-slate-600">{c.views} views</span>
                      <span className="text-emerald-700 font-bold">{c.clicks} cliques</span>
                    </div>
                    <span className="text-[10px] text-slate-400 block font-mono">
                      Conversão: {c.conversionRate}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400">Nenhum catálogo ativo para analisar.</p>
          )}
        </div>

        {/* Top Clicked Products */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-base">Produtos Mais Clicados / Pedidos</h3>
            <MessageCircle className="w-4 h-4 text-emerald-600" />
          </div>

          {analytics?.topProducts && analytics.topProducts.length > 0 ? (
            <div className="divide-y divide-slate-100 text-xs">
              {analytics.topProducts.map((p, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 font-bold font-mono text-[11px] flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span className="font-bold text-slate-900 truncate">{p.name}</span>
                  </div>

                  <span className="font-mono font-bold text-emerald-800 text-xs shrink-0">
                    {p.count} {p.count === 1 ? 'pedido' : 'pedidos'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400">Nenhum pedido individual registrado ainda.</p>
          )}
        </div>
      </div>
    </div>
  );
};
