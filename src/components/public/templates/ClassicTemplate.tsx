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

export const ClassicTemplate: React.FC<TemplateProps> = ({
  catalog,
  categories,
  products,
  activeCategory,
  onSelectProduct,
  onDirectOrder,
}) => {
  const typo = getTypographyConfig(catalog.typography);

  const filteredProducts = activeCategory
    ? products.filter((p) => p.category_id === activeCategory)
    : products;

  // Group by category if "all" is active
  const groupedCategories = activeCategory
    ? categories.filter((c) => c.id === activeCategory)
    : categories;

  return (
    <div className="space-y-10" style={{ fontFamily: typo.bodyFamily }}>
      {groupedCategories.map((category) => {
        const catProducts = filteredProducts.filter((p) => p.category_id === category.id);
        if (catProducts.length === 0) return null;

        return (
          <section key={category.id} className="space-y-4">
            <div className="border-b-2 pb-2" style={{ borderColor: catalog.primary_color || '#6D28D9' }}>
              <h3
                className="text-xl font-bold text-slate-900 tracking-tight"
                style={{ fontFamily: typo.titleFamily }}
              >
                {category.name}
              </h3>
            </div>

            <div className="divide-y divide-slate-100">
              {catProducts.map((product) => (
                <div
                  key={product.id}
                  onClick={() => onSelectProduct(product)}
                  className="py-4 flex items-center justify-between gap-4 cursor-pointer group hover:bg-slate-50/70 -mx-3 px-3 rounded-xl transition-colors"
                >
                  <div className="flex-1 min-w-0 pr-2">
                    <div className="flex items-baseline gap-2">
                      <h4
                        className="font-semibold text-slate-900 text-base group-hover:text-purple-700 transition-colors"
                        style={{ fontFamily: typo.titleFamily }}
                      >
                        {product.name}
                      </h4>
                      {product.segment_data?.service_duration && (
                        <span className="text-xs text-slate-400 font-mono">
                          · {product.segment_data.service_duration}
                        </span>
                      )}
                    </div>

                    {product.description && (
                      <p
                        className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed"
                        style={{ fontFamily: typo.bodyFamily }}
                      >
                        {product.description}
                      </p>
                    )}

                    <div className="mt-2 flex items-center gap-2">
                      {product.promo_price ? (
                        <div className="flex items-center gap-1.5" style={{ fontFamily: typo.priceFamily }}>
                          <span className="text-xs line-through text-slate-400">
                            {catalog.currency} {product.price.toFixed(2)}
                          </span>
                          <span className="text-sm font-bold text-rose-600 tabular-nums">
                            {catalog.currency} {product.promo_price.toFixed(2)}
                          </span>
                        </div>
                      ) : (
                        <span
                          className="text-sm font-bold text-slate-900 tabular-nums"
                          style={{ fontFamily: typo.priceFamily }}
                        >
                          {catalog.currency} {product.price.toFixed(2)}
                        </span>
                      )}

                      {product.segment_data?.sizes && product.segment_data.sizes.length > 0 && (
                        <span className="text-[11px] text-slate-400">
                          (a partir de)
                        </span>
                      )}
                    </div>
                  </div>

                  {product.image_url && (
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-100 relative">
                      <img
                        src={product.image_url}
                        alt={product.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    </div>
                  )}

                  <div className="flex flex-col gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => onSelectProduct(product)}
                      className="w-9 h-9 rounded-xl border border-slate-200 hover:border-slate-400 bg-white text-slate-700 flex items-center justify-center transition-colors"
                      title="Adicionar à sacola"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDirectOrder(product)}
                      style={{ color: catalog.primary_color }}
                      className="w-9 h-9 rounded-xl border border-slate-200 hover:bg-slate-50 bg-white flex items-center justify-center transition-colors"
                      title="Pedir direto no WhatsApp"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </button>
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
