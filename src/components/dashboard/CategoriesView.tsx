import React, { useState, useEffect } from 'react';
import { Layers, Plus, Edit2, Trash2, X, Store } from 'lucide-react';
import { Business, Category } from '../../types';
import { api } from '../../lib/api';

interface CategoriesViewProps {
  businesses: Business[];
  onRefresh: () => void;
}

export const CategoriesView: React.FC<CategoriesViewProps> = ({ businesses }) => {
  const [selectedBizId, setSelectedBizId] = useState<string>(businesses[0]?.id || '');
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<Category | null>(null);
  const [catName, setCatName] = useState('');
  const [sortOrder, setSortOrder] = useState('1');

  const loadCategories = async (bizId: string) => {
    if (!bizId) return;
    setLoading(true);
    try {
      const res = await api.getCategories(bizId);
      setCategories(res.categories);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedBizId) {
      loadCategories(selectedBizId);
    }
  }, [selectedBizId]);

  const handleOpenCreate = () => {
    setEditingCat(null);
    setCatName('');
    setSortOrder((categories.length + 1).toString());
    setModalOpen(true);
  };

  const handleOpenEdit = (cat: Category) => {
    setEditingCat(cat);
    setCatName(cat.name);
    setSortOrder(cat.sort_order.toString());
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) return;

    try {
      if (editingCat) {
        await api.updateCategory(editingCat.id, {
          name: catName.trim(),
          sort_order: parseInt(sortOrder) || 1,
        });
      } else {
        await api.createCategory(selectedBizId, catName.trim(), parseInt(sortOrder) || 1);
      }
      setModalOpen(false);
      loadCategories(selectedBizId);
    } catch (err: any) {
      alert(err.message || 'Erro ao guardar categoria.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja eliminar esta categoria? Os produtos atribuídos a ela ficarão sem categoria.')) return;
    try {
      await api.deleteCategory(id);
      loadCategories(selectedBizId);
    } catch (err: any) {
      alert(err.message || 'Erro ao remover categoria.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Categorias</h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Organize os produtos e serviços dos seus catálogos em secções claras.
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
            onClick={handleOpenCreate}
            className="py-2.5 px-4 btn-catafy-gradient text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-opacity hover:opacity-95 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>+ Nova Categoria</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl p-12 text-center text-xs text-slate-400">
          A carregar categorias...
        </div>
      ) : categories.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-12 text-center space-y-3">
          <Layers className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-800 text-base">Nenhuma categoria criada</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Crie categorias (ex: Entradas, Sobremesas, Camisas, Cortes) para estruturar o seu catálogo.
          </p>
          <button
            onClick={handleOpenCreate}
            className="mt-2 py-2 px-4 bg-slate-900 text-white rounded-xl text-xs font-semibold"
          >
            Criar Primeira Categoria
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs divide-y divide-slate-100 overflow-hidden">
          {categories.map((cat, idx) => (
            <div key={cat.id} className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-xs font-mono font-bold text-slate-600">
                  {idx + 1}
                </span>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{cat.name}</h4>
                  <span className="text-[11px] text-slate-400 font-mono">Ordem: {cat.sort_order}</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleOpenEdit(cat)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                  title="Editar"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(cat.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Eliminar"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">
                {editingCat ? 'Editar Categoria' : 'Nova Categoria'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 block">Nome da Categoria *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Pizzas Tradicionais, Vestuário, Barba..."
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:border-slate-800 focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 block">Ordem de Exibição</label>
                <input
                  type="number"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:border-slate-800 focus:outline-hidden font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="py-2 px-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="py-2 px-4 rounded-xl btn-catafy-gradient text-white text-xs font-bold shadow-xs hover:opacity-95 transition-opacity"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
