import React, { useState, useEffect } from 'react';
import {
  Package,
  Plus,
  Search,
  Copy,
  Edit2,
  Trash2,
  Check,
  X,
  Upload,
  Layers,
  Sparkles,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';
import { Product, Business, Category } from '../../types';
import { api } from '../../lib/api';
import { ImageUploader } from '../common/ImageUploader';

interface ProductsViewProps {
  businesses: Business[];
  onRefresh: () => void;
}

export const ProductsView: React.FC<ProductsViewProps> = ({ businesses, onRefresh }) => {
  const [selectedBizId, setSelectedBizId] = useState<string>(businesses[0]?.id || '');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCatId, setSelectedCatId] = useState<string | null>(null);

  // Modal / Form state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [promoPrice, setPromoPrice] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  const [ingredients, setIngredients] = useState('');
  const [serviceDuration, setServiceDuration] = useState('');
  const [clothingSizes, setClothingSizes] = useState('');
  const [colors, setColors] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const currentBusiness = businesses.find((b) => b.id === selectedBizId);

  // Load products & categories when selected business changes
  const loadData = async (bizId: string) => {
    if (!bizId) return;
    setLoading(true);
    try {
      const [prodsRes, catsRes] = await Promise.all([
        api.getProducts(bizId),
        api.getCategories(bizId),
      ]);
      setProducts(prodsRes.products);
      setCategories(catsRes.categories);
    } catch (err) {
      console.error('Error loading products/categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedBizId) {
      loadData(selectedBizId);
    }
  }, [selectedBizId]);

  const openCreateModal = () => {
    setEditingProduct(null);
    setName('');
    setDescription('');
    setPrice('');
    setPromoPrice('');
    setCategoryId(categories[0]?.id || '');
    setImageUrl('');
    setIsAvailable(true);
    setIngredients('');
    setServiceDuration('');
    setClothingSizes('');
    setColors('');
    setFormError(null);
    setModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setName(p.name);
    setDescription(p.description || '');
    setPrice(p.price.toString());
    setPromoPrice(p.promo_price ? p.promo_price.toString() : '');
    setCategoryId(p.category_id || categories[0]?.id || '');
    setImageUrl(p.image_url || '');
    setIsAvailable(p.is_available);
    setIngredients(p.segment_data?.ingredients || '');
    setServiceDuration(p.segment_data?.service_duration || '');
    setClothingSizes(p.segment_data?.clothing_sizes?.join(', ') || '');
    setColors(p.segment_data?.colors?.join(', ') || '');
    setFormError(null);
    setModalOpen(true);
  };

  const handleToggleAvailable = async (p: Product) => {
    try {
      const updated = await api.updateProduct(p.id, { is_available: !p.is_available });
      setProducts((prev) => prev.map((item) => (item.id === p.id ? updated.product : item)));
    } catch (err: any) {
      alert(err.message || 'Erro ao alterar disponibilidade.');
    }
  };

  const handleDuplicate = async (p: Product) => {
    try {
      const res = await api.duplicateProduct(p.id);
      setProducts((prev) => [...prev, res.product]);
    } catch (err: any) {
      alert(err.message || 'Erro ao duplicar produto.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente remover este produto?')) return;
    try {
      await api.deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err: any) {
      alert(err.message || 'Erro ao eliminar produto.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !price) {
      setFormError('Nome e preço são obrigatórios.');
      return;
    }

    setFormLoading(true);
    setFormError(null);

    const segmentData: Record<string, any> = {};
    if (ingredients.trim()) segmentData.ingredients = ingredients.trim();
    if (serviceDuration.trim()) segmentData.service_duration = serviceDuration.trim();
    if (clothingSizes.trim()) {
      segmentData.clothing_sizes = clothingSizes.split(',').map((s) => s.trim()).filter(Boolean);
    }
    if (colors.trim()) {
      segmentData.colors = colors.split(',').map((c) => c.trim()).filter(Boolean);
    }

    try {
      if (editingProduct) {
        const res = await api.updateProduct(editingProduct.id, {
          name: name.trim(),
          description: description.trim(),
          price: parseFloat(price) || 0,
          promo_price: promoPrice ? parseFloat(promoPrice) : null,
          category_id: categoryId,
          image_url: imageUrl.trim(),
          is_available: isAvailable,
          segment_data: segmentData,
        });
        setProducts((prev) =>
          prev.map((item) => (item.id === editingProduct.id ? res.product : item))
        );
      } else {
        const res = await api.createProduct({
          business_id: selectedBizId,
          name: name.trim(),
          description: description.trim(),
          price: parseFloat(price) || 0,
          promo_price: promoPrice ? parseFloat(promoPrice) : null,
          category_id: categoryId,
          image_url: imageUrl.trim(),
          is_available: isAvailable,
          segment_data: segmentData,
        });
        setProducts((prev) => [...prev, res.product]);
      }
      setModalOpen(false);
      onRefresh();
    } catch (err: any) {
      setFormError(err.message || 'Erro ao salvar produto.');
    } finally {
      setFormLoading(false);
    }
  };

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      !searchQuery.trim() ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCat = !selectedCatId || p.category_id === selectedCatId;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Top Bar with Business Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Gestão de Produtos</h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Cadastre, edite e organize os produtos e serviços da sua empresa.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {businesses.length > 1 && (
            <select
              value={selectedBizId}
              onChange={(e) => setSelectedBizId(e.target.value)}
              className="px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl font-semibold text-slate-800"
            >
              {businesses.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          )}

          <button
            onClick={openCreateModal}
            className="py-2.5 px-4 btn-catafy-gradient text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-opacity hover:opacity-95 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>+ Adicionar Produto</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por nome ou detalhe..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-[#6D28D9]"
          />
        </div>

        {/* Categories Tab pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 no-scrollbar">
          <button
            type="button"
            onClick={() => setSelectedCatId(null)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
              selectedCatId === null
                ? 'bg-[#6D28D9] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Todos ({products.length})
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setSelectedCatId(c.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
                selectedCatId === c.id
                  ? 'bg-[#6D28D9] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Product List Table / Grid */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-xs text-slate-400">
          A carregar produtos...
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-12 text-center space-y-3">
          <Package className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-800 text-base">Nenhum produto encontrado</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Não foram encontrados itens com os filtros atuais.
          </p>
          <button
            onClick={openCreateModal}
            className="mt-2 py-2 px-4 bg-slate-900 text-white rounded-xl text-xs font-semibold"
          >
            Cadastrar Novo Produto
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                  <th className="py-3 px-4">Item</th>
                  <th className="py-3 px-4">Categoria</th>
                  <th className="py-3 px-4">Preço</th>
                  <th className="py-3 px-4 text-center">Disponível</th>
                  <th className="py-3 px-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map((product) => {
                  const cat = categories.find((c) => c.id === product.category_id);
                  return (
                    <tr key={product.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          {product.image_url ? (
                            <img
                              src={product.image_url}
                              alt={product.name}
                              referrerPolicy="no-referrer"
                              className="w-10 h-10 rounded-lg object-cover bg-slate-100 shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                              <Package className="w-4 h-4" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <span className="font-bold text-slate-900 block truncate">
                              {product.name}
                            </span>
                            <span className="text-[11px] text-slate-400 block truncate max-w-xs">
                              {product.description || 'Sem descrição'}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-slate-600 font-medium">
                        {cat?.name || '—'}
                      </td>

                      <td className="py-3 px-4 font-mono font-bold text-slate-900 tabular-nums">
                        {product.promo_price ? (
                          <div className="flex items-center gap-1.5">
                            <span className="line-through text-slate-400 text-[10px]">
                              € {product.price.toFixed(2)}
                            </span>
                            <span className="text-rose-600">
                              € {product.promo_price.toFixed(2)}
                            </span>
                          </div>
                        ) : (
                          <span>€ {product.price.toFixed(2)}</span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleAvailable(product)}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold"
                        >
                          {product.is_available ? (
                            <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                              Disponível
                            </span>
                          ) : (
                            <span className="text-slate-400 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full">
                              Pausado
                            </span>
                          )}
                        </button>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => handleDuplicate(product)}
                            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Duplicar produto"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => openEditModal(product)}
                            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Editar produto"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Eliminar produto"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Create / Edit Product */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl my-auto">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-base">
                {editingProduct ? 'Editar Produto' : 'Adicionar Novo Produto'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 flex-1">
              {formError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                  {formError}
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 block">
                  Nome do Produto / Serviço *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Torta de Limão Merengada, Corte Fade..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:border-slate-800 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 block">Categoria</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:border-slate-800 focus:outline-hidden"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 block">
                    Disponibilidade
                  </label>
                  <select
                    value={isAvailable ? 'true' : 'false'}
                    onChange={(e) => setIsAvailable(e.target.value === 'true')}
                    className="w-full px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:border-slate-800 focus:outline-hidden"
                  >
                    <option value="true">Ativo e Disponível</option>
                    <option value="false">Pausado / Esgotado</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 block">Preço Base *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="12.50"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:border-slate-800 focus:outline-hidden font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 block">
                    Preço Promocional (opcional)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="9.90"
                    value={promoPrice}
                    onChange={(e) => setPromoPrice(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:border-slate-800 focus:outline-hidden font-mono"
                  />
                </div>
              </div>

              <ImageUploader
                label="Fotografia do Produto / Serviço"
                value={imageUrl}
                onChange={setImageUrl}
                aspectRatio="square"
                placeholder="Carregar foto do produto (recomendado 800x800)"
              />

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 block">Descrição</label>
                <textarea
                  rows={2}
                  placeholder="Apresentação do produto, sabor, notas de confecção..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:border-slate-800 focus:outline-hidden resize-none"
                />
              </div>

              {/* Segment-specific fields */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  Campos Personalizados do Segmento
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-700 block">Ingredientes</label>
                    <input
                      type="text"
                      placeholder="Ex: Queijo gorgonzola, nozes, mel..."
                      value={ingredients}
                      onChange={(e) => setIngredients(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-700 block">Duração (Serviços)</label>
                    <input
                      type="text"
                      placeholder="Ex: 40 minutos"
                      value={serviceDuration}
                      onChange={(e) => setServiceDuration(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-700 block">
                      Tamanhos de Roupas
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: S, M, L, XL"
                      value={clothingSizes}
                      onChange={(e) => setClothingSizes(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-700 block">Cores</label>
                    <input
                      type="text"
                      placeholder="Ex: Preto, Bege, Marinho"
                      value={colors}
                      onChange={(e) => setColors(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2.5 -mx-5 -mb-5 mt-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="py-2.5 px-4 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="py-2.5 px-5 rounded-xl btn-catafy-gradient text-white text-xs font-bold hover:opacity-95 transition-opacity shadow-xs"
                >
                  {formLoading ? 'A guardar...' : editingProduct ? 'Atualizar' : 'Guardar Produto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
