import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  ShoppingBag,
  Share2,
  Phone,
  MapPin,
  Instagram,
  Check,
  ChevronRight,
  MessageCircle,
} from 'lucide-react';
import { Product, PublicCatalogPayload, CartItem } from '../../types';
import { api } from '../../lib/api';
import { getTypographyConfig } from '../../lib/typography';
import { ProductModal } from './ProductModal';
import { CartDrawer } from './CartDrawer';
import { ClassicTemplate } from './templates/ClassicTemplate';
import { ModernTemplate } from './templates/ModernTemplate';
import { PremiumTemplate } from './templates/PremiumTemplate';
import { MinimalTemplate } from './templates/MinimalTemplate';
import { CompactTemplate } from './templates/CompactTemplate';

interface PublicCatalogProps {
  slug: string;
  onGoHome?: () => void;
}

export const PublicCatalog: React.FC<PublicCatalogProps> = ({ slug, onGoHome }) => {
  const [data, setData] = useState<PublicCatalogPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [modalProduct, setModalProduct] = useState<Product | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Load catalog data
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    api
      .getPublicCatalog(slug)
      .then((res) => {
        if (!isMounted) return;
        setData(res);
        // Track view
        api.trackPublicView(res.catalog.id);
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err.message || 'Catálogo não encontrado ou desativado.');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [slug]);

  // Filter products by search
  const filteredProducts = useMemo(() => {
    if (!data) return [];
    if (!searchQuery.trim()) return data.products;
    const q = searchQuery.toLowerCase().trim();
    return data.products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q)) ||
        (p.segment_data?.ingredients && p.segment_data.ingredients.toLowerCase().includes(q))
    );
  }, [data, searchQuery]);

  // Cart actions
  const handleAddToCart = (item: {
    product: Product;
    quantity: number;
    selectedSize?: { name: string; price: number };
    selectedColor?: string;
    selectedClothingSize?: string;
    notes?: string;
  }) => {
    setCartItems((prev) => {
      // Check if duplicate with exact same variants
      const existingIdx = prev.findIndex(
        (i) =>
          i.product.id === item.product.id &&
          i.selectedSize?.name === item.selectedSize?.name &&
          i.selectedColor === item.selectedColor &&
          i.selectedClothingSize === item.selectedClothingSize &&
          i.notes === item.notes
      );

      if (existingIdx >= 0) {
        const next = [...prev];
        next[existingIdx].quantity += item.quantity;
        return next;
      }
      return [...prev, item];
    });
  };

  const handleUpdateCartQuantity = (index: number, newQty: number) => {
    if (newQty <= 0) {
      setCartItems((prev) => prev.filter((_, idx) => idx !== index));
    } else {
      setCartItems((prev) =>
        prev.map((item, idx) => (idx === index ? { ...item, quantity: newQty } : item))
      );
    }
  };

  const handleRemoveCartItem = (index: number) => {
    setCartItems((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleDirectOrder = (product: Product, quantity = 1, details = '') => {
    if (!data) return;
    const rawPhone = (data.catalog.business?.whatsapp || data.business.whatsapp || '').replace(
      /[^\d+]/g,
      ''
    );
    if (!rawPhone) {
      alert('Número de WhatsApp não configurado para esta empresa.');
      return;
    }

    const price = product.promo_price ?? product.price;
    const total = (price * quantity).toFixed(2);
    const message =
      `Olá! Tenho interesse no seguinte item do catálogo *${data.catalog.title}*:\n\n` +
      `• *${quantity}x ${product.name}*${details}\n` +
      `• Valor: *${data.catalog.currency} ${total}*\n\n` +
      `Gostaria de saber mais informações e confirmar o pedido!`;

    api.trackWhatsAppClick(data.catalog.id, product.id, product.name, message);

    const cleanPhone = rawPhone.replace('+', '');
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${cleanPhone}?text=${encoded}`, '_blank');
  };

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="w-10 h-10 border-3 border-slate-300 border-t-slate-900 rounded-full animate-spin mb-4" />
        <p className="text-sm font-medium text-slate-600">A carregar catálogo...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 mb-4">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Catálogo Indisponível</h2>
        <p className="text-sm text-slate-500 mt-2 max-w-md">
          {error || 'O catálogo que procura não foi encontrado ou não está ativo no momento.'}
        </p>
        {onGoHome && (
          <button
            onClick={onGoHome}
            className="mt-6 px-5 py-2.5 btn-catafy-gradient text-white rounded-xl text-sm font-semibold hover:opacity-95 transition-opacity"
          >
            Voltar ao Catafy
          </button>
        )}
      </div>
    );
  }

  const { catalog, business, categories } = data;
  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalCartValue = cartItems
    .reduce((acc, item) => {
      const p = item.selectedSize ? item.selectedSize.price : item.product.promo_price ?? item.product.price;
      return acc + p * item.quantity;
    }, 0)
    .toFixed(2);

  const typo = getTypographyConfig(catalog.typography);

  return (
    <div
      className="min-h-screen bg-[#fafafa] text-slate-900 pb-28"
      style={{
        fontFamily: typo.bodyFamily,
      }}
    >
      {/* Draft Mode Notice (if inactive) */}
      {!catalog.is_active && (
        <div className="bg-amber-500 text-white text-xs py-2 px-4 text-center font-medium shadow-xs">
          ⚠️ Este catálogo está atualmente em modo de <strong>Rascunho</strong>. Para receber pedidos públicos oficiais, ative-o no painel Catafy.
        </div>
      )}

      {/* Cover Banner */}
      <div className="relative w-full h-44 sm:h-64 bg-slate-900 overflow-hidden">
        {catalog.cover_url ? (
          <img
            src={catalog.cover_url}
            alt={business.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-85"
          />
        ) : (
          <div
            className="w-full h-full opacity-90"
            style={{ backgroundColor: catalog.primary_color || '#0f172a' }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />

        {/* Top actions */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          {onGoHome && (
            <button
              onClick={onGoHome}
              className="px-3 py-1.5 rounded-lg bg-black/40 backdrop-blur-md text-white text-xs font-medium hover:bg-black/60 transition-colors flex items-center gap-1"
            >
              <span>← Início</span>
            </button>
          )}

          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={handleShare}
              className="px-3 py-1.5 rounded-lg bg-black/40 backdrop-blur-md text-white text-xs font-medium hover:bg-black/60 transition-colors flex items-center gap-1.5 shadow-xs"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Link Copiado!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Partilhar</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Business Header Card */}
      <div className="max-w-4xl mx-auto px-4 -mt-14 sm:-mt-16 relative z-10">
        <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200/80">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
            {/* Logo */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-white border-2 border-white shadow-md shrink-0 flex items-center justify-center">
              {catalog.logo_url || business.logo_url ? (
                <img
                  src={catalog.logo_url || business.logo_url}
                  alt={business.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center text-white font-bold text-2xl"
                  style={{ backgroundColor: catalog.primary_color || '#0f172a' }}
                >
                  {business.name.charAt(0)}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-baseline gap-2">
                <h1
                  className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight"
                  style={{ fontFamily: typo.titleFamily }}
                >
                  {business.name}
                </h1>
                <span className="text-xs text-slate-400 font-mono">· {catalog.title}</span>
              </div>

              {business.description && (
                <p className="mt-1.5 text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
                  {business.description}
                </p>
              )}

              {/* Meta details */}
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500">
                {business.address && (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{business.address}</span>
                  </div>
                )}
                {business.phone && (
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{business.phone}</span>
                  </div>
                )}
                {business.instagram && (
                  <div className="flex items-center gap-1.5">
                    <Instagram className="w-3.5 h-3.5 text-slate-400" />
                    <span>{business.instagram}</span>
                  </div>
                )}
              </div>
            </div>

            {/* WhatsApp direct talk button */}
            {business.whatsapp && (
              <a
                href={`https://wa.me/${business.whatsapp.replace(/[^\d]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                style={{ backgroundColor: catalog.primary_color || '#16a34a' }}
                className="shrink-0 py-2.5 px-4 rounded-xl text-white font-semibold text-xs flex items-center justify-center gap-2 hover:opacity-95 shadow-xs transition-opacity"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Falar no WhatsApp</span>
              </a>
            )}
          </div>

          {/* Welcome Message banner if present */}
          {catalog.welcome_message && (
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-start gap-2 text-xs text-slate-600 bg-slate-50/70 p-3 rounded-xl">
              <span className="text-slate-400 font-semibold">Mensagem:</span>
              <span>{catalog.welcome_message}</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto px-4 mt-8 space-y-6">
        {/* Search & Category Filter Bar */}
        <div className="sticky top-3 z-30 space-y-3 bg-[#fafafa]/95 backdrop-blur-md pt-2 pb-3">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Pesquisar produto ou prato..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm placeholder:text-slate-400 focus:outline-hidden focus:border-slate-800 shadow-2xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                Limpar
              </button>
            )}
          </div>

          {/* Category Tabs (Functional buttons) */}
          {categories.length > 0 && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              <button
                type="button"
                onClick={() => setSelectedCategory(null)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap shrink-0 transition-colors ${
                  selectedCategory === null
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
                }`}
              >
                Todos ({data.products.length})
              </button>

              {categories.map((cat) => {
                const count = data.products.filter((p) => p.category_id === cat.id).length;
                const isSelected = selectedCategory === cat.id;

                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap shrink-0 transition-colors ${
                      isSelected
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className="ml-1 opacity-70 font-mono text-[11px]">({count})</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Template Layout Renderer */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center border border-slate-200/80 my-8">
            <p className="font-semibold text-slate-800 text-base">Nenhum produto encontrado</p>
            <p className="text-xs text-slate-400 mt-1">
              Tente pesquisar com outro termo ou selecione outra categoria.
            </p>
          </div>
        ) : (
          <div>
            {catalog.template === 'classic' && (
              <ClassicTemplate
                catalog={catalog}
                categories={categories}
                products={filteredProducts}
                activeCategory={selectedCategory}
                onSelectProduct={(p) => setModalProduct(p)}
                onDirectOrder={(p) => handleDirectOrder(p)}
              />
            )}

            {catalog.template === 'modern' && (
              <ModernTemplate
                catalog={catalog}
                categories={categories}
                products={filteredProducts}
                activeCategory={selectedCategory}
                onSelectProduct={(p) => setModalProduct(p)}
                onDirectOrder={(p) => handleDirectOrder(p)}
              />
            )}

            {catalog.template === 'premium' && (
              <PremiumTemplate
                catalog={catalog}
                categories={categories}
                products={filteredProducts}
                activeCategory={selectedCategory}
                onSelectProduct={(p) => setModalProduct(p)}
                onDirectOrder={(p) => handleDirectOrder(p)}
              />
            )}

            {catalog.template === 'minimal' && (
              <MinimalTemplate
                catalog={catalog}
                categories={categories}
                products={filteredProducts}
                activeCategory={selectedCategory}
                onSelectProduct={(p) => setModalProduct(p)}
                onDirectOrder={(p) => handleDirectOrder(p)}
              />
            )}

            {catalog.template === 'compact' && (
              <CompactTemplate
                catalog={catalog}
                categories={categories}
                products={filteredProducts}
                activeCategory={selectedCategory}
                onSelectProduct={(p) => setModalProduct(p)}
                onDirectOrder={(p) => handleDirectOrder(p)}
              />
            )}
          </div>
        )}
      </main>

      {/* Floating Bottom Cart Bar (appears when items > 0) */}
      {cartItems.length > 0 && (
        <div className="fixed bottom-4 left-0 right-0 z-40 px-4 flex justify-center pointer-events-none">
          <div className="pointer-events-auto w-full max-w-md bg-slate-900 text-white rounded-2xl p-3 px-4 shadow-xl flex items-center justify-between border border-slate-800 animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center font-bold text-sm">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-slate-400 block font-mono">
                  {totalCartCount} {totalCartCount === 1 ? 'item' : 'itens'} adicionados
                </span>
                <span className="text-sm font-bold font-mono tabular-nums">
                  {catalog.currency} {totalCartValue}
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(true)}
              style={{ backgroundColor: catalog.primary_color || '#16a34a' }}
              className="py-2.5 px-4 rounded-xl text-xs font-bold text-white hover:opacity-95 transition-opacity flex items-center gap-1.5 shadow-xs"
            >
              <span>Ver Pedido</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Product Detail Modal */}
      <ProductModal
        product={modalProduct}
        business={business}
        catalog={catalog}
        onClose={() => setModalProduct(null)}
        onAddToCart={handleAddToCart}
        onDirectWhatsApp={(prod, qty, details) => {
          handleDirectOrder(prod, qty, details);
          setModalProduct(null);
        }}
      />

      {/* Order Bag / Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        business={business}
        catalog={catalog}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
      />

      {/* Footer Branding */}
      <footer className="mt-16 text-center text-xs text-slate-400 py-6 border-t border-slate-200">
        <p>
          Catálogo digital de {business.name} · Desenvolvido com{' '}
          <span className="font-bold text-[#6D28D9]">Catafy</span>
        </p>
      </footer>
    </div>
  );
};
