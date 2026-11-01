import React, { useState } from 'react';
import { X, MessageCircle, Plus, Minus, Check } from 'lucide-react';
import { Product, Business, Catalog } from '../../types';

interface ProductModalProps {
  product: Product | null;
  business: Business;
  catalog: Catalog;
  onClose: () => void;
  onAddToCart?: (item: {
    product: Product;
    quantity: number;
    selectedSize?: { name: string; price: number };
    selectedColor?: string;
    selectedClothingSize?: string;
    notes?: string;
  }) => void;
  onDirectWhatsApp: (product: Product, quantity: number, details?: string) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  catalog,
  onClose,
  onAddToCart,
  onDirectWhatsApp,
}) => {
  if (!product) return null;

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<{ name: string; price: number } | undefined>(
    product.segment_data?.sizes && product.segment_data.sizes.length > 0
      ? product.segment_data.sizes[0]
      : undefined
  );
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    product.segment_data?.colors && product.segment_data.colors.length > 0
      ? product.segment_data.colors[0]
      : undefined
  );
  const [selectedClothingSize, setSelectedClothingSize] = useState<string | undefined>(
    product.segment_data?.clothing_sizes && product.segment_data.clothing_sizes.length > 0
      ? product.segment_data.clothing_sizes[0]
      : undefined
  );
  const [notes, setNotes] = useState('');
  const [addedAnimation, setAddedAnimation] = useState(false);

  const currentPrice = selectedSize ? selectedSize.price : (product.promo_price ?? product.price);
  const totalPrice = (currentPrice * quantity).toFixed(2);

  const handleAdd = () => {
    if (onAddToCart) {
      onAddToCart({
        product,
        quantity,
        selectedSize,
        selectedColor,
        selectedClothingSize,
        notes: notes.trim() || undefined,
      });
      setAddedAnimation(true);
      setTimeout(() => {
        setAddedAnimation(false);
        onClose();
      }, 600);
    }
  };

  const handleDirectOrder = () => {
    let details = '';
    if (selectedSize) details += ` (Tamanho: ${selectedSize.name})`;
    if (selectedColor) details += ` (Cor: ${selectedColor})`;
    if (selectedClothingSize) details += ` (Tamanho: ${selectedClothingSize})`;
    if (notes.trim()) details += ` [Obs: ${notes.trim()}]`;

    onDirectWhatsApp(product, quantity, details);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full sm:max-w-lg bg-white rounded-t-2xl sm:rounded-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header bar */}
        <div className="relative">
          {product.image_url ? (
            <div className="relative h-56 sm:h-64 w-full bg-slate-100 overflow-hidden">
              <img
                src={product.image_url}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>
          ) : (
            <div className="h-28 w-full bg-slate-50 flex items-center justify-center border-b border-slate-100">
              <span className="text-sm text-slate-400">Sem fotografia</span>
            </div>
          )}

          <button
            onClick={onClose}
            aria-label="Fechar"
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 text-slate-700 hover:bg-white flex items-center justify-center shadow-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          <div>
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
                {product.name}
              </h2>
              <div className="text-right shrink-0">
                {product.promo_price ? (
                  <div>
                    <span className="text-xs line-through text-slate-400 mr-1.5">
                      {catalog.currency} {product.price.toFixed(2)}
                    </span>
                    <span className="text-lg sm:text-xl font-bold text-rose-600 font-mono tabular-nums">
                      {catalog.currency} {product.promo_price.toFixed(2)}
                    </span>
                  </div>
                ) : (
                  <span className="text-lg sm:text-xl font-bold text-slate-900 font-mono tabular-nums">
                    {catalog.currency} {product.price.toFixed(2)}
                  </span>
                )}
              </div>
            </div>

            {product.description && (
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                {product.description}
              </p>
            )}
          </div>

          {/* Segment Details: Ingredients */}
          {product.segment_data?.ingredients && (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600 space-y-1">
              <span className="font-semibold text-slate-800 block">Ingredientes:</span>
              <p>{product.segment_data.ingredients}</p>
            </div>
          )}

          {/* Segment Details: Service duration */}
          {product.segment_data?.service_duration && (
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <span className="font-semibold text-slate-800">Duração estimada:</span>
              <span className="font-mono">{product.segment_data.service_duration}</span>
            </div>
          )}

          {/* Segment Details: Sizes with prices (Pizza/Food) */}
          {product.segment_data?.sizes && product.segment_data.sizes.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Selecione o Tamanho
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {product.segment_data.sizes.map((sz, idx) => {
                  const isSelected = selectedSize?.name === sz.name;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedSize(sz)}
                      className={`flex items-center justify-between p-3 rounded-xl border text-sm text-left transition-all ${
                        isSelected
                          ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <span className="font-medium">{sz.name}</span>
                      <span className="font-mono tabular-nums">
                        {catalog.currency} {sz.price.toFixed(2)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Segment Details: Clothing sizes */}
          {product.segment_data?.clothing_sizes && product.segment_data.clothing_sizes.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Tamanho da Peça
              </label>
              <div className="flex flex-wrap gap-2">
                {product.segment_data.clothing_sizes.map((cs) => {
                  const isSelected = selectedClothingSize === cs;
                  return (
                    <button
                      key={cs}
                      type="button"
                      onClick={() => setSelectedClothingSize(cs)}
                      className={`min-w-10 h-10 px-3 text-xs font-semibold rounded-lg border transition-colors ${
                        isSelected
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {cs}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Segment Details: Colors */}
          {product.segment_data?.colors && product.segment_data.colors.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Opções de Cor
              </label>
              <div className="flex flex-wrap gap-2">
                {product.segment_data.colors.map((c) => {
                  const isSelected = selectedColor === c;
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setSelectedColor(c)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                        isSelected
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {c}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Observações / Notes */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Observações (opcional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: sem cebola, embrulhar para presente..."
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 text-slate-800"
            />
          </div>

          {/* Quantity selector */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <span className="text-sm font-semibold text-slate-800">Quantidade</span>
            <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-white">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
                className="w-10 h-10 flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-white"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-12 text-center font-mono font-bold text-slate-900 text-sm">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="w-10 h-10 flex items-center justify-center text-slate-600 hover:bg-slate-50"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row gap-2.5">
          {onAddToCart && (
            <button
              type="button"
              onClick={handleAdd}
              disabled={addedAnimation}
              className="flex-1 py-3 px-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 font-semibold text-sm text-slate-800 transition-colors flex items-center justify-center gap-2"
            >
              {addedAnimation ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Adicionado!</span>
                </>
              ) : (
                <>
                  <span>Adicionar ao Pedido</span>
                  <span className="font-mono text-xs opacity-75">
                    ({catalog.currency} {totalPrice})
                  </span>
                </>
              )}
            </button>
          )}

          <button
            type="button"
            onClick={handleDirectOrder}
            style={{ backgroundColor: catalog.primary_color || '#16a34a' }}
            className="flex-1 py-3 px-4 rounded-xl text-white font-semibold text-sm hover:opacity-95 shadow-xs transition-opacity flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-4 h-4 shrink-0" />
            <span>Pedir via WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
};
