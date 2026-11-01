import React, { useState } from 'react';
import { Settings, User as UserIcon, Lock, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const SettingsView: React.FC = () => {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email] = useState(user?.email || '');
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Configurações</h2>
        <p className="text-xs sm:text-sm text-slate-500">
          Faça a gestão dos dados da sua conta e preferências de acesso.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6 space-y-6">
        <form onSubmit={handleSave} className="space-y-5">
          {savedSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Configurações guardadas com sucesso.</span>
            </div>
          )}

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <UserIcon className="w-4 h-4 text-slate-400" />
              <span>Dados do Perfil</span>
            </h3>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 block">Nome Completo</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:border-slate-800 focus:outline-hidden"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 block">Endereço de Email</label>
              <input
                type="email"
                disabled
                value={email}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-500 font-mono cursor-not-allowed"
              />
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Lock className="w-4 h-4 text-slate-400" />
              <span>Palavra-Passe</span>
            </h3>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 block">Palavra-passe Atual</label>
              <input
                type="password"
                placeholder="••••••••"
                value={currentPass}
                onChange={(e) => setCurrentPass(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:border-slate-800 focus:outline-hidden"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 block">Nova Palavra-passe</label>
              <input
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:border-slate-800 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="py-2.5 px-5 btn-catafy-gradient text-white rounded-xl text-xs font-bold transition-opacity hover:opacity-95 shadow-xs"
            >
              Guardar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
