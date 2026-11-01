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

export const PremiumTemplate: React.FC<TemplateProps> = ({
  catalog,
  categories,
  products,
  activeCategory,
  onSelectProduct,
  onDirectOrder,
}) => {
  const typo = getTypographyConfig(catalog.typography || 'elegante');

  const filteredProducts = activeCategory
    ? products.filter((p) => p.category_id === activeCategory)
    : products;

  const groupedCategories = activeCategory
    ? categories.filter((c) => c.id === activeCategory)
    : categories;

  return (
    <div className="space-y-16" style={{ fontFamily: typo.bodyFamily }}>
      {groupedCategories.map((category) => {
        const catProducts = filteredProducts.filter((p) => p.category_id === category.id);
        if (catProducts.length === 0) return null;

        return (
          <section key={category.id} className="space-y-8">
            <div className="text-center max-w-md mx-auto space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-purple-900">
                Seleção Exclusiva
              </span>
              <h3
                className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight"
                style={{ fontFamily: typo.titleFamily }}
              >
                {category.name}
              </h3>
              <div className="w-12 h-0.5 bg-purple-600/60 mx-auto mt-2" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {catProducts.map((product) => (
                <div
                  key={product.id}
                  onClick={() => onSelectProduct(product)}
                  className="group bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs hover:border-stone-400/80 transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div className="flex gap-4 sm:gap-5 items-start">
                    {product.image_url && (
                      <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-xl overflow-hidden bg-stone-100 shrink-0 relative">
                        <img
                          src={product.image_url}
                          alt={product.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4
                          className="text-lg font-bold text-stone-900 group-hover:text-purple-900 transition-colors"
                          style={{ fontFamily: typo.titleFamily }}
                        >
                          {product.name}
                        </h4>
                      </div>

                      <div className="mt-1 flex items-baseline gap-2">
                        {product.promo_price ? (
                          <div className="flex items-center gap-1.5" style={{ fontFamily: typo.priceFamily }}>
                            <span className="text-xs line-through text-stone-400">
                              {catalog.currency} {product.price.toFixed(2)}
                            </span>
                            <span className="text-base font-bold text-purple-950 tabular-nums">
                              {catalog.currency} {product.promo_price.toFixed(2)}
                            </span>
                          </div>
                        ) : (
                          <span
                            className="text-base font-bold text-stone-900 tabular-nums"
                            style={{ fontFamily: typo.priceFamily }}
                          >
                            {catalog.currency} {product.price.toFixed(2)}
                          </span>
                        )}
                      </div>

                      {product.description && (
                        <p
                          className="mt-2 text-xs text-stone-600 line-clamp-2 leading-relaxed"
                          style={{ fontFamily: typo.bodyFamily }}
                        >
                          {product.description}
                        </p>
                      )}

                      {product.segment_data?.ingredients && (
                        <p className="mt-1.5 text-[11px] text-stone-400 italic truncate">
                          {product.segment_data.ingredients}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between" onClick={(e) => e.stopPropagation()}>
                    <span className="text-[11px] text-stone-400 font-medium tracking-wide">
                      Disponibilidade imediata
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onSelectProduct(product)}
                        className="py-1.5 px-3 rounded-lg border border-stone-300 hover:bg-stone-50 text-stone-800 text-xs font-semibold flex items-center gap-1 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Detalhes</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onDirectOrder(product)}
                        style={{ backgroundColor: catalog.primary_color || '#1c1917' }}
                        className="p-1.5 rounded-lg text-white hover:opacity-90 shadow-xs transition-opacity"
                        title="Pedir no WhatsApp"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
};
