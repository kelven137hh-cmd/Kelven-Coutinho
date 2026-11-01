import React from 'react';
import { Plus, MessageCircle, Tag } from 'lucide-react';
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

export const ModernTemplate: React.FC<TemplateProps> = ({
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

  const groupedCategories = activeCategory
    ? categories.filter((c) => c.id === activeCategory)
    : categories;

  return (
    <div className="space-y-12" style={{ fontFamily: typo.bodyFamily }}>
      {groupedCategories.map((category) => {
        const catProducts = filteredProducts.filter((p) => p.category_id === category.id);
        if (catProducts.length === 0) return null;

        return (
          <section key={category.id} className="space-y-5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <h3
                className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2"
                style={{ fontFamily: typo.titleFamily }}
              >
                <span>{category.name}</span>
                <span className="text-xs font-normal text-slate-400 font-mono">
                  ({catProducts.length})
                </span>
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {catProducts.map((product) => (
                <div
                  key={product.id}
                  onClick={() => onSelectProduct(product)}
                  className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col cursor-pointer group"
                >
                  {/* Image container */}
                  <div className="relative aspect-4/3 w-full bg-slate-100 overflow-hidden">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <Tag className="w-8 h-8 opacity-40" />
                      </div>
                    )}

                    {product.promo_price && (
                      <span className="absolute top-3 left-3 bg-rose-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                        PROMO
                      </span>
                    )}

                    <div
                      className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-xl shadow-xs text-xs font-bold text-slate-900 tabular-nums"
                      style={{ fontFamily: typo.priceFamily }}
                    >
                      {product.promo_price ? (
                        <div className="flex items-center gap-1.5">
                          <span className="line-through text-slate-400 text-[10px]">
                            {catalog.currency} {product.price.toFixed(2)}
                          </span>
                          <span className="text-rose-600">
                            {catalog.currency} {product.promo_price.toFixed(2)}
                          </span>
                        </div>
                      ) : (
                        <span>
                          {catalog.currency} {product.price.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h4
                        className="font-bold text-slate-900 text-base leading-snug group-hover:text-purple-700 transition-colors"
                        style={{ fontFamily: typo.titleFamily }}
                      >
                        {product.name}
                      </h4>
                      {product.description && (
                        <p
                          className="mt-1.5 text-xs text-slate-500 line-clamp-2 leading-relaxed"
                          style={{ fontFamily: typo.bodyFamily }}
                        >
                          {product.description}
                        </p>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => onSelectProduct(product)}
                        className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Ver Opções</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onDirectOrder(product)}
                        style={{ backgroundColor: catalog.primary_color || '#16a34a' }}
                        className="p-2 rounded-xl text-white hover:opacity-90 shadow-xs transition-opacity"
                        title="Pedir direto no WhatsApp"
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
