import React, { useState } from 'react';
import {
  ArrowRight,
  Check,
  ChevronDown,
  MessageCircle,
  ExternalLink,
  Smartphone,
  Sparkles,
  Zap,
  Store,
  Layers,
  BarChart3,
  QrCode,
  Shield,
  Palette,
} from 'lucide-react';

interface LandingPageProps {
  onOpenAuth: (initialTab?: 'login' | 'register') => void;
  onViewDemoCatalog: (slug?: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenAuth,
  onViewDemoCatalog,
}) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [activeSegmentTab, setActiveSegmentTab] = useState<string>('pizzeria');

  const segments = [
    {
      id: 'pizzeria',
      name: 'Pizzarias & Hamburguerias',
      demoSlug: 'pizzaria-forno-e-brasa',
      headline: 'Menús dinâmicos com tamanhos, ingredientes e combos irresistíveis',
      desc: 'Os seus clientes selecionam os sabores, adicionam observações (ex: sem cebola) e o pedido chega pronto e formatado no WhatsApp da sua pizzaria.',
      badge: 'Exemplo Restaurante',
    },
    {
      id: 'fashion',
      name: 'Lojas de Roupas & Calçado',
      demoSlug: 'aura-concept',
      headline: 'Apresentação editorial de coleções, cores e tamanhos',
      desc: 'Mostre as novidades da semana, fotografias com detalhes de tecido e permita reservas imediatas no WhatsApp sem atritos.',
      badge: 'Exemplo Moda & Varejo',
    },
    {
      id: 'barbershop',
      name: 'Barbearias & Salões de Beleza',
      demoSlug: 'gentleman-barber',
      headline: 'Tabela de serviços profissionais com tempos de atendimento',
      desc: 'Apresente seus cortes, barboterapia, tratamentos e facilite o agendamento de horários pelos clientes diretamente no WhatsApp.',
      badge: 'Exemplo Serviços',
    },
    {
      id: 'supermarket',
      name: 'Supermercados & Mercearias',
      demoSlug: 'pizzaria-forno-e-brasa',
      headline: 'Listas condensadas de produtos com busca ultrarrápida',
      desc: 'Ideal para negócios com alto volume de itens. O cliente monta uma sacola de compras completa em segundos.',
      badge: 'Exemplo Alta Densidade',
    },
  ];

  const faqs = [
    {
      q: 'O meu cliente precisa descarregar algum aplicativo ou fazer login?',
      a: 'Não! Os catálogos criados no Catafy são 100% públicos e abrem instantaneamente no navegador do telemóvel ou computador. O cliente não precisa criar conta nem baixar nada.',
    },
    {
      q: 'Como chegam os pedidos no meu WhatsApp?',
      a: 'Quando o cliente clica no botão do WhatsApp, o sistema gera uma mensagem pronta com a lista de itens, tamanhos, cores, observações e o valor total já somado.',
    },
    {
      q: 'A plataforma cobra alguma comissão sobre as minhas vendas?',
      a: 'Zero comissões! Ao contrário dos aplicativos tradicionais de delivery que cobram até 30%, no Catafy 100% do valor das suas vendas fica consigo.',
    },
    {
      q: 'Posso cadastrar mais de um negócio na mesma conta?',
      a: 'Sim! O Catafy é uma plataforma multiempresa completa. Pode cadastrar a sua pizzaria, sua loja de roupas ou filiais diferentes no mesmo dashboard.',
    },
    {
      q: 'Como partilho o meu catálogo com os clientes?',
      a: 'Recebe um link exclusivo (ex: seudominio.com/loja/sua-empresa) e pode colocá-lo na bio do seu Instagram, enviar em grupos de WhatsApp ou imprimir um QR Code para mesas e balcões.',
    },
  ];

  const activeSegmentData = segments.find((s) => s.id === activeSegmentTab) || segments[0];

  return (
    <div className="bg-white text-slate-900">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#6D28D9] bg-violet-50 border border-violet-100 px-3 py-1.5 rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-[#FF7A00]" />
              <span>Gerador de Catálogos Digitais Multiempresa</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1] text-balance">
              Crie o catálogo digital da sua empresa em poucos minutos.
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
              Apresente os seus produtos, organize os seus preços e partilhe o seu catálogo com os seus clientes através de um único link com pedidos integrados ao WhatsApp.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <button
                onClick={() => onOpenAuth('register')}
                className="py-3.5 px-6 rounded-xl btn-catafy-gradient text-white font-bold text-sm shadow-md transition-opacity hover:opacity-95 flex items-center justify-center gap-2"
              >
                <span>Criar meu catálogo gratuitamente</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onViewDemoCatalog('pizzaria-forno-e-brasa')}
                className="py-3.5 px-6 rounded-xl border border-slate-200 hover:border-slate-300 bg-white font-bold text-sm text-slate-800 transition-colors flex items-center justify-center gap-2 shadow-2xs"
              >
                <Smartphone className="w-4 h-4 text-slate-500" />
                <span>Ver demonstração ao vivo</span>
              </button>
            </div>

            {/* Social Trust Markers */}
            <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center gap-6 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Sem necessidade de conhecimentos técnicos</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Zero comissões por venda</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Compatível com telemóvel e desktop</span>
              </div>
            </div>
          </div>

          {/* Right Visual Column: Smartphone Mockup */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-sm sm:max-w-md">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-800 bg-slate-900">
                <img
                  src="/src/assets/images/hero_catalog_phone_1793488873820.jpg"
                  alt="Demonstração visual do catálogo digital em smartphone"
                  className="w-full h-auto object-cover block"
                  referrerPolicy="no-referrer"
                />

                {/* Interactive Overlaid Action Badge */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl flex items-center justify-between gap-3 border border-slate-200/80">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                      <MessageCircle className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-slate-900 block truncate">
                        Pedidos via WhatsApp
                      </span>
                      <span className="text-[11px] text-slate-500 block truncate">
                        Mensagem formatada com produtos e total
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => onViewDemoCatalog('pizzaria-forno-e-brasa')}
                    className="py-1.5 px-3 bg-[#6D28D9] text-white text-xs font-bold rounded-lg shrink-0 hover:bg-[#5b21b6] transition-colors"
                  >
                    Testar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. COMO FUNCIONA */}
      <section id="como-funciona" className="py-20 bg-slate-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#6D28D9]">
              Passo a Passo Simples
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Como funciona o Catafy?
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Criar o catálogo da sua empresa é tão fácil que você não precisa de nenhum conhecimento de programação.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
              <span className="w-10 h-10 rounded-xl bg-slate-100 font-mono font-bold text-base text-slate-900 flex items-center justify-center">
                01
              </span>
              <h3 className="text-lg font-bold text-slate-900">Cadastre a sua empresa</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Insira o nome do seu negócio, categoria, logotipo, endereço e o número de WhatsApp onde deseja receber os pedidos.
              </p>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
              <span className="w-10 h-10 rounded-xl bg-slate-100 font-mono font-bold text-base text-slate-900 flex items-center justify-center">
                02
              </span>
              <h3 className="text-lg font-bold text-slate-900">Escolha o modelo & produtos</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Selecione um dos 5 modelos visuais modernos, defina suas cores e adicione produtos com preços, fotos e opções de tamanhos.
              </p>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
              <span className="w-10 h-10 rounded-xl bg-slate-100 font-mono font-bold text-base text-slate-900 flex items-center justify-center">
                03
              </span>
              <h3 className="text-lg font-bold text-slate-900">Publique e partilhe o link</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Divulgue o seu link exclusivo no Instagram, envie aos clientes e receba notificações instantâneas de pedidos no WhatsApp.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. MODELOS DE CATÁLOGOS */}
      <section id="modelos" className="py-20 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
              Inspirado no MenuSquared
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              5 Modelos Visuais Exclusivos
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Adapte a apresentação visual dos seus produtos conforme o perfil do seu cliente e segmento.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'Modern',
                subtitle: 'Grelha com fotografias expressivas',
                desc: 'Cartões fluidos, badges de promoção e categorias em abas.',
                segment: 'Restaurantes & Roupas',
              },
              {
                title: 'Classic',
                subtitle: 'Menu tradicional em lista',
                desc: 'Linhas claras com fotografias compactas e preços perfeitamente alinhados.',
                segment: 'Barbearias & Bistrôs',
              },
              {
                title: 'Premium',
                subtitle: 'Design de luxo editorial',
                desc: 'Tipografia elegante serifada, acabamento sofisticado e fotos destacadas.',
                segment: 'Boutiques & Vinhos',
              },
              {
                title: 'Minimal',
                subtitle: 'Design limpo e sem distrações',
                desc: 'Espaçamentos amplos, fundo neutro e valorização artística do produto.',
                segment: 'Acessórios & Design',
              },
              {
                title: 'Compact',
                subtitle: 'Lista condensada para grandes estoques',
                desc: 'Ideal para supermercados e catálogos com centenas de itens por página.',
                segment: 'Supermercados & Armazéns',
              },
            ].map((m, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl border border-slate-200/90 bg-white shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                    Modelo {idx + 1}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900">{m.title}</h3>
                  <p className="text-xs font-medium text-slate-700">{m.subtitle}</p>
                  <p className="text-xs text-slate-500 leading-relaxed">{m.desc}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Recomendado para:</span>
                  <span className="font-semibold text-slate-700">{m.segment}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. SEGMENTOS DE NEGÓCIOS */}
      <section id="segmentos" className="py-20 bg-slate-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
              Multiempresa & Multisegmento
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Feito para o seu tipo de negócio
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              A experiência de criação e os campos adaptam-se dinamicamente à sua categoria.
            </p>
          </div>

          {/* Segment Selector Tabs */}
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {segments.map((seg) => (
              <button
                key={seg.id}
                onClick={() => setActiveSegmentTab(seg.id)}
                className={`py-2 px-4 rounded-xl text-xs font-semibold transition-all ${
                  activeSegmentTab === seg.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
                }`}
              >
                {seg.name}
              </button>
            ))}
          </div>

          {/* Active Segment Feature Presentation */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-8 max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4 flex-1">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full inline-block">
                {activeSegmentData.badge}
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                {activeSegmentData.headline}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {activeSegmentData.desc}
              </p>

              <div className="pt-2">
                <button
                  onClick={() => onViewDemoCatalog(activeSegmentData.demoSlug)}
                  className="py-2.5 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-2 transition-colors shadow-2xs"
                >
                  <span>Abrir Demonstração Real</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="w-full md:w-72 aspect-4/3 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
              {activeSegmentTab === 'pizzeria' && (
                <img
                  src="/src/assets/images/food_artisan_pizza_1793488874759.jpg"
                  alt="Pizza artesanal"
                  className="w-full h-full object-cover"
                />
              )}
              {activeSegmentTab === 'fashion' && (
                <img
                  src="/src/assets/images/fashion_boutique_items_1793488875071.jpg"
                  alt="Moda minimalista"
                  className="w-full h-full object-cover"
                />
              )}
              {activeSegmentTab === 'barbershop' && (
                <img
                  src="/src/assets/images/barber_grooming_station_1793488875178.jpg"
                  alt="Barbearia premium"
                  className="w-full h-full object-cover"
                />
              )}
              {activeSegmentTab === 'supermarket' && (
                <img
                  src="/src/assets/images/food_artisan_pizza_1793488874759.jpg"
                  alt="Supermercado e produtos"
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 5 & 6. FUNCIONALIDADES & BENEFÍCIOS */}
      <section className="py-20 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
              Tudo O Que Você Precisa
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Recursos construídos para vender
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Economize horas de atendimento e organize o fluxo de pedidos no WhatsApp da sua empresa.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3 p-6 rounded-2xl bg-slate-50/70 border border-slate-200/80">
              <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-900 shadow-2xs">
                <Store className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Múltiplos Negócios</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Faça a gestão de diferentes marcas ou filiais em uma única conta, cada qual com seus próprios produtos, categorias e catálogos.
              </p>
            </div>

            <div className="space-y-3 p-6 rounded-2xl bg-slate-50/70 border border-slate-200/80">
              <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-900 shadow-2xs">
                <MessageCircle className="w-5 h-5 text-emerald-600" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Integração WhatsApp Direta</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                O cliente clica e o pedido chega pronto para atendimento no WhatsApp com resumo detalhado e valores somados.
              </p>
            </div>

            <div className="space-y-3 p-6 rounded-2xl bg-slate-50/70 border border-slate-200/80">
              <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-900 shadow-2xs">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Estatísticas Reais</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Acompanhe visualizações totais, cliques no WhatsApp por produto e taxa de conversão em tempo real.
              </p>
            </div>

            <div className="space-y-3 p-6 rounded-2xl bg-slate-50/70 border border-slate-200/80">
              <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-900 shadow-2xs">
                <Palette className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Personalização Visual</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Escolha a sua cor de destaque, tipografia e imagens para deixar o catálogo fiel à identidade da sua marca.
              </p>
            </div>

            <div className="space-y-3 p-6 rounded-2xl bg-slate-50/70 border border-slate-200/80">
              <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-900 shadow-2xs">
                <QrCode className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Links & QR Code</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Links curtos e amigáveis para colocar na bio do Instagram ou imprimir em mesas e balcões com leitura rápida.
              </p>
            </div>

            <div className="space-y-3 p-6 rounded-2xl bg-slate-50/70 border border-slate-200/80">
              <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-900 shadow-2xs">
                <Zap className="w-5 h-5 text-amber-500" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Carregamento Instantâneo</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Arquitetura SPA de alta performance sem telas brancas ou lentidão em conexões 4G móveis.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. PLANOS E PREÇOS */}
      <section id="precos" className="py-20 bg-slate-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
              Preços Transparentes
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Comece gratuitamente hoje mesmo
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Planos desenhados para cada fase do seu negócio, sem letras miúdas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8 flex flex-col justify-between shadow-2xs">
              <div className="space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Grátis
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-slate-900 font-mono">€0</span>
                  <span className="text-xs text-slate-400">/sempre</span>
                </div>
                <p className="text-xs text-slate-500">
                  Ideal para testar e começar a vender com o primeiro catálogo.
                </p>

                <div className="pt-4 border-t border-slate-100 space-y-2.5 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>1 Empresa cadastrada</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>1 Catálogo publicado</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Até 15 produtos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Pedidos no WhatsApp</span>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <button
                  onClick={() => onOpenAuth('register')}
                  className="w-full py-2.5 px-4 rounded-xl border border-slate-300 font-bold text-xs text-slate-800 hover:bg-slate-50 transition-colors"
                >
                  Criar Grátis
                </button>
              </div>
            </div>

            {/* Pro */}
            <div className="bg-white rounded-2xl border-2 border-slate-900 p-8 flex flex-col justify-between shadow-md relative ring-2 ring-slate-900/10">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full">
                Mais Popular
              </span>

              <div className="space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  Profissional
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-slate-900 font-mono">€19</span>
                  <span className="text-xs text-slate-400">/mês</span>
                </div>
                <p className="text-xs text-slate-500">
                  Para empresas que querem destaque, todos os modelos e dados analíticos.
                </p>

                <div className="pt-4 border-t border-slate-100 space-y-2.5 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Até 3 Empresas / Filiais</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Até 5 Catálogos ativos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Até 150 produtos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Todos os 5 Modelos Visuais</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Estatísticas de visualizações e cliques</span>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <button
                  onClick={() => onOpenAuth('register')}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors shadow-xs"
                >
                  Experimentar Plano Pro
                </button>
              </div>
            </div>

            {/* Business */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8 flex flex-col justify-between shadow-2xs">
              <div className="space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Empresarial
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-slate-900 font-mono">€49</span>
                  <span className="text-xs text-slate-400">/mês</span>
                </div>
                <p className="text-xs text-slate-500">
                  Para redes, franquias ou negócios com alta demanda e inventários ilimitados.
                </p>

                <div className="pt-4 border-t border-slate-100 space-y-2.5 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Empresas ilimitadas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Catálogos ilimitados</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Produtos ilimitados</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Suporte prioritário VIP</span>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <button
                  onClick={() => onOpenAuth('register')}
                  className="w-full py-2.5 px-4 rounded-xl border border-slate-300 font-bold text-xs text-slate-800 hover:bg-slate-50 transition-colors"
                >
                  Contactar Comercial
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. PERGUNTAS FREQUENTES (FAQ) */}
      <section id="faq" className="py-20 bg-white border-b border-slate-100">
        <div className="max-w-3xl mx-auto px-6 space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
              Dúvidas Comuns
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Perguntas Frequentes
            </h2>
          </div>

          <div className="divide-y divide-slate-100 border border-slate-200/90 rounded-2xl overflow-hidden shadow-2xs">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className="p-5">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between text-left font-bold text-slate-900 text-sm gap-4"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${
                        isOpen ? 'rotate-180 text-slate-900' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed pr-6 animate-in fade-in duration-200">
                      {faq.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 9. CHAMADA FINAL PARA REGISTO */}
      <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#6D28D9]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#FF7A00]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto px-6 text-center space-y-6 relative z-10">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Pronto para modernizar as vendas da sua empresa?
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
            Junte-se a restaurantes, lojas e prestadores de serviços que já utilizam o Catafy para vender mais pelo WhatsApp.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => onOpenAuth('register')}
              className="w-full sm:w-auto py-3.5 px-8 rounded-xl btn-catafy-gradient text-white font-bold text-sm hover:opacity-95 transition-opacity shadow-lg"
            >
              Criar meu catálogo gratuitamente
            </button>
            <button
              onClick={() => onViewDemoCatalog('pizzaria-forno-e-brasa')}
              className="w-full sm:w-auto py-3.5 px-6 rounded-xl border border-slate-700 hover:border-slate-500 text-white font-bold text-sm transition-colors"
            >
              Ver demonstração
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 bg-white border-t border-slate-100 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 font-bold text-slate-900">
            <div className="w-6 h-6 rounded-lg btn-catafy-gradient flex items-center justify-center text-white text-xs font-black shadow-xs">
              C
            </div>
            <span className="text-sm font-extrabold tracking-tight text-[#17152B]">Catafy</span>
            <span className="text-slate-400 font-normal">· Plataforma SaaS de Catálogos Digitais</span>
          </div>

          <div className="flex items-center gap-6">
            <a href="#como-funciona" className="hover:text-slate-900">Como funciona</a>
            <a href="#modelos" className="hover:text-slate-900">Modelos</a>
            <a href="#precos" className="hover:text-slate-900">Planos</a>
            <button onClick={() => onOpenAuth('login')} className="hover:text-slate-900 font-semibold text-[#6D28D9]">
              Iniciar Sessão
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
