import React, { useState, useRef } from 'react';
import {
  X,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Mail,
  Clock,
  Sparkles,
  RotateCcw,
  Copy,
  Check
} from 'lucide-react';
import { ContentItem, PurchaseRecord } from '../types';

interface VideoPlayerModalProps {
  item: ContentItem | null;
  isOpen: boolean;
  onClose: () => void;
  purchaseRecord?: PurchaseRecord;
  isPurchased: boolean;
  onInitiateCheckout: (item: ContentItem) => void;
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({
  item,
  isOpen,
  onClose,
  purchaseRecord,
  isPurchased,
  onInitiateCheckout
}) => {
  if (!isOpen || !item) return null;

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [copiedToken, setCopiedToken] = useState(false);

  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const handleCopyKey = () => {
    if (purchaseRecord?.accessKey) {
      navigator.clipboard.writeText(purchaseRecord.accessKey);
      setCopiedToken(true);
      setTimeout(() => setCopiedToken(false), 2000);
    }
  };

  // Determine video URL: full if purchased, trailer/preview if not
  const activeVideoSrc = isPurchased ? item.fullVideoUrl : item.previewVideoUrl;

  return (
    <div
      id="player-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in"
    >
      <div
        id="player-modal-container"
        className="bg-slate-900 text-white w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col max-h-[95vh]"
      >
        {/* Modal Top Bar */}
        <div className="px-5 py-3.5 bg-slate-950 flex items-center justify-between border-b border-slate-800/80">
          <div className="flex items-center gap-2.5 min-w-0">
            {isPurchased ? (
              <span className="flex items-center gap-1.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold px-2.5 py-1 rounded-full">
                <ShieldCheck className="w-3.5 h-3.5" />
                Acceso Pay Per View Activo
              </span>
            ) : (
              <span className="flex items-center gap-1.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold px-2.5 py-1 rounded-full">
                <Lock className="w-3.5 h-3.5" />
                Vista Previa (Trailer)
              </span>
            )}
            <h3 className="text-sm font-semibold truncate text-slate-200">
              {item.title}
            </h3>
          </div>

          <button
            id="btn-close-player"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-full hover:bg-slate-800 transition-colors ml-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Stage Area */}
        <div className="relative aspect-video w-full bg-black flex items-center justify-center overflow-hidden">
          <video
            ref={videoRef}
            src={activeVideoSrc}
            autoPlay
            controls
            playsInline
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            className="w-full h-full object-contain"
          />

          {/* Locked Overlay teaser when in preview mode */}
          {!isPurchased && (
            <div className="absolute top-3 right-3 z-20 bg-slate-950/80 backdrop-blur-md border border-slate-700/60 rounded-xl p-3 max-w-xs text-left shadow-lg hidden sm:block">
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Contenido Bloqueado
                </span>
                <span className="text-xs font-black text-white">${item.price.toFixed(2)} USD</span>
              </div>
              <p className="text-[11px] text-slate-300 mb-2.5">
                Estás viendo el tráiler oficial. Desbloquea la versión completa en 4K.
              </p>
              <button
                id="btn-teaser-unlock"
                onClick={() => {
                  onClose();
                  onInitiateCheckout(item);
                }}
                className="w-full py-1.5 px-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5" />
                Pagar para ver completo
              </button>
            </div>
          )}
        </div>

        {/* Content details and access credentials banner */}
        <div className="p-5 bg-slate-900 overflow-y-auto space-y-4">
          {/* Purchase details badge if unlocked */}
          {isPurchased && purchaseRecord && (
            <div className="bg-emerald-950/40 border border-emerald-800/60 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Transacción verificada vía {purchaseRecord.paymentGateway.toUpperCase()}
                </div>
                <p className="text-slate-300 text-[11px]">
                  Vigencia: <span className="font-semibold text-white">{item.accessDuration}</span> •
                  Comprador: <span className="text-slate-200">{purchaseRecord.buyerEmail}</span>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 flex items-center gap-2">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400">Token:</span>
                  <code className="text-xs text-amber-300 font-mono font-bold">
                    {purchaseRecord.accessKey.substring(0, 16)}...
                  </code>
                  <button
                    onClick={handleCopyKey}
                    title="Copiar clave de acceso"
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    {copiedToken ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 space-y-2">
              <h2 className="text-base font-bold text-white">
                {item.title}
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                {item.description}
              </p>

              <div className="pt-2">
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Incluido con este Pay Per View:
                </h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate-300">
                  {item.features.map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Creator Bio & Controls */}
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-medium uppercase block mb-2">
                  Autor / Instructor
                </span>
                <div className="flex items-center gap-3">
                  <img
                    src={item.instructor.avatar}
                    alt={item.instructor.name}
                    className="w-10 h-10 rounded-full object-cover border border-slate-700"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-white">{item.instructor.name}</h4>
                    <p className="text-[11px] text-slate-400">{item.instructor.role}</p>
                  </div>
                </div>
              </div>

              {!isPurchased && (
                <div className="mt-4 pt-3 border-t border-slate-800">
                  <button
                    id="btn-player-buy-now"
                    onClick={() => {
                      onClose();
                      onInitiateCheckout(item);
                    }}
                    className="w-full py-2.5 px-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Lock className="w-4 h-4" />
                    Comprar Pase (${item.price.toFixed(2)})
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
