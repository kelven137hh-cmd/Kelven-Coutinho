import React, { useState } from 'react';
import {
  Palette,
  Check,
  Eye,
  Sparkles,
  Smartphone,
  Monitor,
  X,
  ArrowRight,
  ShoppingBag,
  MessageCircle,
  Tag,
  Star,
  Plus,
  ArrowUpRight,
  Coffee,
  Utensils,
  Gem,
  Compass,
  Store,
  Layers,
  Search,
} from 'lucide-react';
import { CatalogTemplate, Product, Category } from '../../types';

interface TemplatesViewProps {
  onSelectTemplateForNewCatalog: (template: CatalogTemplate) => void;
}

interface TemplateMetadata {
  id: CatalogTemplate;
  name: string;
  tag: string;
  subtitle: string;
  description: string;
  suitableFor: string;
  features: string[];
  mockBusiness: {
    name: string;
    tagline: string;
    categoryName: string;
    primaryColor: string;
    coverUrl: string;
    logoUrl: string;
    currency: string;
    typographyPair: string;
    fontFamily: string;
    categories: string[];
    products: {
      name: string;
      category: string;
      price: number;
      promoPrice?: number;
      description: string;
      imageUrl: string;
      badge?: string;
    }[];
  };
}

const TEMPLATES_DATA: TemplateMetadata[] = [
  {
    id: 'classic',
    name: 'Modelo 1 — Classic',
    tag: 'Menu Tradicional em Lista',
    subtitle: 'Layout em lista tradicional com fotografias e preços',
    description:
      'Organização clássica de cardápio com fotografias compactas alinhadas, descrições claras e preços diretos. Ideal para leitura rápida e menus com grande variedade.',
    suitableFor:
      'Restaurantes, bistrôs, pastelarias, cervejarias artesanais, barbearias e cardápios de almoço.',
    features: [
      'Disposição em lista de alta legibilidade',
      'Cabeçalho limpo com logotipo e contactos',
      'Preços em destaque e botões de contacto',
      'Ideal para cardápios e serviços detalhados',
    ],
    mockBusiness: {
      name: 'Bistrô & Cafetaria do Porto',
      tagline: 'Cafés de especialidade, brunch artesanal e doces do dia',
      categoryName: 'Cafetaria & Gastronomia',
      primaryColor: '#7C2D12',
      coverUrl:
        'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80',
      logoUrl:
        'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&w=200&q=80',
      currency: '€',
      typographyPair: 'Manrope + Inter',
      fontFamily: "'Manrope', sans-serif",
      categories: ['Todos', 'Cafés Especiais', 'Brunch & Tostas', 'Sobremesas'],
      products: [
        {
          name: 'Espresso Blend Reserva',
          category: 'Cafés Especiais',
          price: 1.9,
          description: 'Café de grãos arábica selecionados com notas de chocolate amargo e avelã.',
          imageUrl:
            'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
        },
        {
          name: 'Tosta de Abacate com Salmão Fumado',
          category: 'Brunch & Tostas',
          price: 8.5,
          promoPrice: 7.5,
          description: 'Pão sourdough de fermentação lenta, ovo escalfado e sementes de chia.',
          imageUrl:
            'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=600&q=80',
          badge: 'Mais Pedido',
        },
        {
          name: 'Croissant Francês com Queijo Brie',
          category: 'Brunch & Tostas',
          price: 4.8,
          description: 'Massa folhada com manteiga francesa pura, mel e nozes tostadas.',
          imageUrl:
            'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80',
        },
        {
          name: 'Cheesecake de Frutos Silvestres',
          category: 'Sobremesas',
          price: 4.5,
          description: 'Base crocante de bolacha artesanal e calda caseira de framboesa.',
          imageUrl:
            'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=600&q=80',
        },
      ],
    },
  },
  {
    id: 'modern',
    name: 'Modelo 2 — Modern',
    tag: 'Grelha Contemporânea com Cards',
    subtitle: 'Grelha moderna com fotografias grandes e cartões arredondados',
    description:
      'Apresentação dinâmica em grelha com cantos arredondados, imagens com enquadramento amplo, badges promocionais e apelo visual contemporâneo irresistível.',
    suitableFor:
      'Hamburguerias, pizzarias gourmet, lojas de streetwear, calçados e cosméticos.',
    features: [
      'Grelha de cartões arredondados modernos',
      'Fotografias grandes em proporção 4:3',
      'Badges promocionais coloridos em destaque',
      'Design fluido e otimizado para telemóveis',
    ],
    mockBusiness: {
      name: 'Burger & Co. Craft Studio',
      tagline: 'Smash burgers autênticos, batatas trufadas e cervejas locais',
      categoryName: 'Hamburgueria Artesanal',
      primaryColor: '#6D28D9',
      coverUrl:
        'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1200&q=80',
      logoUrl:
        'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=200&q=80',
      currency: '€',
      typographyPair: 'Plus Jakarta Sans + Inter',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      categories: ['Todos', 'Burgers Especiais', 'Acompanhamentos', 'Milkshakes'],
      products: [
        {
          name: 'Double Truffle Smash Burger',
          category: 'Burgers Especiais',
          price: 13.9,
          promoPrice: 11.9,
          description: '2 carnes smash 90g, queijo cheddar inglês, cebola frita e aioli de trufas.',
          imageUrl:
            'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
          badge: 'PROMO -15%',
        },
        {
          name: 'Bacon Jalapeño Crunch',
          category: 'Burgers Especiais',
          price: 12.5,
          description: 'Blend de costela 180g, bacon caramelizado, fatias de jalapeño e molho chipotle.',
          imageUrl:
            'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=600&q=80',
        },
        {
          name: 'Batata Rústica com Alecrim & Parmesão',
          category: 'Acompanhamentos',
          price: 4.9,
          description: 'Batatas com corte especial artesanal, alecrim fresco e parmesão ralado.',
          imageUrl:
            'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=600&q=80',
        },
        {
          name: 'Caramel Fudge Shake 400ml',
          category: 'Milkshakes',
          price: 5.5,
          description: 'Gelado artesanal de nata, calda de caramelo salgado e chantilly fresco.',
          imageUrl:
            'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80',
        },
      ],
    },
  },
  {
    id: 'premium',
    name: 'Modelo 3 — Premium',
    tag: 'Editorial de Luxo & Alta Gama',
    subtitle: 'Cabeçalho sofisticado, capa ampla e tipografia elegante',
    description:
      'Atmosfera sofisticada com fotografia de capa em evidência, tipografia serifada de revista de luxo, paleta nobre e espaçamento generoso para valorizar peças de alto valor.',
    suitableFor:
      'Boutiques de moda, alta joalharia, vinhos raros, salões de estética e spas de luxo.',
    features: [
      'Tipografia serifada nobre (Playfair Display)',
      'Cabeçalho amplo com capa cinematográfica',
      'Espaçamento generoso e apresentação sofisticada',
      'Realce máximo para peças de valor e exclusividade',
    ],
    mockBusiness: {
      name: 'Maison Élysée Joalharia',
      tagline: 'Alta joalharia artesanal em ouro 18k e pedras preciosas com certificação',
      categoryName: 'Alta Joalharia & Luxo',
      primaryColor: '#17152B',
      coverUrl:
        'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=80',
      logoUrl:
        'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=200&q=80',
      currency: '€',
      typographyPair: 'Playfair Display + DM Sans',
      fontFamily: "'Playfair Display', serif",
      categories: ['Todos', 'Anéis & Solitários', 'Colares de Ouro', 'Brincos'],
      products: [
        {
          name: 'Solitário Diamante Royale 18k',
          category: 'Anéis & Solitários',
          price: 1850.0,
          description: 'Ouro branco 18k com diamante central lapidação brilhante 0.70ct.',
          imageUrl:
            'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=600&q=80',
          badge: 'Edição Exclusiva',
        },
        {
          name: 'Gargantilha Safira & Brilhantes',
          category: 'Colares de Ouro',
          price: 1290.0,
          promoPrice: 1150.0,
          description: 'Safira natural de Ceilão envolta por pavé de diamantes em ouro amarelo.',
          imageUrl:
            'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80',
        },
        {
          name: 'Brincos Pérola South Sea',
          category: 'Brincos',
          price: 890.0,
          description: 'Pérolas australianas selecionadas com fecho de segurança em ouro.',
          imageUrl:
            'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80',
        },
        {
          name: 'Pulseira Riviera Esmeralda',
          category: 'Anéis & Solitários',
          price: 2400.0,
          description: 'Esmeraldas colombianas selecionadas à mão em suporte invisível.',
          imageUrl:
            'https://images.unsplash.com/photo-1611591475878-8f52233f269a?auto=format&fit=crop&w=600&q=80',
        },
      ],
    },
  },
  {
    id: 'minimal',
    name: 'Modelo 4 — Minimal',
    tag: 'Design Escandinavo Puro',
    subtitle: 'Fundo claro, sem ruído visual, foco rigoroso no produto',
    description:
      'Estética clean e sem ornamentos desnecessários. Amplo respiro em branco, fotografias quadradas discretas e navegação ultra-leve onde o produto é o único protagonista.',
    suitableFor:
      'Lojas de cerâmica, design de interiores, papelarias finas, marcas de roupa sustentável.',
    features: [
      'Estética nórdica limpa e atemporal',
      'Sem sombras carregadas ou elementos pesados',
      'Fotografias discretas e tipografia pura (Inter)',
      'Navegação rápida e foco absoluto nos detalhes',
    ],
    mockBusiness: {
      name: 'Atelier Nórdico & Objetos',
      tagline: 'Cerâmicas feitas à mão, linho lavado e peças utilitárias de design',
      categoryName: 'Design & Decoração',
      primaryColor: '#0F172A',
      coverUrl:
        'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80',
      logoUrl:
        'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=200&q=80',
      currency: '€',
      typographyPair: 'Inter + Inter',
      fontFamily: "'Inter', sans-serif",
      categories: ['Todos', 'Cerâmica Crua', 'Linhos Naturais', 'Velas & Aromas'],
      products: [
        {
          name: 'Vaso Cilíndrico em Argila Sand',
          category: 'Cerâmica Crua',
          price: 38.0,
          description: 'Modelado à roda com queima em forno de lenha, acabamento sem esmalte.',
          imageUrl:
            'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=600&q=80',
        },
        {
          name: 'Caneca Nórdica Minimal 300ml',
          category: 'Cerâmica Crua',
          price: 18.0,
          promoPrice: 15.0,
          description: 'Argila branca de grão fino com interior esmaltado mate sedoso.',
          imageUrl:
            'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
        },
        {
          name: 'Toalha de Mesa em Linho Cru',
          category: 'Linhos Naturais',
          price: 64.0,
          description: '100% fibra de linho europeu pré-lavado com toque suave natural.',
          imageUrl:
            'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&w=600&q=80',
        },
        {
          name: 'Vela Botânica Cera de Soja',
          category: 'Velas & Aromas',
          price: 22.0,
          description: 'Aromas botânicos de pinho silvestre, cedro e bergamota fresca.',
          imageUrl:
            'https://images.unsplash.com/photo-1602874801007-bd458bb1b8b8?auto=format&fit=crop&w=600&q=80',
        },
      ],
    },
  },
  {
    id: 'compact',
    name: 'Modelo 5 — Compact',
    tag: 'Alta Densidade de Itens',
    subtitle: 'Layout condensado para inventários extensos e busca rápida',
    description:
      'Estrutura em linhas densas tipo tabela com identificação instantânea de valores, pequenas miniaturas e botões ágeis. Ideal para quem possui dezenas ou centenas de referências.',
    suitableFor:
      'Supermercados, armazéns de bebidas, ferragens, distribuidores e papelarias.',
    features: [
      'Máxima quantidade de produtos visíveis no ecrã',
      'Fotografias compactas e preços instantâneos',
      'Agrupamento inteligente por categorias',
      'Ideal para compras em lista ou pedidos em volume',
    ],
    mockBusiness: {
      name: 'Mercado & Adega Express',
      tagline: 'Mercearia selecionada, vinhos de produtores e produtos frescos',
      categoryName: 'Supermercado & Adega',
      primaryColor: '#059669',
      coverUrl:
        'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80',
      logoUrl:
        'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=200&q=80',
      currency: '€',
      typographyPair: 'Poppins + DM Sans',
      fontFamily: "'Poppins', sans-serif",
      categories: ['Todos', 'Vinhos & Adega', 'Queijos & Charcutaria', 'Azeites & Conservas'],
      products: [
        {
          name: 'Vinho Tinto Douro Reserva 750ml',
          category: 'Vinhos & Adega',
          price: 12.8,
          promoPrice: 9.9,
          description: 'Garrafa com estágio de 12 meses em barricas de carvalho francês.',
          imageUrl:
            'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=600&q=80',
          badge: 'Preço Especial',
        },
        {
          name: 'Queijo de Ovelha Curado 500g',
          category: 'Queijos & Charcutaria',
          price: 7.9,
          description: 'Cura tradicional de 90 dias com pasta semi-dura e aroma rico.',
          imageUrl:
            'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&w=600&q=80',
        },
        {
          name: 'Azeite Virgem Extra DOP 500ml',
          category: 'Azeites & Conservas',
          price: 8.5,
          description: 'Primeira prensagem a frio de azeitonas galegas, acidez máxima 0.2%.',
          imageUrl:
            'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80',
        },
        {
          name: 'Café em Grão Orgânico 1kg',
          category: 'Vinhos & Adega',
          price: 16.5,
          description: 'Torra média com notas florais e baixa acidez, grão 100% arábica.',
          imageUrl:
            'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=600&q=80',
        },
      ],
    },
  },
];

export const TemplatesView: React.FC<TemplatesViewProps> = ({
  onSelectTemplateForNewCatalog,
}) => {
  // Modal preview state
  const [previewTemplate, setPreviewTemplate] = useState<TemplateMetadata | null>(null);
  const [deviceMode, setDeviceMode] = useState<'mobile' | 'desktop'>('mobile');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('Todos');

  // Handle open preview
  const handleOpenPreview = (tpl: TemplateMetadata) => {
    setPreviewTemplate(tpl);
    setActiveCategoryFilter('Todos');
  };

  return (
    <div className="space-y-8">
      {/* Top Banner / Heading */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#6D28D9]/10 text-[#6D28D9] text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#FF7A00]" />
            <span>Galeria de Modelos Profissionais</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#17152B] tracking-tight">
            Escolha o Modelo Perfeito para o Seu Catálogo
          </h2>
          <p className="text-xs sm:text-sm text-[#77758A] mt-1 max-w-2xl leading-relaxed">
            Cada modelo possui uma estrutura visual única adaptada ao perfil de negócio.
            Veja abaixo a representação visual real de cada template e teste a navegação interativa.
          </p>
        </div>
      </div>

      {/* Visual Templates Gallery Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-7">
        {TEMPLATES_DATA.map((tpl) => {
          const { mockBusiness } = tpl;

          return (
            <div
              key={tpl.id}
              className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col justify-between group"
            >
              <div>
                {/* Visual Realistic Mini Mockup Container */}
                <div className="relative bg-slate-100/90 border-b border-slate-200/80 p-4 sm:p-5 overflow-hidden">
                  {/* Mini Browser Bar */}
                  <div className="flex items-center justify-between pb-3 text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-rose-400/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
                      <span className="ml-2 text-[10px] font-mono text-slate-400 truncate">
                        catafy.app/{tpl.id}-demo
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider bg-white px-2 py-0.5 rounded-md border border-slate-200 shadow-2xs">
                      {tpl.tag}
                    </span>
                  </div>

                  {/* Render simulated layout representation */}
                  <div className="bg-white rounded-2xl shadow-xs border border-slate-200/90 overflow-hidden transition-transform duration-300 group-hover:scale-[1.01]">
                    {/* Simulated Cover & Header */}
                    <div className="relative h-24 sm:h-28 w-full overflow-hidden bg-slate-800">
                      <img
                        src={mockBusiness.coverUrl}
                        alt={mockBusiness.name}
                        className="w-full h-full object-cover opacity-85"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                      <div className="absolute bottom-2.5 left-3 right-3 flex items-end gap-2.5">
                        <img
                          src={mockBusiness.logoUrl}
                          alt="Logo"
                          className="w-10 h-10 rounded-xl border-2 border-white object-cover bg-white shadow-xs shrink-0"
                        />
                        <div className="text-white min-w-0">
                          <h4
                            className="font-bold text-xs truncate"
                            style={{ fontFamily: mockBusiness.fontFamily }}
                          >
                            {mockBusiness.name}
                          </h4>
                          <p className="text-[10px] text-white/80 truncate">
                            {mockBusiness.tagline}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Simulated Categories Tabs */}
                    <div className="px-3 py-2 bg-slate-50 border-b border-slate-100 flex items-center gap-1.5 overflow-hidden">
                      {mockBusiness.categories.slice(0, 3).map((cat, idx) => (
                        <span
                          key={cat}
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-md shrink-0 ${
                            idx === 0
                              ? 'bg-[#17152B] text-white'
                              : 'bg-white text-slate-600 border border-slate-200'
                          }`}
                        >
                          {cat}
                        </span>
                      ))}
                    </div>

                    {/* Template Specific Mini Layout */}
                    <div className="p-3 bg-white">
                      {/* 1. Classic: Clean List */}
                      {tpl.id === 'classic' && (
                        <div className="divide-y divide-slate-100 space-y-2">
                          {mockBusiness.products.slice(0, 2).map((p) => (
                            <div key={p.name} className="pt-2 flex items-center justify-between gap-2.5">
                              <img
                                src={p.imageUrl}
                                alt={p.name}
                                className="w-11 h-11 rounded-lg object-cover bg-slate-100 shrink-0"
                              />
                              <div className="flex-1 min-w-0">
                                <h5 className="font-semibold text-xs text-slate-800 truncate">
                                  {p.name}
                                </h5>
                                <p className="text-[10px] text-slate-400 line-clamp-1">
                                  {p.description}
                                </p>
                              </div>
                              <div className="text-right shrink-0">
                                <span className="text-xs font-bold text-slate-900 font-mono">
                                  {mockBusiness.currency} {p.price.toFixed(2)}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* 2. Modern: 2-Col Card Grid */}
                      {tpl.id === 'modern' && (
                        <div className="grid grid-cols-2 gap-2.5">
                          {mockBusiness.products.slice(0, 2).map((p) => (
                            <div
                              key={p.name}
                              className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-2xs flex flex-col"
                            >
                              <div className="relative aspect-4/3 w-full bg-slate-100 overflow-hidden">
                                <img
                                  src={p.imageUrl}
                                  alt={p.name}
                                  className="w-full h-full object-cover"
                                />
                                {p.badge && (
                                  <span className="absolute top-1.5 left-1.5 bg-[#FF7A00] text-white text-[9px] font-bold px-1.5 py-0.2 rounded-md">
                                    PROMO
                                  </span>
                                )}
                              </div>
                              <div className="p-2 flex-1 flex flex-col justify-between">
                                <h5 className="font-bold text-[11px] text-slate-900 truncate">
                                  {p.name}
                                </h5>
                                <span className="text-[11px] font-bold text-[#6D28D9] font-mono mt-1">
                                  {mockBusiness.currency} {p.price.toFixed(2)}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* 3. Premium: Editorial Luxury Card */}
                      {tpl.id === 'premium' && (
                        <div className="border border-stone-200/80 rounded-xl p-2.5 bg-stone-50/50 flex items-center gap-3">
                          <img
                            src={mockBusiness.products[0].imageUrl}
                            alt="Luxury"
                            className="w-14 h-14 rounded-lg object-cover shrink-0 shadow-2xs"
                          />
                          <div className="flex-1 min-w-0">
                            <span className="text-[9px] uppercase tracking-widest text-[#6D28D9] font-bold block">
                              Alta Gama
                            </span>
                            <h5
                              className="font-bold text-xs text-stone-900 truncate"
                              style={{ fontFamily: "'Playfair Display', serif" }}
                            >
                              {mockBusiness.products[0].name}
                            </h5>
                            <p className="text-[10px] text-stone-500 line-clamp-1">
                              {mockBusiness.products[0].description}
                            </p>
                            <span className="text-xs font-bold text-stone-900 font-mono mt-0.5 block">
                              {mockBusiness.currency} {mockBusiness.products[0].price.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* 4. Minimal: Pure White Scandinavian */}
                      {tpl.id === 'minimal' && (
                        <div className="grid grid-cols-2 gap-3 py-1">
                          {mockBusiness.products.slice(0, 2).map((p) => (
                            <div key={p.name} className="space-y-1.5">
                              <div className="aspect-square rounded-lg bg-slate-50 border border-slate-100 overflow-hidden">
                                <img
                                  src={p.imageUrl}
                                  alt={p.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <h5 className="font-medium text-[11px] text-slate-900 truncate">
                                {p.name}
                              </h5>
                              <span className="text-[11px] font-medium text-slate-600 block">
                                {mockBusiness.currency} {p.price.toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* 5. Compact: Condensed Density Table */}
                      {tpl.id === 'compact' && (
                        <div className="divide-y divide-slate-100 text-xs">
                          {mockBusiness.products.slice(0, 2).map((p) => (
                            <div key={p.name} className="py-1.5 flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2 min-w-0">
                                <img
                                  src={p.imageUrl}
                                  alt={p.name}
                                  className="w-7 h-7 rounded-md object-cover shrink-0"
                                />
                                <span className="font-medium text-slate-800 text-[11px] truncate">
                                  {p.name}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <span className="font-bold text-[11px] text-slate-900 font-mono">
                                  {mockBusiness.currency} {p.price.toFixed(2)}
                                </span>
                                <span className="w-5 h-5 rounded-md bg-emerald-50 text-emerald-700 font-bold flex items-center justify-center text-[10px]">
                                  +
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Hover Quick Action Overlay */}
                  <div className="absolute inset-0 bg-[#17152B]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-[2px]">
                    <button
                      type="button"
                      onClick={() => handleOpenPreview(tpl)}
                      className="py-2 px-3.5 rounded-xl bg-white text-[#17152B] text-xs font-bold shadow-lg hover:bg-slate-100 flex items-center gap-1.5 transition-all"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#6D28D9]" />
                      <span>Pré-visualizar</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onSelectTemplateForNewCatalog(tpl.id)}
                      className="py-2 px-3.5 rounded-xl bg-gradient-to-r from-[#6D28D9] to-[#9333EA] text-white text-xs font-bold shadow-lg hover:opacity-95 flex items-center gap-1.5 transition-all"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#FF7A00]" />
                      <span>Usar este modelo</span>
                    </button>
                  </div>
                </div>

                {/* Card Text & Information */}
                <div className="p-5 sm:p-6 space-y-4">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-bold text-[#17152B] text-base">
                        {tpl.name}
                      </h3>
                      <span className="text-[10px] font-semibold text-[#6D28D9] bg-[#6D28D9]/10 px-2 py-0.5 rounded-full">
                        {mockBusiness.typographyPair}
                      </span>
                    </div>
                    <p className="text-xs text-[#77758A] font-medium mt-0.5">
                      {tpl.subtitle}
                    </p>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {tpl.description}
                  </p>

                  <div className="pt-3 border-t border-slate-100 space-y-1.5">
                    <span className="text-[11px] font-bold text-slate-700 block">
                      Principais características:
                    </span>
                    <ul className="space-y-1 text-xs text-slate-600">
                      {tpl.features.map((feat, idx) => (
                        <li key={idx} className="flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-5 sm:p-6 pt-0 border-t border-slate-100 mt-4 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleOpenPreview(tpl)}
                  className="flex-1 py-2.5 px-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-[#17152B] text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  <Eye className="w-4 h-4 text-[#6D28D9]" />
                  <span>Pré-visualizar</span>
                </button>

                <button
                  type="button"
                  onClick={() => onSelectTemplateForNewCatalog(tpl.id)}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#6D28D9] to-[#9333EA] hover:from-[#5b21b6] hover:to-[#7e22ce] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#FF7A00]" />
                  <span>Usar este modelo</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* FULL PREVIEW MODAL (MOBILE VS DESKTOP) */}
      {previewTemplate && (
        <div className="fixed inset-0 z-50 bg-[#17152B]/80 backdrop-blur-sm flex flex-col p-2 sm:p-4 overflow-hidden animate-in fade-in duration-200">
          {/* Modal Header Bar */}
          <div className="bg-white rounded-2xl p-3 sm:px-6 sm:py-3.5 shadow-md flex items-center justify-between gap-3 shrink-0 mb-3 border border-slate-200">
            {/* Left: Template info */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-[#6D28D9]/10 text-[#6D28D9] flex items-center justify-center shrink-0">
                <Palette className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900 text-sm truncate">
                    {previewTemplate.name}
                  </h3>
                  <span className="hidden sm:inline-block text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full">
                    {previewTemplate.tag}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 truncate">
                  Exemplo demonstrativo: {previewTemplate.mockBusiness.name}
                </p>
              </div>
            </div>

            {/* Center: Device Toggle (Mobile vs Desktop) */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl shrink-0 border border-slate-200/80">
              <button
                type="button"
                onClick={() => setDeviceMode('mobile')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  deviceMode === 'mobile'
                    ? 'bg-white text-[#6D28D9] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Telemóvel (Mobile)</span>
              </button>

              <button
                type="button"
                onClick={() => setDeviceMode('desktop')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  deviceMode === 'desktop'
                    ? 'bg-white text-[#6D28D9] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Computador (Desktop)</span>
              </button>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => onSelectTemplateForNewCatalog(previewTemplate.id)}
                className="py-2 px-3.5 rounded-xl bg-gradient-to-r from-[#6D28D9] to-[#9333EA] hover:opacity-95 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-opacity"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#FF7A00]" />
                <span className="hidden sm:inline">Usar este modelo</span>
                <span className="sm:hidden">Usar</span>
              </button>

              <button
                type="button"
                onClick={() => setPreviewTemplate(null)}
                className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                title="Voltar à galeria"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Modal Content Frame Viewport */}
          <div className="flex-1 overflow-auto flex items-center justify-center p-2 sm:p-4">
            <div
              className={`transition-all duration-300 w-full flex flex-col bg-white overflow-hidden shadow-2xl ${
                deviceMode === 'mobile'
                  ? 'max-w-[410px] rounded-[36px] border-[10px] border-slate-900 max-h-[85vh] relative'
                  : 'max-w-4xl rounded-2xl border border-slate-200/90 max-h-[85vh]'
              }`}
            >
              {/* Smartphone Notch / Top Bar (if mobile) */}
              {deviceMode === 'mobile' && (
                <div className="bg-slate-900 py-1.5 px-6 flex items-center justify-between text-white text-[10px] select-none shrink-0">
                  <span className="font-semibold">9:41</span>
                  <div className="w-16 h-3 bg-black rounded-full" />
                  <div className="flex items-center gap-1.5">
                    <span>5G</span>
                    <div className="w-4 h-2 border border-white rounded-xs p-0.5">
                      <div className="w-full h-full bg-white" />
                    </div>
                  </div>
                </div>
              )}

              {/* Interactive Catalog Screen */}
              <div className="flex-1 overflow-y-auto bg-[#fafafa] flex flex-col">
                {/* Catalog Header Cover */}
                <div className="relative w-full h-36 sm:h-48 bg-slate-900 shrink-0 overflow-hidden">
                  <img
                    src={previewTemplate.mockBusiness.coverUrl}
                    alt={previewTemplate.mockBusiness.name}
                    className="w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

                  <div className="absolute bottom-3 left-4 right-4 flex items-end gap-3 text-white">
                    <img
                      src={previewTemplate.mockBusiness.logoUrl}
                      alt="Logo"
                      className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl border-2 border-white object-cover bg-white shadow-md shrink-0"
                    />
                    <div className="min-w-0">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-purple-300 block">
                        {previewTemplate.mockBusiness.categoryName}
                      </span>
                      <h4
                        className="font-bold text-base sm:text-lg truncate"
                        style={{ fontFamily: previewTemplate.mockBusiness.fontFamily }}
                      >
                        {previewTemplate.mockBusiness.name}
                      </h4>
                      <p className="text-xs text-white/80 line-clamp-1">
                        {previewTemplate.mockBusiness.tagline}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Categories Sticky Bar */}
                <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 py-2.5 flex items-center gap-2 overflow-x-auto no-scrollbar">
                  {previewTemplate.mockBusiness.categories.map((cat) => {
                    const isCatSelected = activeCategoryFilter === cat;
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setActiveCategoryFilter(cat)}
                        className={`px-3 py-1 text-xs font-semibold rounded-lg shrink-0 transition-colors ${
                          isCatSelected
                            ? 'bg-[#17152B] text-white shadow-2xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>

                {/* Catalog Body depending on Template */}
                <div className="p-4 sm:p-6 flex-1 space-y-6">
                  {/* Category Title */}
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                    <h3
                      className="text-base sm:text-lg font-bold text-slate-900"
                      style={{ fontFamily: previewTemplate.mockBusiness.fontFamily }}
                    >
                      {activeCategoryFilter === 'Todos' ? 'Itens em Destaque' : activeCategoryFilter}
                    </h3>
                    <span className="text-xs font-mono text-slate-400">
                      {
                        previewTemplate.mockBusiness.products.filter(
                          (p) => activeCategoryFilter === 'Todos' || p.category === activeCategoryFilter
                        ).length
                      }{' '}
                      produtos
                    </span>
                  </div>

                  {/* Filtered Products */}
                  {(() => {
                    const prods = previewTemplate.mockBusiness.products.filter(
                      (p) => activeCategoryFilter === 'Todos' || p.category === activeCategoryFilter
                    );

                    // 1. Classic: List Layout
                    if (previewTemplate.id === 'classic') {
                      return (
                        <div className="divide-y divide-slate-100 bg-white rounded-2xl border border-slate-200/80 px-4 shadow-2xs">
                          {prods.map((p) => (
                            <div key={p.name} className="py-4 flex items-center justify-between gap-3">
                              <div className="flex-1 min-w-0 pr-2">
                                <h4 className="font-semibold text-slate-900 text-sm leading-snug">
                                  {p.name}
                                </h4>
                                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                  {p.description}
                                </p>
                                <div className="mt-2 flex items-center gap-2">
                                  {p.promoPrice ? (
                                    <>
                                      <span className="text-xs line-through text-slate-400 font-mono">
                                        {previewTemplate.mockBusiness.currency} {p.price.toFixed(2)}
                                      </span>
                                      <span className="text-sm font-bold text-rose-600 font-mono">
                                        {previewTemplate.mockBusiness.currency}{' '}
                                        {p.promoPrice.toFixed(2)}
                                      </span>
                                    </>
                                  ) : (
                                    <span className="text-sm font-bold text-slate-900 font-mono">
                                      {previewTemplate.mockBusiness.currency} {p.price.toFixed(2)}
                                    </span>
                                  )}
                                </div>
                              </div>

                              <img
                                src={p.imageUrl}
                                alt={p.name}
                                className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover bg-slate-100 shrink-0 shadow-2xs"
                              />

                              <div className="flex flex-col gap-1.5 shrink-0">
                                <button
                                  type="button"
                                  className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-xs"
                                  title="Pedir no WhatsApp"
                                >
                                  <MessageCircle className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    }

                    // 2. Modern: Grid Layout
                    if (previewTemplate.id === 'modern') {
                      return (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {prods.map((p) => (
                            <div
                              key={p.name}
                              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs flex flex-col justify-between"
                            >
                              <div className="relative aspect-4/3 w-full bg-slate-100 overflow-hidden">
                                <img
                                  src={p.imageUrl}
                                  alt={p.name}
                                  className="w-full h-full object-cover"
                                />
                                {p.badge && (
                                  <span className="absolute top-2.5 left-2.5 bg-[#FF7A00] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                                    {p.badge}
                                  </span>
                                )}
                                <div className="absolute bottom-2.5 right-2.5 bg-white/95 backdrop-blur-xs px-2 py-0.5 rounded-lg shadow-xs text-xs font-bold text-slate-900 font-mono">
                                  {previewTemplate.mockBusiness.currency} {p.price.toFixed(2)}
                                </div>
                              </div>

                              <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                                <div>
                                  <h4 className="font-bold text-slate-900 text-sm leading-snug">
                                    {p.name}
                                  </h4>
                                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                                    {p.description}
                                  </p>
                                </div>
                                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                                  <span className="text-xs font-bold text-[#6D28D9]">
                                    Disponível
                                  </span>
                                  <button
                                    type="button"
                                    className="px-3 py-1.5 rounded-lg bg-[#6D28D9] text-white text-xs font-bold flex items-center gap-1 shadow-xs"
                                  >
                                    <MessageCircle className="w-3.5 h-3.5" />
                                    <span>Pedir</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    }

                    // 3. Premium: Luxury Editorial Cards
                    if (previewTemplate.id === 'premium') {
                      return (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          {prods.map((p) => (
                            <div
                              key={p.name}
                              className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs space-y-3"
                            >
                              <div className="aspect-4/3 w-full rounded-xl overflow-hidden bg-stone-100">
                                <img
                                  src={p.imageUrl}
                                  alt={p.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div>
                                <span className="text-[10px] uppercase font-bold tracking-widest text-[#6D28D9]">
                                  {p.category}
                                </span>
                                <h4
                                  className="font-bold text-base text-stone-900 mt-0.5"
                                  style={{ fontFamily: "'Playfair Display', serif" }}
                                >
                                  {p.name}
                                </h4>
                                <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                                  {p.description}
                                </p>
                                <div className="mt-3 flex items-center justify-between">
                                  <span className="font-bold text-stone-900 text-base font-mono">
                                    {previewTemplate.mockBusiness.currency} {p.price.toFixed(2)}
                                  </span>
                                  <button
                                    type="button"
                                    className="py-1.5 px-3 rounded-lg bg-stone-900 text-white text-xs font-semibold flex items-center gap-1.5"
                                  >
                                    <MessageCircle className="w-3.5 h-3.5" />
                                    <span>Consultar</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    }

                    // 4. Minimal: Pure Minimalist Cards
                    if (previewTemplate.id === 'minimal') {
                      return (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                          {prods.map((p) => (
                            <div key={p.name} className="space-y-2">
                              <div className="aspect-square rounded-xl bg-slate-50 border border-slate-100 overflow-hidden">
                                <img
                                  src={p.imageUrl}
                                  alt={p.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div>
                                <h4 className="font-medium text-xs text-slate-900 truncate">
                                  {p.name}
                                </h4>
                                <span className="text-xs font-semibold text-slate-700 block mt-0.5">
                                  {previewTemplate.mockBusiness.currency} {p.price.toFixed(2)}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    }

                    // 5. Compact: Dense List Table
                    return (
                      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs divide-y divide-slate-100">
                        {prods.map((p) => (
                          <div
                            key={p.name}
                            className="p-3 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <img
                                src={p.imageUrl}
                                alt={p.name}
                                className="w-10 h-10 rounded-lg object-cover shrink-0 bg-slate-100"
                              />
                              <div className="min-w-0">
                                <h4 className="font-semibold text-slate-900 text-xs truncate">
                                  {p.name}
                                </h4>
                                <p className="text-[11px] text-slate-400 truncate max-w-sm">
                                  {p.description}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 shrink-0">
                              <span className="font-bold text-xs text-slate-900 font-mono">
                                {previewTemplate.mockBusiness.currency} {p.price.toFixed(2)}
                              </span>
                              <button
                                type="button"
                                className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 font-bold flex items-center justify-center text-xs hover:bg-emerald-100 transition-colors"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>

                {/* Footer Inside Preview */}
                <div className="mt-auto border-t border-slate-200/80 bg-white p-3 text-center text-xs text-slate-400">
                  <span>Catálogo criado e gerado com a plataforma </span>
                  <span className="font-bold text-[#6D28D9]">Catafy</span>
                </div>
              </div>
            </div>
          </div>

          {/* Modal Bottom Bar */}
          <div className="bg-white rounded-2xl p-3 sm:px-6 shadow-md flex items-center justify-between gap-3 shrink-0 mt-3 border border-slate-200">
            <button
              type="button"
              onClick={() => setPreviewTemplate(null)}
              className="py-2 px-4 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors"
            >
              Voltar à Galeria
            </button>

            <button
              type="button"
              onClick={() => onSelectTemplateForNewCatalog(previewTemplate.id)}
              className="py-2 px-6 rounded-xl bg-gradient-to-r from-[#6D28D9] to-[#9333EA] hover:from-[#5b21b6] hover:to-[#7e22ce] text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-all"
            >
              <Sparkles className="w-4 h-4 text-[#FF7A00]" />
              <span>Usar este modelo ({previewTemplate.name})</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
