import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  ExternalLink,
  Copy,
  Check,
  Edit2,
  Trash2,
  Share2,
  Eye,
  Store,
} from 'lucide-react';
import { Catalog, Business } from '../../types';
import { api } from '../../lib/api';

interface CatalogsViewProps {
  catalogs: Catalog[];
  businesses: Business[];
  onRefresh: () => void;
  onNewCatalog: () => void;
  onEditCatalog: (catalog: Catalog) => void;
  onOpenPublicCatalog: (slug: string) => void;
}

export const CatalogsView: React.FC<CatalogsViewProps> = ({
  catalogs,
  businesses,
  onRefresh,
  onNewCatalog,
  onEditCatalog,
  onOpenPublicCatalog,
}) => {
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleCopyLink = (slug: string) => {
    const fullUrl = `${window.location.origin}/loja/${slug}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(fullUrl);
      setCopiedSlug(slug);
      setTimeout(() => setCopiedSlug(null), 2000);
    }
  };

  const handleToggleStatus = async (cat: Catalog) => {
    setLoadingId(cat.id);
    try {
      await api.updateCatalog(cat.id, { is_active: !cat.is_active });
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Erro ao alterar estado do catálogo.');
    } finally {
      setLoadingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    setLoadingId(id);
    try {
      await api.deleteCatalog(id);
      setDeleteConfirmId(null);
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Erro ao eliminar catálogo.');
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#17152B] tracking-tight">Meus Catálogos</h2>
          <p className="text-xs sm:text-sm text-[#77758A]">
            Publique, personalize modelos visuais e partilhe links exclusivos com clientes no Catafy.
          </p>
        </div>

        <button
          onClick={onNewCatalog}
          className="py-2.5 px-4 btn-catafy-gradient text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>+ Criar Novo Catálogo</span>
        </button>
      </div>

      {catalogs.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center space-y-3 shadow-xs">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-bold text-[#17152B] text-lg">Nenhum catálogo publicado ainda</h3>
          <p className="text-xs text-[#77758A] max-w-sm mx-auto">
            Crie um catálogo digital moderno e receba pedidos no WhatsApp em poucos minutos.
          </p>
          <button
            onClick={onNewCatalog}
            className="mt-2 py-2.5 px-5 btn-catafy-gradient text-white rounded-xl text-xs font-semibold cursor-pointer shadow-xs"
          >
            Iniciar criador de catálogos
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {catalogs.map((catalog) => {
            const biz = businesses.find((b) => b.id === catalog.business_id) || catalog.business;

            return (
              <div
                key={catalog.id}
                className="bg-white rounded-3xl border border-slate-100 shadow-2xs overflow-hidden flex flex-col justify-between hover:border-[#6D28D9]/40 hover:shadow-xs transition-all"
              >
                <div>
                  {/* Cover Header */}
                  <div className="h-36 w-full bg-[#17152B] relative overflow-hidden">
                    {catalog.cover_url ? (
                      <img
                        src={catalog.cover_url}
                        alt={catalog.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover opacity-85"
                      />
                    ) : (
                      <div
                        className="w-full h-full opacity-90"
                        style={{ backgroundColor: catalog.primary_color || '#6D28D9' }}
                      />
                    )}

                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-lg ${
                          catalog.is_active
                            ? 'bg-emerald-500 text-white shadow-2xs'
                            : 'bg-slate-700 text-slate-200'
                        }`}
                      >
                        {catalog.is_active ? 'Publicado' : 'Rascunho'}
                      </span>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-lg bg-black/60 text-white backdrop-blur-xs">
                        {catalog.template}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3 flex items-center gap-1.5">
                      <button
                        onClick={() => onEditCatalog(catalog)}
                        className="p-1.5 rounded-lg bg-white/90 text-[#17152B] hover:bg-white shadow-xs transition-colors cursor-pointer"
                        title="Editar catálogo"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(catalog.id)}
                        className="p-1.5 rounded-lg bg-white/90 text-rose-600 hover:bg-white shadow-xs transition-colors cursor-pointer"
                        title="Eliminar catálogo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-5">
                    <div className="flex items-center gap-2 text-xs text-[#77758A] font-medium mb-1">
                      <Store className="w-3.5 h-3.5" />
                      <span className="truncate">{biz?.name || 'Empresa associada'}</span>
                    </div>

                    <h3 className="font-bold text-[#17152B] text-base leading-snug">
                      {catalog.title}
                    </h3>

                    {catalog.description && (
                      <p className="text-xs text-[#77758A] line-clamp-2 mt-1 leading-relaxed">
                        {catalog.description}
                      </p>
                    )}

                    {/* Slug link badge */}
                    <div className="mt-4 p-2.5 bg-[#F8F7FC] rounded-2xl border border-slate-100 flex items-center justify-between gap-2">
                      <span className="text-xs font-mono text-[#6D28D9] font-bold truncate">
                        /loja/{catalog.slug}
                      </span>
                      <button
                        onClick={() => handleCopyLink(catalog.slug)}
                        className="p-1 rounded-lg text-slate-400 hover:text-[#17152B] hover:bg-white transition-colors shrink-0 cursor-pointer"
                        title="Copiar link público"
                      >
                        {copiedSlug === catalog.slug ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Footer Bar */}
                <div className="px-5 py-3.5 bg-[#F8F7FC] border-t border-slate-100 flex items-center justify-between text-xs">
                  <button
                    onClick={() => handleToggleStatus(catalog)}
                    disabled={loadingId === catalog.id}
                    className="text-[#77758A] hover:text-[#17152B] font-medium cursor-pointer"
                  >
                    {catalog.is_active ? 'Pausar Catálogo' : 'Ativar e Publicar'}
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopyLink(catalog.slug)}
                      className="py-1.5 px-2.5 rounded-xl border border-slate-200 hover:bg-white text-[#17152B] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Share2 className="w-3 h-3" />
                      <span>{copiedSlug === catalog.slug ? 'Copiado!' : 'Partilhar'}</span>
                    </button>
                    <button
                      onClick={() => onOpenPublicCatalog(catalog.slug)}
                      className="py-1.5 px-3 rounded-xl btn-catafy-gradient text-white font-semibold flex items-center gap-1 transition-all shadow-2xs cursor-pointer"
                    >
                      <span>Abrir</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-xl">
            <h3 className="font-bold text-[#17152B] text-lg">Eliminar Catálogo?</h3>
            <p className="text-xs text-[#77758A] leading-relaxed">
              O link público deixará de estar acessível para os seus clientes. Os produtos cadastrados na sua empresa não serão apagados.
            </p>
            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="py-2 px-3.5 rounded-xl border border-slate-200 text-xs font-semibold text-[#17152B] hover:bg-slate-50 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteConfirmId)}
                className="py-2 px-3.5 rounded-xl bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 transition-colors cursor-pointer"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
