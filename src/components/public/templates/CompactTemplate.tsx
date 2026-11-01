import React from 'react';
import { Plus, MessageCircle } from 'lucide-react';
import { Product, Category, Catalog } from '../../../types';
import { getTypographyConfig } from '../../../lib/typography';

interface TemplateProps {
  catalog: Catalog;
  categories: Category[];
  products: Product[];
  activeCategory: string | null;
  onSelectProduct: (product: Product) => void;
  onDirectOrder: (product: Product) => void;
}

export const CompactTemplate: React.FC<TemplateProps> = ({
  catalog,
  categories,
  products,
  activeCategory,
  onSelectProduct,
  onDirectOrder,
}) => {
  const typo = getTypographyConfig(catalog.typography || 'comercial');

  const filteredProducts = activeCategory
    ? products.filter((p) => p.category_id === activeCategory)
    : products;

  const groupedCategories = activeCategory
    ? categories.filter((c) => c.id === activeCategory)
    : categories;

  return (
    <div className="space-y-8" style={{ fontFamily: typo.bodyFamily }}>
      {groupedCategories.map((category) => {
        const catProducts = filteredProducts.filter((p) => p.category_id === category.id);
        if (catProducts.length === 0) return null;

        return (
          <div key={category.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
            <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
              <span
                className="font-bold text-xs uppercase tracking-wider text-slate-700"
                style={{ fontFamily: typo.titleFamily }}
              >
                {category.name}
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                {catProducts.length} itens
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {catProducts.map((product) => (
                <div
                  key={product.id}
                  onClick={() => onSelectProduct(product)}
                  className="px-4 py-3 flex items-center justify-between gap-3 hover:bg-slate-50/80 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded-lg object-cover bg-slate-100 shrink-0"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 text-xs shrink-0">
                        •
                      </div>
                    )}

                    <div className="min-w-0">
                      <h4
                        className="text-sm font-semibold text-slate-900 truncate"
                        style={{ fontFamily: typo.titleFamily }}
                      >
                        {product.name}
                      </h4>
                      {product.description && (
                        <p
                          className="text-xs text-slate-400 truncate max-w-md"
                          style={{ fontFamily: typo.bodyFamily }}
                        >
                          {product.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0" onClick={(e) => e.stopPropagation()}>
                    <div className="text-right" style={{ fontFamily: typo.priceFamily }}>
                      {product.promo_price ? (
                        <div className="flex flex-col items-end">
                          <span className="text-[10px] line-through text-slate-400">
                            {catalog.currency} {product.price.toFixed(2)}
                          </span>
                          <span className="text-sm font-bold text-rose-600 tabular-nums">
                            {catalog.currency} {product.promo_price.toFixed(2)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm font-bold text-slate-900 tabular-nums">
                          {catalog.currency} {product.price.toFixed(2)}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => onSelectProduct(product)}
                        className="w-8 h-8 rounded-lg border border-slate-200 hover:border-slate-400 bg-white flex items-center justify-center text-slate-700 transition-colors"
                        title="Adicionar"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDirectOrder(product)}
                        style={{ color: catalog.primary_color || '#16a34a' }}
                        className="w-8 h-8 rounded-lg border border-slate-200 hover:bg-slate-50 bg-white flex items-center justify-center transition-colors"
                        title="Pedir no WhatsApp"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
