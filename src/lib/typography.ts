import { CatalogTypography } from '../types';

export interface TypographyPresetConfig {
  id: CatalogTypography;
  name: string;
  badge: string;
  titleFont: string;
  bodyFont: string;
  priceFont: string;
  titleFamily: string; // CSS font-family style
  bodyFamily: string;  // CSS font-family style
  priceFamily: string; // CSS font-family style
  sampleHeading: string;
  sampleBody: string;
  description: string;
}

export const TYPOGRAPHY_PRESETS: Record<CatalogTypography, TypographyPresetConfig> = {
  moderna: {
    id: 'moderna',
    name: 'Moderna',
    badge: 'Manrope + Inter',
    titleFont: 'Manrope',
    bodyFont: 'Inter',
    priceFont: 'Manrope',
    titleFamily: "'Manrope', sans-serif",
    bodyFamily: "'Inter', sans-serif",
    priceFamily: "'Manrope', sans-serif",
    sampleHeading: 'Hambúrguer Artesanal Trufado',
    sampleBody: 'Blend nobre 180g, queijo cheddar inglês, cebola caramelizada e maionese trufada.',
    description: 'Títulos geométricos marcantes e corpo altamente legível. Excelente para gastronomia e produtos modernos.',
  },
  elegante: {
    id: 'elegante',
    name: 'Elegante',
    badge: 'Playfair Display + DM Sans',
    titleFont: 'Playfair Display',
    bodyFont: 'DM Sans',
    priceFont: 'DM Sans',
    titleFamily: "'Playfair Display', serif",
    bodyFamily: "'DM Sans', sans-serif",
    priceFamily: "'DM Sans', sans-serif",
    sampleHeading: 'Vestido Seda Noir & Joias',
    sampleBody: 'Corte refinado com acabamento artesanal de alfaiataria, tecido fluido e toque aveludado.',
    description: 'Tipografia serifada clássica com apelo de revista de luxo. Ideal para moda, joalharia, vinhos e beleza.',
  },
  minimalista: {
    id: 'minimalista',
    name: 'Minimalista',
    badge: 'Inter + Inter',
    titleFont: 'Inter',
    bodyFont: 'Inter',
    priceFont: 'Inter',
    titleFamily: "'Inter', sans-serif",
    bodyFamily: "'Inter', sans-serif",
    priceFamily: "'Inter', sans-serif",
    sampleHeading: 'Vaso Cerâmica Escandinavo',
    sampleBody: 'Design escandinavo em argila pura tratada, linhas puras e acabamento fosco sem verniz.',
    description: 'Estética limpa, neutra e sem ruído visual. Foco absoluto no produto e na fotografia.',
  },
  contemporanea: {
    id: 'contemporanea',
    name: 'Contemporânea',
    badge: 'Plus Jakarta Sans + Inter',
    titleFont: 'Plus Jakarta Sans',
    bodyFont: 'Inter',
    priceFont: 'Plus Jakarta Sans',
    titleFamily: "'Plus Jakarta Sans', sans-serif",
    bodyFamily: "'Inter', sans-serif",
    priceFamily: "'Plus Jakarta Sans', sans-serif",
    sampleHeading: 'Fone Pro Wireless ANC',
    sampleBody: 'Cancelamento ativo de ruído, bateria de 40h e conexão multiponto Bluetooth 5.3 com áudio Hi-Res.',
    description: 'Visual moderno, tecnológico e equilibrado. Perfeito para eletrónicos, cosméticos e serviços.',
  },
  comercial: {
    id: 'comercial',
    name: 'Comercial',
    badge: 'Poppins + DM Sans',
    titleFont: 'Poppins',
    bodyFont: 'DM Sans',
    priceFont: 'Poppins',
    titleFamily: "'Poppins', sans-serif",
    bodyFamily: "'DM Sans', sans-serif",
    priceFamily: "'Poppins', sans-serif",
    sampleHeading: 'Super Cesta Mercado Seleção',
    sampleBody: 'Produtos frescos selecionados com embalagem reforçada e entrega ultra-rápida no mesmo dia.',
    description: 'Títulos expressivos e comerciais com números de fácil leitura rápida para catálogos de alto volume.',
  },
};

export const TYPOGRAPHY_PRESETS_LIST: TypographyPresetConfig[] = [
  TYPOGRAPHY_PRESETS.moderna,
  TYPOGRAPHY_PRESETS.elegante,
  TYPOGRAPHY_PRESETS.minimalista,
  TYPOGRAPHY_PRESETS.contemporanea,
  TYPOGRAPHY_PRESETS.comercial,
];

export const getTypographyConfig = (typography?: string | null): TypographyPresetConfig => {
  if (typography && typography in TYPOGRAPHY_PRESETS) {
    return TYPOGRAPHY_PRESETS[typography as CatalogTypography];
  }
  // Fallbacks if someone saved legacy values
  if (typography?.toLowerCase().includes('playfair')) return TYPOGRAPHY_PRESETS.elegante;
  if (typography?.toLowerCase().includes('jakarta')) return TYPOGRAPHY_PRESETS.contemporanea;
  if (typography?.toLowerCase().includes('poppins')) return TYPOGRAPHY_PRESETS.comercial;
  if (typography?.toLowerCase().includes('manrope')) return TYPOGRAPHY_PRESETS.moderna;
  if (typography?.toLowerCase().includes('inter')) return TYPOGRAPHY_PRESETS.minimalista;
  return TYPOGRAPHY_PRESETS.moderna;
};
