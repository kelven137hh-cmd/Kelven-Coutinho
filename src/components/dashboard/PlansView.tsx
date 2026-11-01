import React from 'react';
import { Check, Shield, Zap, Sparkles, CreditCard } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Business, Catalog, Product } from '../../types';

interface PlansViewProps {
  businesses: Business[];
  catalogs: Catalog[];
  products: Product[];
}

export const PlansView: React.FC<PlansViewProps> = ({ businesses, catalogs, products }) => {
  const { user } = useAuth();
  const currentPlan = user?.plan_id || 'free';

  const plans = [
    {
      id: 'free',
      name: 'Plano Grátis',
      price: '0',
      period: 'para sempre',
      desc: 'Ideal para profissionais autônomos e pequenos negócios iniciando no digital.',
      limits: {
        businesses: '1 Empresa',
        catalogs: '1 Catálogo Ativo',
        products: 'Até 15 Produtos',
        templates: 'Modelos Classic & Minimal',
      },
      features: [
        'Link público exclusivo /loja/:slug',
        'Pedidos diretos no WhatsApp',
        'Upload de fotos e logotipo',
        'Suporte comunitário',
      ],
      current: currentPlan === 'free',
    },
    {
      id: 'pro',
      name: 'Plano Profissional',
      price: '19',
      period: 'por mês',
      badge: 'Mais Escolhido',
      desc: 'Perfeito para restaurantes, pizzarias, lojas e negócios em pleno crescimento.',
      limits: {
        businesses: 'Até 3 Empresas / Filiais',
        catalogs: 'Até 5 Catálogos Ativos',
        products: 'Até 150 Produtos',
        templates: 'Todos os 5 Modelos Visuais',
      },
      features: [
        'Todos os 5 Modelos Visuais',
        'Estatísticas e métricas de acessos',
        'Taxa de conversão e produtos mais pedidos',
        'Personalização de cores e tipografias',
        'Suporte prioritário via WhatsApp',
      ],
      current: currentPlan === 'pro',
    },
    {
      id: 'business',
      name: 'Plano Empresarial',
      price: '49',
      period: 'por mês',
      desc: 'Para redes de franquias, grandes cardápios e empresas que precisam de escala total.',
      limits: {
        businesses: 'Empresas Ilimitadas',
        catalogs: 'Catálogos Ilimitados',
        products: 'Produtos Ilimitados',
        templates: 'Todos os Modelos + Acesso VIP',
      },
      features: [
        'Sem qualquer limite de empresas ou itens',
        'Acesso prioritário a novos templates',
        'Integrações avançadas e exportação',
        'Gerente de conta dedicado',
      ],
      current: currentPlan === 'business',
    },
  ];

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Planos & Faturação
        </h2>
        <p className="text-xs sm:text-sm text-slate-500">
          Estrutura pronta para futura integração com gateway de pagamento. Nesta versão de desenvolvimento, todas as funcionalidades estão liberadas para testes.
        </p>
      </div>

      {/* Usage Meter Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs font-semibold text-slate-500 block">Seu Plano Atual:</span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xl font-bold text-slate-900 uppercase font-mono">
                {currentPlan}
              </span>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                Ativo
              </span>
            </div>
          </div>

          <div className="text-xs text-slate-400">
            Ambiente de teste: limites flexíveis para criação e testes
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-slate-100 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl space-y-1">
            <span className="text-slate-500 font-medium">Empresas Cadastradas</span>
            <div className="text-lg font-bold font-mono text-slate-900">
              {businesses.length}
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl space-y-1">
            <span className="text-slate-500 font-medium">Catálogos Criados</span>
            <div className="text-lg font-bold font-mono text-slate-900">
              {catalogs.length}
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl space-y-1">
            <span className="text-slate-500 font-medium">Total de Produtos</span>
            <div className="text-lg font-bold font-mono text-slate-900">
              {products.length}
            </div>
          </div>
        </div>
      </div>

      {/* Plans Tier Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((p) => (
          <div
            key={p.id}
            className={`bg-white rounded-2xl border-2 p-6 flex flex-col justify-between transition-all ${
              p.current
                ? 'border-slate-900 ring-2 ring-slate-900/10 shadow-sm'
                : 'border-slate-200/90 hover:border-slate-300'
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  {p.name}
                </span>
                {p.badge && (
                  <span className="text-[10px] font-bold uppercase tracking-wider btn-catafy-gradient text-white px-2.5 py-0.5 rounded-full">
                    {p.badge}
                  </span>
                )}
                {p.current && (
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-[#6D28D9] text-white px-2.5 py-0.5 rounded-full">
                    Plano Atual
                  </span>
                )}
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-slate-900 font-mono">
                  €{p.price}
                </span>
                <span className="text-xs text-slate-500">/{p.period}</span>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed">{p.desc}</p>

              <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
                <div className="font-semibold text-slate-800">Limites do Plano:</div>
                <div className="text-slate-600 space-y-1 text-[11px] font-mono">
                  <div>• {p.limits.businesses}</div>
                  <div>• {p.limits.catalogs}</div>
                  <div>• {p.limits.products}</div>
                  <div>• {p.limits.templates}</div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-2">
                <div className="text-xs font-semibold text-slate-800">Recursos:</div>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  {p.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 mt-6">
              <button
                type="button"
                disabled={p.current}
                onClick={() => alert('Upgrade de plano simulado com sucesso!')}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${
                  p.current
                    ? 'bg-slate-100 text-slate-400 cursor-default'
                    : 'btn-catafy-gradient text-white hover:opacity-95 shadow-xs'
                }`}
              >
                {p.current ? 'Seu Plano Atual' : 'Escolher este Plano'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
