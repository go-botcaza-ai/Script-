import React, { useState } from 'react';
import {
  DollarSign,
  Users,
  Eye,
  Video,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  TrendingUp,
  CreditCard,
  Mail,
  Shield,
  Search,
  Filter
} from 'lucide-react';
import { ContentItem, PurchaseRecord } from '../types';

interface AdminPanelProps {
  contentItems: ContentItem[];
  purchases: PurchaseRecord[];
  onAddNewContent: (newItem: ContentItem) => void;
  onDeleteItem: (id: string) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  contentItems,
  purchases,
  onAddNewContent,
  onDeleteItem
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'video' | 'course' | 'event' | 'masterclass'>('video');
  const [price, setPrice] = useState('14.99');
  const [duration, setDuration] = useState('1h 45m');
  const [accessDuration, setAccessDuration] = useState('Acceso por 48 horas');
  const [description, setDescription] = useState('');
  const [thumbnail, setThumbnail] = useState('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80');

  // Stats calculation
  const totalRevenue = purchases.reduce((sum, p) => sum + p.amount, 0);
  const totalPurchases = purchases.length;
  const activeItemsCount = contentItems.length;

  const handleCreateContent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const parsedPrice = parseFloat(price) || 9.99;
    const newItem: ContentItem = {
      id: 'ppv-' + Date.now().toString(36),
      title: title.trim(),
      description: description.trim(),
      category,
      categoryLabel: category === 'video' ? 'Video Premium' : category === 'course' ? 'Curso Especial' : category === 'event' ? 'Evento en Vivo' : 'Masterclass',
      price: parsedPrice,
      duration: duration || '1h 00m',
      rating: 5.0,
      reviewsCount: 1,
      instructor: {
        name: 'Administrador PPV',
        role: 'Creador Verificado',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80'
      },
      thumbnail: thumbnail.trim() || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
      previewVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      fullVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      fullVideoType: 'mp4',
      features: [
        'Streaming protegido sin buffer',
        'Acceso multidispositivo (Móvil, PC, Tablet)',
        'Licencia de visualización individual'
      ],
      accessDuration: accessDuration || 'Acceso ilimitado',
      releaseYear: '2026',
      resolution: '4K Ultra HD',
      tags: ['PayPerView', category]
    };

    onAddNewContent(newItem);
    setTitle('');
    setDescription('');
    setShowAddForm(false);
  };

  return (
    <div id="admin-management-panel" className="space-y-6">
      {/* Top metric overview cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              Ingresos Totales (PPV)
            </span>
            <span className="text-2xl font-black text-slate-900 mt-1 block">
              ${totalRevenue.toFixed(2)} USD
            </span>
            <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" /> Transacciones en vivo
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              Visualizaciones Pagadas
            </span>
            <span className="text-2xl font-black text-slate-900 mt-1 block">
              {totalPurchases} accesos
            </span>
            <span className="text-[11px] text-indigo-600 font-medium flex items-center gap-1 mt-1">
              <CreditCard className="w-3 h-3" /> Pasarelas activas
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              Contenido Monetizado
            </span>
            <span className="text-2xl font-black text-slate-900 mt-1 block">
              {activeItemsCount} producciones
            </span>
            <span className="text-[11px] text-amber-600 font-medium flex items-center gap-1 mt-1">
              <Shield className="w-3 h-3" /> Protección tokenizada
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Video className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Action Header and Add Form Button */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Gestión de Contenido Pay Per View
            </h3>
            <p className="text-xs text-slate-500">
              Controla qué videos se monetizan, tarifas, duraciones y niveles de acceso
            </p>
          </div>

          <button
            id="btn-toggle-add-content"
            onClick={() => setShowAddForm(!showAddForm)}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-xs transition-colors self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            {showAddForm ? 'Cancelar' : 'Monetizar Nuevo Video'}
          </button>
        </div>

        {/* Add Content Modal / Form Collapse */}
        {showAddForm && (
          <form onSubmit={handleCreateContent} className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4 text-xs animate-in fade-in">
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Video className="w-4 h-4 text-indigo-600" />
              Configurar Nuevo Activo de Video Pay Per View
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Título del Video</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ej. Curso Exclusivo de Ciberseguridad"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tipo de Formato</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                >
                  <option value="video">Video Premium Bajo Demanda</option>
                  <option value="course">Curso Completo</option>
                  <option value="event">Transmisión de Evento en Vivo</option>
                  <option value="masterclass">Masterclass</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Precio Pay Per View (USD)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="14.99"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Duración del Video</label>
                <input
                  type="text"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="Ej. 1h 45m"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Vigencia del Pase PPV</label>
                <input
                  type="text"
                  value={accessDuration}
                  onChange={(e) => setAccessDuration(e.target.value)}
                  placeholder="Ej. Acceso por 48 horas / Ilimitado"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">URL Miniatura (Thumbnail)</label>
                <input
                  type="url"
                  value={thumbnail}
                  onChange={(e) => setThumbnail(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Descripción y Detalles</label>
              <textarea
                rows={2}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explica de qué trata este contenido exclusivo..."
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-3 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
              >
                Guardar y Activar Pay Per View
              </button>
            </div>
          </form>
        )}

        {/* Existing Content Catalog Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider font-semibold">
                <th className="py-3 px-3">Contenido</th>
                <th className="py-3 px-3">Categoría</th>
                <th className="py-3 px-3">Tarifa PPV</th>
                <th className="py-3 px-3">Acceso Concedido</th>
                <th className="py-3 px-3">Protección</th>
                <th className="py-3 px-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {contentItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="w-12 h-8 rounded object-cover border border-slate-200"
                      />
                      <div>
                        <span className="font-semibold text-slate-900 block line-clamp-1">{item.title}</span>
                        <span className="text-[11px] text-slate-400">{item.duration}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium">
                      {item.categoryLabel}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-bold text-slate-900">
                    ${item.price.toFixed(2)} USD
                  </td>
                  <td className="py-3 px-3 text-slate-500">
                    {item.accessDuration}
                  </td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Token HMAC
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => onDeleteItem(item.id)}
                      title="Eliminar contenido"
                      className="text-slate-400 hover:text-rose-600 p-1 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Real-Time Purchases Audit Log */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Registro de Pagos y Emisión de Recibos
            </h3>
            <p className="text-xs text-slate-500">
              Historial de compras Pay Per View y estatus de comprobante despachado vía Gmail
            </p>
          </div>
          <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-full">
            {purchases.length} transacciones registradas
          </span>
        </div>

        {purchases.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs border border-dashed border-slate-200 rounded-xl">
            Aún no hay compras registradas en esta sesión. Desbloquea un video del catálogo para ver el flujo en tiempo real.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider font-semibold">
                  <th className="py-3 px-3">Fecha</th>
                  <th className="py-3 px-3">Usuario / Comprador</th>
                  <th className="py-3 px-3">Contenido</th>
                  <th className="py-3 px-3">Pasarela</th>
                  <th className="py-3 px-3">Monto</th>
                  <th className="py-3 px-3">Token Asignado</th>
                  <th className="py-3 px-3">Recibo Gmail</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {purchases.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-50/80">
                    <td className="py-2.5 px-3 text-slate-400 whitespace-nowrap">
                      {new Date(rec.purchaseDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-2.5 px-3 font-medium text-slate-900">
                      <div>{rec.buyerName}</div>
                      <div className="text-[11px] text-slate-400">{rec.buyerEmail}</div>
                    </td>
                    <td className="py-2.5 px-3 text-slate-800 line-clamp-1">
                      {rec.contentTitle}
                    </td>
                    <td className="py-2.5 px-3 uppercase font-bold text-slate-600">
                      {rec.paymentGateway}
                    </td>
                    <td className="py-2.5 px-3 font-bold text-emerald-600">
                      +${rec.amount.toFixed(2)}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600">
                      {rec.accessKey.substring(0, 14)}...
                    </td>
                    <td className="py-2.5 px-3">
                      {rec.receiptSentViaGmail ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                          <Mail className="w-3 h-3" /> Enviado
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400">
                          Simulado
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
