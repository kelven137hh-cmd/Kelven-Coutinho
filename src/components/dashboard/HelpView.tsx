import React from 'react';
import { HelpCircle, MessageCircle, Instagram, QrCode, Share2, Check } from 'lucide-react';

export const HelpView: React.FC = () => {
  const tips = [
    {
      title: '1. Como colocar o link na Bio do Instagram?',
      desc: 'Copie o seu link exclusivo (/loja/:slug) em "Meus Catálogos". No seu Instagram, edite o perfil e cole o endereço no campo "Links / Site". Assim, qualquer seguidor pode abrir seu cardápio com um clique.',
      icon: Instagram,
    },
    {
      title: '2. Criar QR Code para mesas ou balcão',
      desc: 'Pode gerar um QR Code gratuito com o endereço do seu catálogo e imprimir em displays acrílicos, cavaletes de mesa ou na vitrine da loja para os clientes lerem diretamente com a câmera do smartphone.',
      icon: QrCode,
    },
    {
      title: '3. Mensagem automática de pedidos no WhatsApp',
      desc: 'Quando o visitante clica em "Enviar Pedido", o Catafy estrutura a mensagem com o nome do cliente, quantidade de itens, sabores, observações e o valor total já calculado.',
      icon: MessageCircle,
    },
    {
      title: '4. Fotografia que vende',
      desc: 'Prefira fotografias bem iluminadas com luz natural, fundo limpo e sem poluição visual. Boas imagens aumentam em até 3x a taxa de conversão do seu catálogo.',
      icon: Share2,
    },
  ];

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Ajuda & Boas Práticas</h2>
        <p className="text-xs sm:text-sm text-slate-500">
          Orientações práticas para extrair o máximo de vendas e divulgação do seu catálogo digital no Catafy.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {tips.map((tip, idx) => {
          const Icon = tip.icon;
          return (
            <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs space-y-3">
              <div className="w-9 h-9 rounded-xl bg-violet-50 text-[#6D28D9] flex items-center justify-center">
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">{tip.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{tip.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
