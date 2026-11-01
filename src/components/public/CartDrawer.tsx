import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, MessageCircle, ShoppingBag, ArrowRight } from 'lucide-react';
import { CartItem, Business, Catalog } from '../../types';
import { api } from '../../lib/api';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  business: Business;
  catalog: Catalog;
  onUpdateQuantity: (index: number, newQty: number) => void;
  onRemoveItem: (index: number) => void;
  onClearCart: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  business,
  catalog,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Dinheiro / Multibanco');

  if (!isOpen) return null;

  const totalAmount = items.reduce((acc, item) => {
    const unitPrice = item.selectedSize
      ? item.selectedSize.price
      : item.product.promo_price ?? item.product.price;
    return acc + unitPrice * item.quantity;
  }, 0);

  const handleCheckoutWhatsApp = () => {
    const rawPhone = (catalog.business?.whatsapp || business.whatsapp || '').replace(/[^\d+]/g, '');
    if (!rawPhone) {
      alert('Número de WhatsApp não configurado para esta empresa.');
      return;
    }

    // Build friendly message
    let message = `*NOVO PEDIDO — ${business.name}*\n`;
    message += `──────────────────\n`;

    items.forEach((item, idx) => {
      const unitPrice = item.selectedSize
        ? item.selectedSize.price
        : item.product.promo_price ?? item.product.price;
      const itemTotal = (unitPrice * item.quantity).toFixed(2);

      let itemLine = `${idx + 1}. *${item.quantity}x* ${item.product.name}`;
      if (item.selectedSize) itemLine += ` (${item.selectedSize.name})`;
      if (item.selectedColor) itemLine += ` - Cor: ${item.selectedColor}`;
      if (item.selectedClothingSize) itemLine += ` - Tam: ${item.selectedClothingSize}`;
      itemLine += ` — ${catalog.currency} ${itemTotal}`;

      message += `${itemLine}\n`;
      if (item.notes) {
        message += `   ↳ _Obs: ${item.notes}_\n`;
      }
    });

    message += `──────────────────\n`;
    message += `*Total: ${catalog.currency} ${totalAmount.toFixed(2)}*\n\n`;

    if (customerName.trim()) {
      message += `👤 *Cliente:* ${customerName.trim()}\n`;
    }
    if (customerAddress.trim()) {
      message += `📍 *Entrega/Mesa:* ${customerAddress.trim()}\n`;
    }
    if (paymentMethod) {
      message += `💳 *Pagamento:* ${paymentMethod}\n`;
    }

    message += `\n_Pedido enviado através do catálogo digital ${catalog.title}_`;

    // Track click in background
    api.trackWhatsAppClick(
      catalog.id,
      null,
      `Pedido múltiplo (${items.length} itens)`,
      message
    );

    // Clean phone number for WhatsApp wa.me link
    const cleanPhone = rawPhone.replace('+', '');
    const encoded = encodeURIComponent(message);
    const waUrl = `https://wa.me/${cleanPhone}?text=${encoded}`;

    window.open(waUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-white h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Seu Pedido</h3>
              <p className="text-xs text-slate-500 font-mono">
                {items.reduce((acc, i) => acc + i.quantity, 0)} {items.length === 1 ? 'item' : 'itens'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button
                type="button"
                onClick={onClearCart}
                className="text-xs text-slate-400 hover:text-rose-600 transition-colors px-2 py-1"
              >
                Limpar
              </button>
            )}
            <button
              onClick={onClose}
              aria-label="Fechar"
              className="w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-600 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 divide-y divide-slate-100">
          {items.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6">
              <div className="w-16 h-16 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300 mb-3">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <p className="font-medium text-slate-700 text-sm">Sua sacola está vazia</p>
              <p className="text-xs text-slate-400 mt-1 max-w-xs">
                Navegue pelo catálogo e adicione produtos para fazer seu pedido pelo WhatsApp.
              </p>
            </div>
          ) : (
            items.map((item, index) => {
              const unitPrice = item.selectedSize
                ? item.selectedSize.price
                : item.product.promo_price ?? item.product.price;
              const subtotal = (unitPrice * item.quantity).toFixed(2);

              return (
                <div key={index} className="pt-3 first:pt-0 flex gap-3 items-start">
                  {item.product.image_url ? (
                    <img
                      src={item.product.image_url}
                      alt={item.product.name}
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 rounded-xl object-cover bg-slate-100 shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 shrink-0 text-xs">
                      Foto
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-1">
                      <h4 className="font-semibold text-slate-900 text-sm truncate">
                        {item.product.name}
                      </h4>
                      <button
                        type="button"
                        onClick={() => onRemoveItem(index)}
                        className="text-slate-300 hover:text-rose-500 transition-colors p-1 -mr-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-xs text-slate-500 space-y-0.5 mt-0.5">
                      {item.selectedSize && <div>Tamanho: {item.selectedSize.name}</div>}
                      {item.selectedColor && <div>Cor: {item.selectedColor}</div>}
                      {item.selectedClothingSize && <div>Tam: {item.selectedClothingSize}</div>}
                      {item.notes && <div className="italic text-slate-400 truncate">"{item.notes}"</div>}
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white">
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(index, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-slate-50"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-xs font-mono font-bold text-slate-800">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(index, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-slate-50"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="font-mono text-sm font-bold text-slate-900 tabular-nums">
                        {catalog.currency} {subtotal}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Delivery / Notes Inputs */}
        {items.length > 0 && (
          <div className="p-4 bg-slate-50/70 border-t border-slate-100 space-y-2.5 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Seu Nome</label>
              <input
                type="text"
                placeholder="Ex: Ana Silva"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:border-slate-800 text-slate-800"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Endereço de Entrega / Mesa / Retirada
              </label>
              <input
                type="text"
                placeholder="Ex: Rua Direita 12, 2º Esq ou Mesa 4"
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:border-slate-800 text-slate-800"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Forma de Pagamento</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:border-slate-800 text-slate-800"
              >
                <option value="Dinheiro / Troco">Dinheiro / Troco</option>
                <option value="Multibanco / Cartão na Entrega">Multibanco / Cartão na Entrega</option>
                <option value="MB Way">MB Way</option>
                <option value="Pix / Transferência">Pix / Transferência</option>
                <option value="Pagar no Balcão">Pagar no Balcão</option>
              </select>
            </div>
          </div>
        )}

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-slate-200 bg-white space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600 font-medium">Subtotal</span>
              <span className="font-mono text-xl font-bold text-slate-900 tabular-nums">
                {catalog.currency} {totalAmount.toFixed(2)}
              </span>
            </div>

            <button
              type="button"
              onClick={handleCheckoutWhatsApp}
              style={{ backgroundColor: catalog.primary_color || '#16a34a' }}
              className="w-full py-3.5 px-4 rounded-xl text-white font-bold text-sm hover:opacity-95 shadow-md flex items-center justify-center gap-2 transition-transform active:scale-[0.99]"
            >
              <MessageCircle className="w-5 h-5 shrink-0" />
              <span>Enviar Pedido pelo WhatsApp</span>
              <ArrowRight className="w-4 h-4 ml-auto" />
            </button>
            <p className="text-[11px] text-center text-slate-400">
              O pedido será formatado e enviado diretamente para a empresa.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
