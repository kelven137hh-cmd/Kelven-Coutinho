import React, { useState } from 'react';
import {
  Plus,
  Store,
  MapPin,
  Phone,
  MessageCircle,
  Instagram,
  Edit2,
  Trash2,
  X,
  BookOpen,
  Package,
} from 'lucide-react';
import { Business, BusinessCategory, Catalog, Product } from '../../types';
import { api } from '../../lib/api';
import { ImageUploader } from '../common/ImageUploader';

interface BusinessesViewProps {
  businesses: Business[];
  catalogs: Catalog[];
  products: Product[];
  onRefresh: () => void;
  onNewCatalogForBusiness: (businessId: string) => void;
}

export const BusinessesView: React.FC<BusinessesViewProps> = ({
  businesses,
  catalogs,
  products,
  onRefresh,
  onNewCatalogForBusiness,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBiz, setEditingBiz] = useState<Business | null>(null);
  const [loading, setLoading] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState<BusinessCategory>('restaurant');
  const [description, setDescription] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [address, setAddress] = useState('');
  const [instagram, setInstagram] = useState('');
  const [facebook, setFacebook] = useState('');
  const [website, setWebsite] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const openCreateModal = () => {
    setEditingBiz(null);
    setName('');
    setCategory('restaurant');
    setDescription('');
    setLogoUrl('');
    setCoverUrl('');
    setPhone('');
    setWhatsapp('');
    setAddress('');
    setInstagram('');
    setFacebook('');
    setWebsite('');
    setFormError(null);
    setModalOpen(true);
  };

  const openEditModal = (b: Business) => {
    setEditingBiz(b);
    setName(b.name);
    setCategory(b.category);
    setDescription(b.description || '');
    setLogoUrl(b.logo_url || '');
    setCoverUrl(b.cover_url || '');
    setPhone(b.phone || '');
    setWhatsapp(b.whatsapp || '');
    setAddress(b.address || '');
    setInstagram(b.instagram || '');
    setFacebook(b.facebook || '');
    setWebsite(b.website || '');
    setFormError(null);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setFormError('O nome da empresa é obrigatório.');
      return;
    }

    setLoading(true);
    setFormError(null);

    try {
      if (editingBiz) {
        await api.updateBusiness(editingBiz.id, {
          name: name.trim(),
          category,
          description: description.trim(),
          logo_url: logoUrl.trim(),
          cover_url: coverUrl.trim(),
          phone: phone.trim(),
          whatsapp: whatsapp.trim(),
          address: address.trim(),
          instagram: instagram.trim(),
          facebook: facebook.trim(),
          website: website.trim(),
        });
      } else {
        await api.createBusiness({
          name: name.trim(),
          category,
          description: description.trim(),
          logo_url: logoUrl.trim(),
          cover_url: coverUrl.trim(),
          phone: phone.trim(),
          whatsapp: whatsapp.trim(),
          address: address.trim(),
          instagram: instagram.trim(),
          facebook: facebook.trim(),
          website: website.trim(),
        });
      }
      setModalOpen(false);
      onRefresh();
    } catch (err: any) {
      setFormError(err.message || 'Erro ao guardar dados da empresa.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      await api.deleteBusiness(id);
      setDeleteConfirmId(null);
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Erro ao eliminar empresa.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#17152B] tracking-tight">Meus Negócios</h2>
          <p className="text-xs sm:text-sm text-[#77758A]">
            Cadastre e faça a gestão das suas empresas e filiais na mesma conta Catafy.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="py-2.5 px-4 btn-catafy-gradient text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Cadastrar Nova Empresa</span>
        </button>
      </div>

      {/* Business Cards List */}
      {businesses.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center space-y-3 shadow-xs">
          <Store className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-bold text-[#17152B] text-lg">Nenhum negócio cadastrado</h3>
          <p className="text-xs text-[#77758A] max-w-sm mx-auto">
            Cadastre o primeiro negócio para começar a criar catálogos personalizados para os seus clientes.
          </p>
          <button
            onClick={openCreateModal}
            className="mt-2 py-2.5 px-5 btn-catafy-gradient text-white rounded-xl text-xs font-semibold cursor-pointer shadow-xs"
          >
            Cadastrar minha primeira empresa
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {businesses.map((biz) => {
            const bizCatalogs = catalogs.filter((c) => c.business_id === biz.id);
            const bizProducts = products.filter((p) => p.business_id === biz.id);

            return (
              <div
                key={biz.id}
                className="bg-white rounded-3xl border border-slate-100 shadow-2xs overflow-hidden flex flex-col justify-between hover:border-[#6D28D9]/40 hover:shadow-xs transition-all"
              >
                <div>
                  {/* Cover */}
                  <div className="h-32 w-full bg-slate-100 relative overflow-hidden">
                    {biz.cover_url ? (
                      <img
                        src={biz.cover_url}
                        alt={biz.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-r from-[#6D28D9] to-[#9333EA] flex items-center justify-center text-white/40 text-xs">
                        Sem fotografia de capa
                      </div>
                    )}

                    {/* Category tag */}
                    <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-lg bg-white/95 backdrop-blur-xs text-[#17152B] text-[11px] font-bold uppercase tracking-wider shadow-2xs">
                      {biz.category}
                    </span>

                    {/* Actions */}
                    <div className="absolute top-3 right-3 flex items-center gap-1.5">
                      <button
                        onClick={() => openEditModal(biz)}
                        className="p-1.5 rounded-lg bg-white/90 text-[#17152B] hover:bg-white shadow-xs transition-colors cursor-pointer"
                        title="Editar negócio"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(biz.id)}
                        className="p-1.5 rounded-lg bg-white/90 text-rose-600 hover:bg-white shadow-xs transition-colors cursor-pointer"
                        title="Eliminar negócio"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-5">
                    <div className="flex items-start gap-3">
                      <div className="w-14 h-14 rounded-2xl bg-white border-2 border-white shadow-sm -mt-10 overflow-hidden flex items-center justify-center shrink-0">
                        {biz.logo_url ? (
                          <img
                            src={biz.logo_url}
                            alt={biz.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="font-extrabold text-[#6D28D9] text-base">
                            {biz.name.charAt(0)}
                          </span>
                        )}
                      </div>

                      <div className="min-w-0">
                        <h3 className="font-bold text-[#17152B] text-base leading-snug truncate">
                          {biz.name}
                        </h3>
                        <p className="text-xs text-[#77758A] line-clamp-2 mt-0.5">
                          {biz.description || 'Sem descrição informada.'}
                        </p>
                      </div>
                    </div>

                    {/* Details list */}
                    <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-[#77758A]">
                      {biz.address && (
                        <div className="flex items-center gap-2 truncate">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{biz.address}</span>
                        </div>
                      )}
                      {biz.whatsapp && (
                        <div className="flex items-center gap-2">
                          <MessageCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="font-mono">{biz.whatsapp}</span>
                        </div>
                      )}
                      {biz.instagram && (
                        <div className="flex items-center gap-2">
                          <Instagram className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{biz.instagram}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer bar */}
                <div className="px-5 py-3.5 bg-[#F8F7FC] border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3 text-[#77758A]">
                    <span className="flex items-center gap-1 font-mono">
                      <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                      {bizCatalogs.length} {bizCatalogs.length === 1 ? 'catálogo' : 'catálogos'}
                    </span>
                    <span className="flex items-center gap-1 font-mono">
                      <Package className="w-3.5 h-3.5 text-slate-400" />
                      {bizProducts.length} itens
                    </span>
                  </div>

                  <button
                    onClick={() => onNewCatalogForBusiness(biz.id)}
                    className="font-bold text-[#6D28D9] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>+ Catálogo</span>
                  </button>
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
            <h3 className="font-bold text-[#17152B] text-lg">Eliminar Empresa?</h3>
            <p className="text-xs text-[#77758A] leading-relaxed">
              Tem a certeza de que deseja eliminar esta empresa? Todos os catálogos, produtos e categorias vinculados a ela também serão removidos permanentemente.
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
                disabled={loading}
                onClick={() => handleDelete(deleteConfirmId)}
                className="py-2 px-3.5 rounded-xl bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 transition-colors cursor-pointer"
              >
                {loading ? 'A eliminar...' : 'Confirmar Eliminação'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Modal with ImageUploader */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl my-auto">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-[#17152B] text-base">
                {editingBiz ? 'Editar Empresa' : 'Cadastrar Nova Empresa'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
              {formError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                  {formError}
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#17152B] block">
                  Nome da Empresa *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Forno & Brasa, Boutique Chic, Barber King..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-[#F8F7FC] border border-slate-200 rounded-xl focus:border-[#6D28D9] focus:outline-hidden text-[#17152B]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#17152B] block">
                  Segmento de Negócio *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as BusinessCategory)}
                  className="w-full px-3.5 py-2.5 text-xs bg-[#F8F7FC] border border-slate-200 rounded-xl focus:border-[#6D28D9] focus:outline-hidden text-[#17152B]"
                >
                  <option value="restaurant">Restaurante / Cafetaria</option>
                  <option value="pizzeria">Pizzaria</option>
                  <option value="bakery">Pastelaria / Padaria</option>
                  <option value="fashion">Loja de Roupas / Moda</option>
                  <option value="barbershop">Barbearia / Salão de Beleza</option>
                  <option value="supermarket">Supermercado / Mercearia</option>
                  <option value="services">Serviços / Consultoria</option>
                  <option value="other">Outros Negócios</option>
                </select>
              </div>

              {/* Direct Image Uploaders */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <ImageUploader
                  label="Logotipo da Empresa"
                  value={logoUrl}
                  onChange={setLogoUrl}
                  aspectRatio="1:1"
                  helperText="Tamanho recomendado: 500x500px (quadrado)"
                />

                <ImageUploader
                  label="Fotografia de Capa"
                  value={coverUrl}
                  onChange={setCoverUrl}
                  aspectRatio="16:9"
                  helperText="Tamanho recomendado: 1200x400px (panorâmica)"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#17152B] block">Descrição</label>
                <textarea
                  rows={2}
                  placeholder="Conte um pouco sobre o seu negócio e especialidades..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-[#F8F7FC] border border-slate-200 rounded-xl focus:border-[#6D28D9] focus:outline-hidden text-[#17152B] resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#17152B] block">
                    WhatsApp para Pedidos
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: +351912345678"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-[#F8F7FC] border border-slate-200 rounded-xl focus:border-[#6D28D9] focus:outline-hidden text-[#17152B]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#17152B] block">
                    Telefone Fixo / Comercial
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: +351210000000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-[#F8F7FC] border border-slate-200 rounded-xl focus:border-[#6D28D9] focus:outline-hidden text-[#17152B]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#17152B] block">
                  Endereço Físico / Localização
                </label>
                <input
                  type="text"
                  placeholder="Ex: Rua Central 45, Lisboa"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-[#F8F7FC] border border-slate-200 rounded-xl focus:border-[#6D28D9] focus:outline-hidden text-[#17152B]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#17152B] block">Instagram</label>
                  <input
                    type="text"
                    placeholder="@suaempresa"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-[#F8F7FC] border border-slate-200 rounded-xl focus:border-[#6D28D9] focus:outline-hidden text-[#17152B]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#17152B] block">Website</label>
                  <input
                    type="text"
                    placeholder="https://suaempresa.com"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-[#F8F7FC] border border-slate-200 rounded-xl focus:border-[#6D28D9] focus:outline-hidden text-[#17152B]"
                  />
                </div>
              </div>

              <div className="p-4 bg-[#F8F7FC] border-t border-slate-100 flex justify-end gap-2.5 -mx-6 -mb-6 mt-6">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="py-2.5 px-4 rounded-xl border border-slate-200 text-xs font-semibold text-[#17152B] hover:bg-slate-100 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="py-2.5 px-5 rounded-xl btn-catafy-gradient text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  {loading ? 'A guardar...' : editingBiz ? 'Atualizar Empresa' : 'Guardar Empresa'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
