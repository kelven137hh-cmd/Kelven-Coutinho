import React, { useState } from 'react';
import { Lock, Mail, User as UserIcon, ArrowRight, Shield, Check, Sparkles, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';

interface AuthPageProps {
  initialMode?: 'login' | 'register' | 'recover';
  redirectMessage?: string | null;
  onSuccess: () => void;
  onGoHome: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  initialMode = 'login',
  redirectMessage,
  onSuccess,
  onGoHome,
}) => {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<'login' | 'register' | 'recover'>(initialMode);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recoverSuccess, setRecoverSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setRecoverSuccess(null);

    const cleanEmail = email.trim().toLowerCase();

    if (mode === 'register') {
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
        setError('As palavras-passe introduzidas não coincidem.');
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
    } else if (mode === 'login') {
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
    } else if (mode === 'recover') {
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

  return (
    <div className="min-h-screen bg-[#F8F7FC] flex flex-col justify-between selection:bg-[#6D28D9]/20 selection:text-[#6D28D9]">
      {/* Top Navbar Header */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-slate-200/70 bg-white/80 backdrop-blur-md">
        <button
          onClick={onGoHome}
          className="flex items-center gap-2.5 text-slate-800 hover:opacity-90 transition-opacity"
        >
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#6D28D9] via-[#9333EA] to-[#FF7A00] text-white flex items-center justify-center font-extrabold text-base shadow-xs">
            C
          </div>
          <div className="text-left">
            <span className="font-extrabold text-xl tracking-tight text-[#17152B] leading-none block">
              Catafy
            </span>
            <span className="text-[10px] text-[#77758A] font-medium leading-tight">
              Plataforma SaaS de Catálogos
            </span>
          </div>
        </button>

        <button
          onClick={onGoHome}
          className="text-xs font-semibold text-[#77758A] hover:text-[#6D28D9] flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Voltar ao Início</span>
        </button>
      </header>

      {/* Main Form Center Area */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-6">
        <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200/80 shadow-xl shadow-purple-500/5 p-6 sm:p-8 space-y-6">
          {/* Redirect Alert Notice if unauthenticated attempt */}
          {redirectMessage && (
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium flex items-center gap-2.5">
              <Shield className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{redirectMessage}</span>
            </div>
          )}

          {/* Mode Tabs */}
          {mode !== 'recover' && (
            <div className="flex p-1 bg-[#F8F7FC] rounded-2xl border border-slate-200 text-xs font-bold">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError(null);
                  setRecoverSuccess(null);
                }}
                className={`flex-1 py-2.5 rounded-xl transition-all cursor-pointer ${
                  mode === 'login'
                    ? 'bg-white text-[#6D28D9] shadow-xs'
                    : 'text-[#77758A] hover:text-[#17152B]'
                }`}
              >
                Iniciar Sessão
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setError(null);
                  setRecoverSuccess(null);
                }}
                className={`flex-1 py-2.5 rounded-xl transition-all cursor-pointer ${
                  mode === 'register'
                    ? 'bg-white text-[#6D28D9] shadow-xs'
                    : 'text-[#77758A] hover:text-[#17152B]'
                }`}
              >
                Criar Conta Grátis
              </button>
            </div>
          )}

          {/* Title & Subtitle */}
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-black text-[#17152B] tracking-tight">
              {mode === 'login' && 'Bem-vindo de volta!'}
              {mode === 'register' && 'Crie o seu catálogo hoje'}
              {mode === 'recover' && 'Recuperar Palavra-passe'}
            </h1>
            <p className="text-xs text-[#77758A]">
              {mode === 'login' && 'Introduza os seus dados para aceder ao painel de gestão.'}
              {mode === 'register' && 'Registe-se em segundos para criar e publicar o seu catálogo digital.'}
              {mode === 'recover' && 'Introduza o seu email para receber instruções de recuperação.'}
            </p>
          </div>

          {/* Alerts */}
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium leading-relaxed">
              {error}
            </div>
          )}

          {recoverSuccess && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium leading-relaxed flex items-start gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{recoverSuccess}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#17152B] block">
                  Nome Completo
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-[#77758A] absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="Ex: Carlos Silva"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-[#6D28D9] focus:outline-hidden transition-colors font-medium text-[#17152B]"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#17152B] block">
                Endereço de Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#77758A] absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-[#6D28D9] focus:outline-hidden transition-colors font-medium text-[#17152B]"
                />
              </div>
            </div>

            {mode !== 'recover' && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#17152B] block">
                    Palavra-passe
                  </label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => {
                        setMode('recover');
                        setError(null);
                        setRecoverSuccess(null);
                      }}
                      className="text-[11px] font-semibold text-[#6D28D9] hover:underline cursor-pointer"
                    >
                      Esqueceu-se da palavra-passe?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#77758A] absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-[#6D28D9] focus:outline-hidden transition-colors font-medium text-[#17152B]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {mode === 'register' && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#17152B] block">
                  Confirmar Palavra-passe
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#77758A] absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-[#6D28D9] focus:outline-hidden transition-colors font-medium text-[#17152B]"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 btn-catafy-gradient text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm hover:opacity-95 transition-opacity cursor-pointer disabled:opacity-50 mt-2"
            >
              {loading ? (
                <span>A processar...</span>
              ) : mode === 'login' ? (
                <>
                  <span>Entrar no Painel</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : mode === 'register' ? (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Criar Minha Conta Grátis</span>
                </>
              ) : (
                <>
                  <span>Enviar Instruções</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer switches */}
          <div className="pt-2 text-center text-xs text-[#77758A]">
            {mode === 'login' ? (
              <p>
                Ainda não tem conta no Catafy?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setError(null);
                  }}
                  className="font-bold text-[#6D28D9] hover:underline cursor-pointer"
                >
                  Criar conta grátis
                </button>
              </p>
            ) : mode === 'register' ? (
              <p>
                Já tem uma conta registada?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setError(null);
                  }}
                  className="font-bold text-[#6D28D9] hover:underline cursor-pointer"
                >
                  Iniciar sessão
                </button>
              </p>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError(null);
                }}
                className="font-bold text-[#6D28D9] hover:underline cursor-pointer"
              >
                ← Voltar para Iniciar Sessão
              </button>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-xs text-slate-400 border-t border-slate-200/60 bg-white">
        <p>
          Catafy · Plataforma de Gestão e Criação de Catálogos Digitais · Todos os direitos reservados.
        </p>
      </footer>
    </div>
  );
};
