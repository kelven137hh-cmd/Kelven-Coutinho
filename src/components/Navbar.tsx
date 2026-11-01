import React from 'react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  onOpenAuth: (initialTab?: 'login' | 'register') => void;
  onGoToDashboard: () => void;
  onViewDemoCatalog: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAuth,
  onGoToDashboard,
}) => {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-2xs">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="/"
          className="text-lg font-bold tracking-tight text-[#17152B] whitespace-nowrap shrink-0 flex items-center gap-2.5"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#6D28D9] via-[#9333EA] to-[#FF7A00] text-white flex items-center justify-center font-extrabold text-sm shadow-xs">
            C
          </div>
          <span className="font-extrabold text-xl tracking-tight text-[#17152B]">
            Catafy
          </span>
        </a>

        {/* Zone 2: 4-5 single-line text links */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-[#77758A]">
          <a href="#como-funciona" className="hover:text-[#6D28D9] transition-colors whitespace-nowrap shrink-0">
            Como Funciona
          </a>
          <a href="#modelos" className="hover:text-[#6D28D9] transition-colors whitespace-nowrap shrink-0">
            Modelos
          </a>
          <a href="#segmentos" className="hover:text-[#6D28D9] transition-colors whitespace-nowrap shrink-0">
            Segmentos
          </a>
          <a href="#precos" className="hover:text-[#6D28D9] transition-colors whitespace-nowrap shrink-0">
            Preços
          </a>
          <a href="#faq" className="hover:text-[#6D28D9] transition-colors whitespace-nowrap shrink-0">
            Perguntas
          </a>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          {user ? (
            <button
              onClick={onGoToDashboard}
              className="px-4 py-2 text-xs font-bold btn-catafy-gradient rounded-xl shadow-xs cursor-pointer whitespace-nowrap shrink-0"
            >
              Abrir Dashboard
            </button>
          ) : (
            <>
              <button
                onClick={() => onOpenAuth('login')}
                className="hidden sm:inline-block text-xs font-semibold text-[#17152B] hover:text-[#6D28D9] transition-colors px-2 py-1.5 whitespace-nowrap shrink-0 cursor-pointer"
              >
                Iniciar Sessão
              </button>
              <button
                onClick={() => onOpenAuth('register')}
                className="px-4 py-2 text-xs font-bold btn-catafy-gradient rounded-xl shadow-xs cursor-pointer whitespace-nowrap shrink-0"
              >
                Criar Catálogo Grátis
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
