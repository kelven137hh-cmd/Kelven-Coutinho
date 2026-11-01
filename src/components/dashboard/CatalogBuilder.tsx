import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Store,
  Palette,
  Package,
  Layers,
  Sparkles,
  ExternalLink,
  Copy,
  MessageCircle,
  Plus,
  Trash2,
  Smartphone,
  Monitor,
  Eye,
} from 'lucide-react';
import { Business, Catalog, Category, Product, CatalogTemplate, CatalogTypography } from '../../types';
import { api } from '../../lib/api';
import { TYPOGRAPHY_PRESETS_LIST, getTypographyConfig } from '../../lib/typography';
import { ImageUploader } from '../common/ImageUploader';

interface CatalogBuilderProps {
  initialCatalog?: Catalog | null;
  initialBusinessId?: string | null;
  businesses: Business[];
  onFinish: () => void;
  onCancel: () => void;
  onOpenPublicCatalog: (slug: string) => void;
}

export const CatalogBuilder: React.FC<CatalogBuilderProps> = ({
  initialCatalog,
  initialBusinessId,
  businesses,
  onFinish,
  onCancel,
  onOpenPublicCatalog,
}) => {
  const [step, setStep] = useState<number>(1);
  const [saving, setSaving] = useState(false);
  const [publishedCatalog, setPublishedCatalog] = useState<Catalog | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Step 1: Business & Identity
  const [selectedBusinessId, setSelectedBusinessId] = useState<string>(
    initialCatalog?.business_id || initialBusinessId || (businesses[0]?.id ?? '')
  );
  const [title, setTitle] = useState(initialCatalog?.title || '');
  const [slug, setSlug] = useState(initialCatalog?.slug || '');
  const [description, setDescription] = useState(initialCatalog?.description || '');

  // Step 2: Template
  const [template, setTemplate] = useState<CatalogTemplate>(
    initialCatalog?.template || 'modern'
  );

  // Step 3: Customization
  const [primaryColor, setPrimaryColor] = useState(
    initialCatalog?.primary_color || '#0f172a'
  );
  const [secondaryColor, setSecondaryColor] = useState(
    initialCatalog?.secondary_color || '#475569'
  );
  const [fontFamily, setFontFamily] = useState(
    initialCatalog?.font_family || 'Plus Jakarta Sans'
  );
  const [typography, setTypography] = useState<CatalogTypography>(
    (initialCatalog?.typography as CatalogTypography) || 'moderna'
  );
  const [currency, setCurrency] = useState(initialCatalog?.currency || '€');
  const [logoUrl, setLogoUrl] = useState(initialCatalog?.logo_url || '');
  const [coverUrl, setCoverUrl] = useState(initialCatalog?.cover_url || '');
  const [welcomeMessage, setWelcomeMessage] = useState(
    initialCatalog?.welcome_message || 'Seja bem-vindo ao nosso catálogo! Peça pelo WhatsApp.'
  );

  // Step 4: Products
  const [businessProducts, setBusinessProducts] = useState<Product[]>([]);
  const [businessCategories, setBusinessCategories] = useState<Category[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  // Inline Quick Add Product
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdCategoryId, setNewProdCategoryId] = useState('');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdImg, setNewProdImg] = useState('');
  const [newProdIngredients, setNewProdIngredients] = useState('');
  const [newProdDuration, setNewProdDuration] = useState('');

  // Selected business object
  const currentBusiness = businesses.find((b) => b.id === selectedBusinessId);

  // Auto-fill defaults when business selected
  useEffect(() => {
    if (currentBusiness) {
      if (!title && !initialCatalog) {
        setTitle(`Catálogo ${currentBusiness.name}`);
      }
      if (!logoUrl && currentBusiness.logo_url) {
        setLogoUrl(currentBusiness.logo_url);
      }
      if (!coverUrl && currentBusiness.cover_url) {
        setCoverUrl(currentBusiness.cover_url);
      }
    }
  }, [currentBusiness]);

  // Load products & categories for selected business
  useEffect(() => {
    if (selectedBusinessId) {
      setLoadingProducts(true);
      Promise.all([
        api.getProducts(selectedBusinessId),
        api.getCategories(selectedBusinessId),
      ])
        .then(([pRes, cRes]) => {
          setBusinessProducts(pRes.products);
          setBusinessCategories(cRes.categories);
          if (cRes.categories.length > 0 && !newProdCategoryId) {
            setNewProdCategoryId(cRes.categories[0].id);
          }
        })
        .finally(() => setLoadingProducts(false));
    }
  }, [selectedBusinessId]);

  // Handle Quick Add Product
  const handleQuickAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim() || !newProdPrice) return;

    try {
      const res = await api.createProduct({
        business_id: selectedBusinessId,
        category_id: newProdCategoryId || (businessCategories[0]?.id ?? ''),
        name: newProdName.trim(),
        price: parseFloat(newProdPrice) || 0,
        description: newProdDesc.trim(),
        image_url: newProdImg.trim(),
        is_available: true,
        segment_data: {
          ingredients: newProdIngredients.trim() || undefined,
          service_duration: newProdDuration.trim() || undefined,
        },
      });

      setBusinessProducts((prev) => [...prev, res.product]);
      setNewProdName('');
      setNewProdPrice('');
      setNewProdDesc('');
      setNewProdImg('');
      setNewProdIngredients('');
      setNewProdDuration('');
      setShowAddProduct(false);
    } catch (err: any) {
      alert(err.message || 'Erro ao adicionar produto.');
    }
  };

  // Step 5: Save or Publish
  const handleSave = async (publish: boolean) => {
    if (!title.trim() || !selectedBusinessId) {
      alert('Por favor informe o título e selecione uma empresa.');
      return;
    }

    setSaving(true);
    try {
      let savedCat: Catalog;
      const payload: Partial<Catalog> = {
        business_id: selectedBusinessId,
        title: title.trim(),
        slug: slug.trim() || undefined,
        description: description.trim(),
        template,
        typography,
        primary_color: primaryColor,
        secondary_color: secondaryColor,
        font_family: typography,
        currency,
        logo_url: logoUrl.trim(),
        cover_url: coverUrl.trim(),
        welcome_message: welcomeMessage.trim(),
        is_active: publish,
      };

      if (initialCatalog) {
        const res = await api.updateCatalog(initialCatalog.id, payload);
        savedCat = res.catalog;
      } else {
        const res = await api.createCatalog(payload);
        savedCat = res.catalog;
      }

      setPublishedCatalog(savedCat);

      if (publish) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      }

      setStep(5);
    } catch (err: any) {
      alert(err.message || 'Erro ao guardar catálogo.');
    } finally {
      setSaving(false);
    }
  };

  // Step 2 Templates config
  const templateOptions = [
    {
      id: 'modern',
      title: 'Menu / Catálogo Moderno',
      desc: 'Grelha contemporânea de produtos com fotografias expressivas e categorias fluidas.',
      badge: 'Mais Popular',
      forSegments: 'Restaurantes, Pizzarias, Lojas de Roupas',
    },
    {
      id: 'classic',
      title: 'Menu Clássico',
      desc: 'Layout simples com produtos em lista, fotografias compactas e preços bem alinhados.',
      badge: 'Tradicional',
      forSegments: 'Barbearias, Cafés, Restaurantes Tradicionais',
    },
    {
      id: 'premium',
      title: 'Catálogo Premium Editorial',
      desc: 'Fotografias com destaque refinado, tipografia sofisticada e apresentação de luxo.',
      badge: 'Exclusivo',
      forSegments: 'Boutiques, Salões de Beleza, Alta Gastronomia',
    },
    {
      id: 'minimal',
      title: 'Design Minimalista',
      desc: 'Foco total no produto e na tipografia, fundo clean e estética leve.',
      badge: 'Clean',
      forSegments: 'Acessórios, Roupas, Estúdios de Design',
    },
    {
      id: 'compact',
      title: 'Lista Compacta (Alta Densidade)',
      desc: 'Layout condensado perfeito para empresas com muitos itens no cardápio ou inventário.',
      badge: 'Alta Densidade',
      forSegments: 'Supermercados, Mercearias, Lojas de Peças',
    },
  ];

  const colorPresets = [
    { name: 'Dark Slate', primary: '#0f172a', secondary: '#475569' },
    { name: 'Carmim & Brasa', primary: '#dc2626', secondary: '#991b1b' },
    { name: 'Verde Botânico', primary: '#16a34a', secondary: '#166534' },
    { name: 'Azul Real', primary: '#2563eb', secondary: '#1e40af' },
    { name: 'Âmbar & Couro', primary: '#d97706', secondary: '#b45309' },
    { name: 'Rosa Chic', primary: '#db2777', secondary: '#9d174d' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
            title="Voltar ao painel"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {initialCatalog ? 'Editar Catálogo' : 'Criador de Catálogos Digitais'}
            </h1>
            <p className="text-xs text-slate-500">
              Passo {step} de 5 — {step === 1 && 'Escolha a Empresa'}
              {step === 2 && 'Escolha o Modelo'}
              {step === 3 && 'Personalização Visual'}
              {step === 4 && 'Produtos & Cardápio'}
              {step === 5 && 'Publicação & Partilha'}
            </p>
          </div>
        </div>

        {step < 5 && (
          <button
            onClick={onCancel}
            className="text-xs text-slate-400 hover:text-slate-700 font-medium"
          >
            Sair do Criador
          </button>
        )}
      </div>

      {/* Stepper Tabs */}
      <div className="flex items-center justify-between p-1 bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-x-auto no-scrollbar">
        {[
          { num: 1, label: '1. Negócio' },
          { num: 2, label: '2. Modelo' },
          { num: 3, label: '3. Estilo' },
          { num: 4, label: '4. Produtos' },
          { num: 5, label: '5. Publicar' },
        ].map((s) => {
          const isActive = step === s.num;
          const isDone = step > s.num;
          return (
            <button
              key={s.num}
              onClick={() => s.num < step && setStep(s.num)}
              className={`flex-1 py-2 px-3 text-xs font-semibold rounded-xl whitespace-nowrap transition-colors flex items-center justify-center gap-1.5 ${
                isActive
                  ? 'bg-[#6D28D9] text-white shadow-xs'
                  : isDone
                  ? 'text-[#6D28D9] hover:bg-violet-50 font-bold'
                  : 'text-slate-400'
              }`}
            >
              {isDone && <Check className="w-3.5 h-3.5" />}
              <span>{s.label}</span>
            </button>
          );
        })}
      </div>

      {/* STEP 1: BUSINESS & TITLE */}
      {step === 1 && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 space-y-6 shadow-2xs">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Etapa 1 — Selecione o Negócio</h2>
            <p className="text-xs text-slate-500 mt-1">
              Escolha a empresa para a qual este catálogo será criado e defina um título marcante.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                Empresa Vinculada *
              </label>
              <select
                value={selectedBusinessId}
                onChange={(e) => setSelectedBusinessId(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:border-slate-900 focus:outline-hidden"
              >
                {businesses.map((biz) => (
                  <option key={biz.id} value={biz.id}>
                    {biz.name} ({biz.category})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                Título do Catálogo *
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Cardápio de Pizzas Artesanais, Coleção Outono/Inverno..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:border-slate-900 focus:outline-hidden"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                Link Exclusivo (Slug)
              </label>
              <div className="flex items-center">
                <span className="px-3.5 py-2.5 bg-slate-100 border border-r-0 border-slate-200 rounded-l-xl text-xs text-slate-500 font-mono">
                  /loja/
                </span>
                <input
                  type="text"
                  placeholder="ex: forno-e-brasa"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-r-xl focus:border-slate-900 focus:outline-hidden font-mono"
                />
              </div>
              <p className="text-[11px] text-slate-400">
                Se deixar em branco, geraremos automaticamente a partir do título.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                Descrição do Catálogo
              </label>
              <textarea
                rows={2}
                placeholder="Ex: Todas as nossas pizzas são fermentadas por 48h. Selecione seus sabores favoritos..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:border-slate-900 focus:outline-hidden resize-none"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              onClick={() => {
                if (!title.trim()) {
                  alert('Por favor informe o título do catálogo.');
                  return;
                }
                setStep(2);
              }}
              className="py-2.5 px-6 bg-[#6D28D9] hover:bg-[#5b21b6] text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-colors"
            >
              <span>Avançar para Modelos</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: TEMPLATE SELECTION */}
      {step === 2 && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 space-y-6 shadow-2xs">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Etapa 2 — Escolha o Modelo Visual</h2>
            <p className="text-xs text-slate-500 mt-1">
              Inspirado nas melhores referências de design, cada modelo adapta a apresentação dos seus produtos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {templateOptions.map((opt) => {
              const isSelected = template === opt.id;
              return (
                <div
                  key={opt.id}
                  onClick={() => setTemplate(opt.id as CatalogTemplate)}
                  className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'border-slate-900 bg-slate-50/50 shadow-xs ring-2 ring-slate-900/10'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                        {opt.badge}
                      </span>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                    <h3 className="font-bold text-slate-900 text-base">{opt.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{opt.desc}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400">
                    <span className="font-semibold text-slate-600">Ideal para: </span>
                    {opt.forSegments}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setStep(1)}
              className="py-2.5 px-4 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Voltar
            </button>
            <button
              onClick={() => setStep(3)}
              className="py-2.5 px-6 bg-[#6D28D9] hover:bg-[#5b21b6] text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-colors"
            >
              <span>Avançar para Estilo</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: CUSTOMIZATION */}
      {step === 3 && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 space-y-6 shadow-2xs">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Etapa 3 — Personalização Visual</h2>
            <p className="text-xs text-slate-500 mt-1">
              Personalize cores, tipografia, capa e mensagem de boas-vindas para criar uma identidade exclusiva.
            </p>
          </div>

          <div className="space-y-6">
            {/* Color Presets */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">
                Paleta de Cores de Destaque
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {colorPresets.map((preset, idx) => {
                  const isSelected = primaryColor === preset.primary;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setPrimaryColor(preset.primary);
                        setSecondaryColor(preset.secondary);
                      }}
                      className={`p-3 rounded-xl border flex items-center gap-2.5 text-left transition-all ${
                        isSelected
                          ? 'border-slate-900 bg-slate-50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div
                        className="w-5 h-5 rounded-full shrink-0 shadow-2xs"
                        style={{ backgroundColor: preset.primary }}
                      />
                      <span className="text-xs font-medium text-slate-800 truncate">
                        {preset.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Hex Inputs & Currency */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Cor Principal (HEX)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-10 h-10 rounded-lg cursor-pointer border border-slate-200 p-0.5"
                  />
                  <input
                    type="text"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-mono bg-white border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Símbolo da Moeda</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs bg-white border border-slate-200 rounded-lg font-mono"
                >
                  <option value="€">Euro (€)</option>
                  <option value="R$">Real (R$)</option>
                  <option value="$">Dólar ($)</option>
                  <option value="£">Libra (£)</option>
                  <option value="MT">Metical (MT)</option>
                  <option value="AOA">Kwanza (AOA)</option>
                </select>
              </div>
            </div>

            {/* Visual Typography Selector with Live Previews */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-xs font-bold text-slate-800 block">
                    Tipografia do Catálogo
                  </label>
                  <p className="text-[11px] text-slate-500">
                    Selecione uma combinação tipográfica otimizada para o segmento do seu negócio.
                  </p>
                </div>
                <span className="text-[10px] font-bold text-[#6D28D9] bg-[#6D28D9]/10 px-2 py-0.5 rounded-full">
                  5 Combinações Disponíveis
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {TYPOGRAPHY_PRESETS_LIST.map((preset) => {
                  const isSelected = typography === preset.id;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => {
                        setTypography(preset.id);
                        setFontFamily(preset.titleFont);
                      }}
                      className={`text-left rounded-xl p-3.5 border-2 transition-all flex flex-col justify-between relative overflow-hidden ${
                        isSelected
                          ? 'border-[#6D28D9] bg-purple-50/40 shadow-xs ring-2 ring-[#6D28D9]/20'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-2xs'
                      }`}
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-slate-900">
                            {preset.name}
                          </span>
                          <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                            {preset.badge}
                          </span>
                        </div>

                        {/* Live typography visual sample box */}
                        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-1">
                          <div
                            className="text-xs font-bold text-slate-900 truncate"
                            style={{ fontFamily: preset.titleFamily }}
                          >
                            {preset.sampleHeading}
                          </div>
                          <p
                            className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed"
                            style={{ fontFamily: preset.bodyFamily }}
                          >
                            {preset.sampleBody}
                          </p>
                          <div
                            className="text-xs font-bold text-[#6D28D9] pt-1"
                            style={{ fontFamily: preset.priceFamily }}
                          >
                            {currency} 14.90
                          </div>
                        </div>

                        <p className="text-[10px] text-slate-500 leading-normal">
                          {preset.description}
                        </p>
                      </div>

                      <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">
                          {isSelected ? 'Selecionada' : 'Clique para usar'}
                        </span>
                        <div
                          className={`w-4 h-4 rounded-full flex items-center justify-center transition-colors ${
                            isSelected
                              ? 'bg-[#6D28D9] text-white'
                              : 'border border-slate-300'
                          }`}
                        >
                          {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Logo & Cover Image Uploaders */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <ImageUploader
                label="Imagem de Capa do Catálogo"
                value={coverUrl}
                onChange={setCoverUrl}
                aspectRatio="banner"
                placeholder="Carregar imagem de capa (recomendado 1200x400)"
              />

              <ImageUploader
                label="Logotipo do Catálogo"
                value={logoUrl}
                onChange={setLogoUrl}
                aspectRatio="square"
                placeholder="Carregar logotipo exclusivo do catálogo"
              />
            </div>

            {/* Welcome banner text */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                Mensagem de Boas-Vindas aos Visitantes
              </label>
              <input
                type="text"
                placeholder="Ex: Bem-vindo! Selecione seus itens e conclua o pedido pelo WhatsApp."
                value={welcomeMessage}
                onChange={(e) => setWelcomeMessage(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setStep(2)}
              className="py-2.5 px-4 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Voltar
            </button>
            <button
              onClick={() => setStep(4)}
              className="py-2.5 px-6 bg-[#6D28D9] hover:bg-[#5b21b6] text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-colors"
            >
              <span>Avançar para Produtos</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: PRODUCTS IN CATALOG */}
      {step === 4 && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 space-y-6 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Etapa 4 — Produtos e Serviços</h2>
              <p className="text-xs text-slate-500 mt-1">
                Revise os itens cadastrados para esta empresa ou adicione novos produtos de forma rápida.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowAddProduct(!showAddProduct)}
              className="py-2 px-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1.5 self-start sm:self-auto transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>+ Adicionar Produto Rápido</span>
            </button>
          </div>

          {/* Quick Add Product Inline Drawer/Form */}
          {showAddProduct && (
            <form
              onSubmit={handleQuickAddProduct}
              className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="text-xs font-bold text-slate-800">
                  Cadastrar Produto para {currentBusiness?.name}
                </span>
                <button
                  type="button"
                  onClick={() => setShowAddProduct(false)}
                  className="text-xs text-slate-400 hover:text-slate-600"
                >
                  Fechar
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 block">Nome do Item *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Pizza Margherita, Corte Clássico, Camisa Linho..."
                    value={newProdName}
                    onChange={(e) => setNewProdName(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 block">Preço ({currency}) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="15.00"
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 block">Categoria</label>
                  <select
                    value={newProdCategoryId}
                    onChange={(e) => setNewProdCategoryId(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl"
                  >
                    {businessCategories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <ImageUploader
                    label="Fotografia do Produto"
                    value={newProdImg}
                    onChange={setNewProdImg}
                    aspectRatio="square"
                    placeholder="Carregar foto do produto"
                  />
                </div>
              </div>

              {/* Segment-specific quick field */}
              {currentBusiness?.category === 'restaurant' || currentBusiness?.category === 'pizzeria' ? (
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 block">
                    Ingredientes Principais
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Molho de tomate, mozzarella de búfala, manjericão..."
                    value={newProdIngredients}
                    onChange={(e) => setNewProdIngredients(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl"
                  />
                </div>
              ) : currentBusiness?.category === 'barbershop' ? (
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 block">
                    Duração do Serviço
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: 45 minutos"
                    value={newProdDuration}
                    onChange={(e) => setNewProdDuration(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl"
                  />
                </div>
              ) : null}

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 block">Descrição</label>
                <textarea
                  rows={2}
                  placeholder="Detalhes sobre o produto ou serviço..."
                  value={newProdDesc}
                  onChange={(e) => setNewProdDesc(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddProduct(false)}
                  className="py-1.5 px-3 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="py-1.5 px-4 rounded-lg bg-slate-900 text-white text-xs font-bold shadow-xs hover:bg-slate-800"
                >
                  Salvar Produto
                </button>
              </div>
            </form>
          )}

          {/* Current Products Listing */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-700 block">
              Produtos cadastrados nesta empresa ({businessProducts.length})
            </span>

            {loadingProducts ? (
              <div className="p-8 text-center text-xs text-slate-400">A carregar produtos...</div>
            ) : businessProducts.length === 0 ? (
              <div className="p-8 bg-slate-50 rounded-xl text-center border border-dashed border-slate-200 space-y-2">
                <Package className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs font-medium text-slate-600">
                  Nenhum produto cadastrado para esta empresa ainda.
                </p>
                <p className="text-[11px] text-slate-400">
                  Use o botão "+ Adicionar Produto Rápido" acima para incluir seus primeiros itens.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden max-h-80 overflow-y-auto">
                {businessProducts.map((p) => (
                  <div key={p.id} className="p-3 bg-white flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3 min-w-0">
                      {p.image_url ? (
                        <img
                          src={p.image_url}
                          alt={p.name}
                          className="w-10 h-10 rounded-lg object-cover bg-slate-100 shrink-0"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                          •
                        </div>
                      )}
                      <div className="min-w-0">
                        <span className="font-bold text-slate-900 block truncate">{p.name}</span>
                        <span className="text-[11px] text-slate-400 truncate block">
                          {p.description || 'Sem descrição'}
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-mono font-bold text-slate-900 tabular-nums">
                        {currency} {p.price.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setStep(3)}
              className="py-2.5 px-4 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Voltar
            </button>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={saving}
                onClick={() => handleSave(false)}
                className="py-2.5 px-4 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                {saving ? 'A guardar...' : 'Guardar Rascunho'}
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={() => handleSave(true)}
                className="py-2.5 px-6 btn-catafy-gradient text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-opacity hover:opacity-95"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>{saving ? 'A publicar...' : 'Publicar Catálogo'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 5: PUBLICATION & CONFIRMATION */}
      {step === 5 && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-10 space-y-8 shadow-sm text-center">
          <div className="max-w-md mx-auto space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
              <Check className="w-8 h-8 stroke-[2.5]" />
            </div>

            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Catálogo Publicado com Sucesso!
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              O catálogo <strong className="text-slate-800">{publishedCatalog?.title}</strong> já está online e pronto para receber pedidos diretamente no WhatsApp.
            </p>
          </div>

          {/* Exclusive Public Link Card */}
          {publishedCatalog && (
            <div className="max-w-lg mx-auto bg-slate-50 p-5 rounded-2xl border border-slate-200 text-left space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                Link Exclusivo do seu Catálogo:
              </span>

              <div className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-slate-200">
                <span className="font-mono text-xs text-slate-800 truncate flex-1 select-all">
                  {window.location.origin}/loja/{publishedCatalog.slug}
                </span>

                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(
                      `${window.location.origin}/loja/${publishedCatalog.slug}`
                    );
                    setCopiedLink(true);
                    setTimeout(() => setCopiedLink(false), 2000);
                  }}
                  className="py-1.5 px-3 rounded-lg bg-slate-900 text-white text-xs font-semibold flex items-center gap-1.5 shrink-0 hover:bg-slate-800 transition-colors"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar Link</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
                <button
                  onClick={() => onOpenPublicCatalog(publishedCatalog.slug)}
                  className="flex-1 py-2.5 px-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-xs font-bold text-slate-800 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Eye className="w-4 h-4 text-slate-500" />
                  <span>Visualizar Catálogo Público</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 ml-auto" />
                </button>

                <a
                  href={`https://wa.me/?text=${encodeURIComponent(
                    `Confira nosso catálogo online e faça seu pedido direto pelo WhatsApp: ${window.location.origin}/loja/${publishedCatalog.slug}`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Partilhar no WhatsApp</span>
                </a>
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-slate-100 flex justify-center">
            <button
              onClick={onFinish}
              className="py-2.5 px-6 rounded-xl btn-catafy-gradient text-white text-xs font-bold hover:opacity-95 transition-opacity"
            >
              Concluir e Voltar ao Painel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
