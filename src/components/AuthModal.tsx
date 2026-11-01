import React, { useState } from 'react';
import { X, Check, ArrowRight, Shield, Sparkles, Lock, Mail, User as UserIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';

interface AuthModalProps {
  isOpen: boolean;
  initialTab?: 'login' | 'register';
  onClose: () => void;
  onSuccess: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialTab = 'register',
  onClose,
  onSuccess,
}) => {
  const { login, register, quickLoginDemo } = useAuth();
  const [tab, setTab] = useState<'login' | 'register' | 'recover'>(initialTab);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recoverSuccess, setRecoverSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setRecoverSuccess(null);

    const cleanEmail = email.trim().toLowerCase();

    if (tab === 'register') {
      if (!name.trim()) {
        setError('Por favor introduza o seu nome completo.');
        return;
      }
      if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
        setError('Por favor introduza um endereço de email válido.');
        return;
      }
      if (!password || password.length < 6) {
        setError('A palavra-passe deve conter pelo menos 6 caracteres.');
        return;
      }
      if (password !== confirmPassword) {
        setError('As palavras-passe não coincidem. Verifique a confirmação.');
        return;
      }

      setLoading(true);
      try {
        await register(name.trim(), cleanEmail, password, confirmPassword);
        onSuccess();
      } catch (err: any) {
        setError(err.message || 'Erro ao criar conta. Tente novamente.');
      } finally {
        setLoading(false);
      }
    } else if (tab === 'login') {
      if (!cleanEmail) {
        setError('Por favor introduza o seu endereço de email.');
        return;
      }
      if (!password) {
        setError('Por favor introduza a sua palavra-passe.');
        return;
      }

      setLoading(true);
      try {
        await login(cleanEmail, password);
        onSuccess();
      } catch (err: any) {
        setError(err.message || 'Credenciais inválidas. Verifique o email e a palavra-passe.');
      } finally {
        setLoading(false);
      }
    } else if (tab === 'recover') {
      if (!cleanEmail) {
        setError('Por favor introduza o seu endereço de email.');
        return;
      }

      setLoading(true);
      try {
        const res = await api.recoverPassword(cleanEmail);
        setRecoverSuccess(res.message);
      } catch (err: any) {
        setError(err.message || 'Erro ao solicitar recuperação.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDemoAccess = async (type: 'merchant' | 'admin') => {
    setLoading(true);
    setError(null);
    try {
      await quickLoginDemo(type);
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Erro ao entrar na conta demo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#6D28D9] via-[#9333EA] to-[#FF7A00] text-white flex items-center justify-center font-bold text-sm shadow-xs">
              C
            </div>
            <div>
              <span className="font-extrabold text-[#17152B] tracking-tight text-base block leading-none">
                Catafy
              </span>
              <span className="text-[10px] text-[#77758A] font-medium">Plataforma SaaS</span>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="p-1.5 rounded-xl text-slate-400 hover:text-[#17152B] hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        {tab !== 'recover' && (
          <div className="flex p-1.5 bg-[#F8F7FC] mx-5 mt-5 rounded-2xl text-xs font-semibold border border-slate-100">
            <button
              type="button"
              onClick={() => {
                setTab('register');
                setError(null);
              }}
              className={`flex-1 py-2.5 rounded-xl transition-all ${
                tab === 'register'
                  ? 'bg-white text-[#6D28D9] shadow-xs font-bold'
                  : 'text-[#77758A] hover:text-[#17152B]'
              }`}
            >
              Criar Conta Grátis
            </button>
            <button
              type="button"
              onClick={() => {
                setTab('login');
                setError(null);
              }}
              className={`flex-1 py-2.5 rounded-xl transition-all ${
                tab === 'login'
                  ? 'bg-white text-[#6D28D9] shadow-xs font-bold'
                  : 'text-[#77758A] hover:text-[#17152B]'
              }`}
            >
              Iniciar Sessão
            </button>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <h3 className="font-bold text-[#17152B] text-xl tracking-tight">
              {tab === 'register' && 'Crie o seu catálogo no Catafy'}
              {tab === 'login' && 'Aceda à sua conta'}
              {tab === 'recover' && 'Recuperar palavra-passe'}
            </h3>
            <p className="text-xs text-[#77758A] mt-1 leading-relaxed">
              {tab === 'register' && 'Crie sua conta em segundos. Acesso imediato ao dashboard.'}
              {tab === 'login' && 'Introduza suas credenciais para gerir os seus negócios e produtos.'}
              {tab === 'recover' && 'Introduza o seu email para receber instruções de acesso.'}
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-start gap-2">
              <span className="font-bold shrink-0">Atenção:</span>
              <span>{error}</span>
            </div>
          )}

          {recoverSuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{recoverSuccess}</span>
            </div>
          )}

          {tab === 'register' && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#17152B] block">
                Nome Completo *
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="Ex: Kelven Silva"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-[#F8F7FC] border border-slate-200 rounded-xl focus:border-[#6D28D9] focus:outline-hidden text-[#17152B]"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#17152B] block">
              Endereço de Email *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="seuemail@empresa.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-[#F8F7FC] border border-slate-200 rounded-xl focus:border-[#6D28D9] focus:outline-hidden text-[#17152B]"
              />
            </div>
          </div>

          {tab !== 'recover' && (
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-[#17152B] block">
                  Palavra-passe *
                </label>
                {tab === 'login' && (
                  <button
                    type="button"
                    onClick={() => {
                      setTab('recover');
                      setError(null);
                    }}
                    className="text-[11px] text-[#6D28D9] hover:underline font-medium"
                  >
                    Esqueceu?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="Mínimo 6 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-[#F8F7FC] border border-slate-200 rounded-xl focus:border-[#6D28D9] focus:outline-hidden text-[#17152B]"
                />
              </div>
            </div>
          )}

          {tab === 'register' && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#17152B] block">
                Confirmar Palavra-passe *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="Repita a palavra-passe"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-[#F8F7FC] border border-slate-200 rounded-xl focus:border-[#6D28D9] focus:outline-hidden text-[#17152B]"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-xl btn-catafy-gradient text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            {loading ? (
              <span>A verificar dados...</span>
            ) : (
              <>
                <span>
                  {tab === 'register' && 'Criar Conta e Entrar no Dashboard'}
                  {tab === 'login' && 'Entrar na Plataforma'}
                  {tab === 'recover' && 'Enviar Instruções de Recuperação'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {tab === 'recover' && (
            <button
              type="button"
              onClick={() => setTab('login')}
              className="w-full py-2 text-xs font-semibold text-[#6D28D9] hover:underline block text-center"
            >
              ← Voltar ao Ecrã de Login
            </button>
          )}

          {/* Quick Demo Access Bar */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#77758A] block text-center">
              Acesso Rápido de Teste (1 Clique)
            </span>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => handleDemoAccess('merchant')}
                className="p-2.5 rounded-xl bg-purple-50 hover:bg-purple-100/70 border border-purple-200 text-left transition-colors cursor-pointer"
              >
                <span className="font-bold text-xs text-[#6D28D9] block">Conta Empresário</span>
                <span className="text-[10px] text-[#77758A] block truncate">demo@catafy.com</span>
              </button>
              <button
                type="button"
                onClick={() => handleDemoAccess('admin')}
                className="p-2.5 rounded-xl bg-amber-50/70 hover:bg-amber-100/70 border border-amber-200 text-left transition-colors cursor-pointer"
              >
                <span className="font-bold text-xs text-amber-900 block">Super Admin</span>
                <span className="text-[10px] text-amber-700 block truncate">admin@catafy.com</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
