import React, { useState, useRef } from 'react';
import { Upload, X, RefreshCw, Image as ImageIcon, Check, AlertCircle, Link as LinkIcon } from 'lucide-react';
import { api } from '../../lib/api';

interface ImageUploaderProps {
  label: string;
  value?: string;
  onChange: (url: string) => void;
  aspectRatio?: '1:1' | '16:9' | '4:3' | 'banner' | 'square' | 'auto';
  placeholder?: string;
  helperText?: string;
  className?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  label,
  value,
  onChange,
  aspectRatio = 'auto',
  helperText,
  className = '',
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showUrlFallback, setShowUrlFallback] = useState(false);
  const [urlInput, setUrlInput] = useState(value || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Compress image on client using HTML5 Canvas to keep uploads under ~300KB
  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const maxDim = 1200;
          let width = img.width;
          let height = img.height;

          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(event.target?.result as string);
            return;
          }
          ctx.drawImage(img, 0, 0, width, height);

          // Try webp with 0.85 quality, fallback to jpeg
          try {
            const dataUrl = canvas.toDataURL('image/webp', 0.85);
            resolve(dataUrl);
          } catch {
            const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
            resolve(dataUrl);
          }
        };
        img.onerror = () => reject(new Error('Erro ao processar imagem.'));
      };
      reader.onerror = () => reject(new Error('Falha ao ler o ficheiro selecionado.'));
    });
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      setError('Formato não suportado. Por favor escolha um ficheiro JPG, PNG ou WEBP.');
      return;
    }

    // Limit to 15MB raw size
    if (file.size > 15 * 1024 * 1024) {
      setError('A imagem é muito grande. Escolha uma foto de até 15MB.');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const compressedDataUrl = await compressImage(file);
      const res = await api.uploadImage(compressedDataUrl, file.name);
      onChange(res.url);
      setUrlInput(res.url);
    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err.message || 'Erro ao carregar a imagem. Tente novamente.');
    } finally {
      setUploading(false);
      // Reset input value so same file can be re-selected if desired
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = () => {
    onChange('');
    setUrlInput('');
    setError(null);
  };

  const handleUrlApply = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim());
      setShowUrlFallback(false);
    }
  };

  const getAspectClass = () => {
    switch (aspectRatio) {
      case '1:1':
      case 'square':
        return 'aspect-square max-w-[140px]';
      case '16:9':
        return 'aspect-16/9 w-full max-h-48';
      case 'banner':
        return 'aspect-[3/1] w-full max-h-48';
      case '4:3':
        return 'aspect-4/3 w-full max-h-52';
      default:
        return 'h-40 w-full';
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-[#17152B] block">
          {label}
        </label>
        <button
          type="button"
          onClick={() => setShowUrlFallback(!showUrlFallback)}
          className="text-[11px] text-[#77758A] hover:text-[#6D28D9] flex items-center gap-1 transition-colors"
        >
          <LinkIcon className="w-3 h-3" />
          <span>{showUrlFallback ? 'Ocultar URL' : 'Ou colar URL'}</span>
        </button>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/jpg"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* URL Fallback Bar */}
      {showUrlFallback && (
        <div className="flex items-center gap-2 p-2 bg-[#F8F7FC] border border-slate-200 rounded-xl">
          <input
            type="url"
            placeholder="https://exemplo.com/imagem.jpg"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:border-[#6D28D9]"
          />
          <button
            type="button"
            onClick={handleUrlApply}
            className="py-1.5 px-3 rounded-lg bg-[#6D28D9] text-white text-xs font-semibold hover:bg-[#5b21b6]"
          >
            Aplicar
          </button>
        </div>
      )}

      {/* Error Notice */}
      {error && (
        <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Upload Box */}
      {value ? (
        // Preview State with Actions
        <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-white group shadow-2xs">
          <div className={`${getAspectClass()} relative bg-slate-100 flex items-center justify-center overflow-hidden`}>
            <img
              src={value}
              alt={label}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
              onError={(e) => {
                // If broken, show placeholder
                (e.target as HTMLElement).style.opacity = '0.3';
              }}
            />
            {uploading && (
              <div className="absolute inset-0 bg-black/50 backdrop-blur-xs flex flex-col items-center justify-center text-white gap-2">
                <RefreshCw className="w-6 h-6 animate-spin text-white" />
                <span className="text-xs font-semibold">A carregar imagem...</span>
              </div>
            )}
          </div>

          {/* Action Overlay */}
          <div className="p-3 bg-white border-t border-slate-100 flex items-center justify-between gap-2">
            <span className="text-xs text-emerald-700 font-medium flex items-center gap-1">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>Imagem carregada</span>
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={uploading}
                onClick={() => fileInputRef.current?.click()}
                className="py-1.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-[#17152B] flex items-center gap-1.5 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                <span>Substituir</span>
              </button>

              <button
                type="button"
                disabled={uploading}
                onClick={handleRemove}
                className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                title="Remover imagem"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        // Empty State: Click to Upload
        <div
          onClick={() => !uploading && fileInputRef.current?.click()}
          className={`border-2 border-dashed border-slate-300 hover:border-[#6D28D9] bg-white hover:bg-purple-50/20 rounded-2xl p-5 sm:p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2.5 group ${
            uploading ? 'opacity-70 pointer-events-none' : ''
          }`}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2 py-4">
              <RefreshCw className="w-8 h-8 animate-spin text-[#6D28D9]" />
              <span className="text-xs font-semibold text-[#17152B]">
                A otimizar e guardar imagem...
              </span>
            </div>
          ) : (
            <>
              <div className="w-12 h-12 rounded-2xl bg-[#F8F7FC] group-hover:bg-purple-100/60 border border-slate-200 group-hover:border-purple-200 flex items-center justify-center text-[#6D28D9] transition-colors shadow-2xs">
                <Upload className="w-5 h-5" />
              </div>

              <div>
                <span className="text-xs font-bold text-[#17152B] block group-hover:text-[#6D28D9] transition-colors">
                  Carregar imagem
                </span>
                <span className="text-[11px] text-[#77758A] mt-0.5 block">
                  Toque para escolher da galeria do telemóvel ou computador
                </span>
              </div>

              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">
                JPG, PNG ou WEBP (Otimização automática)
              </span>
            </>
          )}
        </div>
      )}

      {helperText && (
        <p className="text-[11px] text-[#77758A]">{helperText}</p>
      )}
    </div>
  );
};
