import React, { useState, useEffect } from 'react';
import { ShieldCheck, Users, Store, BookOpen, Package, Eye, MessageCircle, AlertTriangle, CheckCircle } from 'lucide-react';
import { User } from '../../types';
import { api } from '../../lib/api';

export const AdminView: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [overview, setOverview] = useState<{
    totalUsers: number;
    totalBusinesses: number;
    totalCatalogs: number;
    totalProducts: number;
    totalViews: number;
    totalWhatsAppClicks: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [uRes, oRes] = await Promise.all([
        api.getAdminUsers(),
        api.getAdminOverview(),
      ]);
      setUsers(uRes.users);
      setOverview(oRes);
    } catch (err: any) {
      alert(err.message || 'Erro ao carregar dados administrativos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleToggleSuspend = async (userId: string) => {
    setActionLoadingId(userId);
    try {
      const res = await api.toggleSuspendUser(userId);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, is_suspended: res.user.is_suspended } : u))
      );
    } catch (err: any) {
      alert(err.message || 'Erro ao alterar suspensão.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleUpdatePlan = async (userId: string, plan_id: string) => {
    setActionLoadingId(userId);
    try {
      await api.updateUserPlan(userId, plan_id);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, plan_id: plan_id as any } : u))
      );
    } catch (err: any) {
      alert(err.message || 'Erro ao atualizar plano.');
    } finally {
      setActionLoadingId(null);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center text-xs text-slate-400">
        A carregar dados do Super Admin...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Administração Geral da Plataforma
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Acesso exclusivo aos administradores para monitoramento de contas, suspensão e gestão de planos.
          </p>
        </div>
      </div>

      {/* Global SaaS Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: 'Utilizadores', val: overview?.totalUsers ?? 0, icon: Users },
          { label: 'Empresas', val: overview?.totalBusinesses ?? 0, icon: Store },
          { label: 'Catálogos', val: overview?.totalCatalogs ?? 0, icon: BookOpen },
          { label: 'Produtos', val: overview?.totalProducts ?? 0, icon: Package },
          { label: 'Visualizações', val: overview?.totalViews ?? 0, icon: Eye },
          { label: 'Cliques WA', val: overview?.totalWhatsAppClicks ?? 0, icon: MessageCircle },
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>{item.label}</span>
                <Icon className="w-3.5 h-3.5" />
              </div>
              <div className="text-xl font-bold font-mono text-slate-900 tabular-nums">
                {item.val}
              </div>
            </div>
          );
        })}
      </div>

      {/* Users Management Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-base">Utilizadores Cadastrados ({users.length})</h3>
          <span className="text-xs text-slate-400">Controlo de acesso multi-tenant</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                <th className="py-3 px-4">Utilizador</th>
                <th className="py-3 px-4">Perfil</th>
                <th className="py-3 px-4">Plano</th>
                <th className="py-3 px-4 text-center">Empresas</th>
                <th className="py-3 px-4 text-center">Catálogos</th>
                <th className="py-3 px-4 text-center">Estado</th>
                <th className="py-3 px-4 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-900 block">{u.name}</span>
                    <span className="text-[11px] text-slate-400 font-mono block">{u.email}</span>
                  </td>

                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase font-mono ${
                        u.role === 'admin'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <select
                      value={u.plan_id}
                      onChange={(e) => handleUpdatePlan(u.id, e.target.value)}
                      disabled={actionLoadingId === u.id}
                      className="px-2 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono font-semibold"
                    >
                      <option value="free">FREE</option>
                      <option value="pro">PRO</option>
                      <option value="business">BUSINESS</option>
                    </select>
                  </td>

                  <td className="py-3 px-4 text-center font-mono font-bold text-slate-800">
                    {u.businessesCount ?? 0}
                  </td>

                  <td className="py-3 px-4 text-center font-mono font-bold text-slate-800">
                    {u.catalogsCount ?? 0}
                  </td>

                  <td className="py-3 px-4 text-center">
                    {u.is_suspended ? (
                      <span className="text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase">
                        Suspensa
                      </span>
                    ) : (
                      <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase">
                        Ativa
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-4 text-right">
                    {u.role !== 'admin' && (
                      <button
                        onClick={() => handleToggleSuspend(u.id)}
                        disabled={actionLoadingId === u.id}
                        className={`py-1 px-3 rounded-lg text-xs font-semibold transition-colors ${
                          u.is_suspended
                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                        }`}
                      >
                        {u.is_suspended ? 'Reativar' : 'Suspender'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
