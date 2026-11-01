import React from 'react';
import { ArrowUpRight } from 'lucide-react';
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

export const MinimalTemplate: React.FC<TemplateProps> = ({
  catalog,
  categories,
  products,
  activeCategory,
  onSelectProduct,
}) => {
  const typo = getTypographyConfig(catalog.typography || 'minimalista');

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
          <section key={category.id} className="space-y-6">
            <h3
              className="text-xs uppercase tracking-widest font-semibold text-slate-400"
              style={{ fontFamily: typo.titleFamily }}
            >
              {category.name}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {catProducts.map((product) => (
                <div
                  key={product.id}
                  onClick={() => onSelectProduct(product)}
                  className="group cursor-pointer flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="aspect-square w-full rounded-lg overflow-hidden bg-slate-50 border border-slate-100 relative">
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
                        <div className="w-full h-full flex items-center justify-center text-slate-300 text-xs">
                          {product.name.charAt(0)}
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <h4
                          className="font-medium text-slate-900 text-sm group-hover:underline"
                          style={{ fontFamily: typo.titleFamily }}
                        >
                          {product.name}
                        </h4>
                        <ArrowUpRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-900 shrink-0 transition-colors" />
                      </div>

                      <div
                        className="mt-1 text-xs font-semibold text-slate-700 tabular-nums"
                        style={{ fontFamily: typo.priceFamily }}
                      >
                        {product.promo_price ? (
                          <span className="text-rose-600">
                            {catalog.currency} {product.promo_price.toFixed(2)}
                          </span>
                        ) : (
                          <span>
                            {catalog.currency} {product.price.toFixed(2)}
                          </span>
                        )}
                      </div>
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
