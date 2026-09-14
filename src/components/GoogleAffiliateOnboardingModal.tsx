import React, { useState } from 'react';
import {
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Copy,
  Check,
  Zap,
  Globe,
  DollarSign,
  Cpu,
  BarChart3,
  Layers,
  ArrowRight,
  UserCheck,
  HelpCircle,
  X
} from 'lucide-react';
import { GoogleAffiliateProfile } from '../types';

interface GoogleAffiliateOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeProfile?: GoogleAffiliateProfile | null;
  currentProfile?: GoogleAffiliateProfile | null;
  onProfileUpdated: (profile: GoogleAffiliateProfile) => void;
  onTrackRealClick?: (programId: string, referralCode: string, targetUrl: string) => Promise<void>;
}

export function GoogleAffiliateOnboardingModal({
  isOpen,
  onClose,
  activeProfile,
  currentProfile,
  onProfileUpdated,
  onTrackRealClick,
}: GoogleAffiliateOnboardingModalProps) {
  const profile = activeProfile || currentProfile || null;
  const [googleEmailInput, setGoogleEmailInput] = useState<string>(
    profile?.email || 'go.botcaza.ai@gmail.com'
  );
  const [userNameInput, setUserNameInput] = useState<string>(
    profile?.name || 'Botcaza AI Lead Publisher'
  );
  const [customSubIdInput, setCustomSubIdInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleOnboardGoogle = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setStatusMessage(null);

    try {
      const res = await fetch('/api/affiliates/google/onboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: googleEmailInput.trim(),
          name: userNameInput.trim(),
          customSubId: customSubIdInput.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (data.success && data.profile) {
        onProfileUpdated(data.profile);
        setStatusMessage('¡Afiliación con Google Suite & Cloud Ads completada exitosamente!');
        // Save to local storage
        localStorage.setItem('botcaza_google_affiliate_profile', JSON.stringify(data.profile));
      } else {
        setStatusMessage('Hubo un inconveniente al procesar la afiliación. Intenta de nuevo.');
      }
    } catch (err: any) {
      console.error('Error al afiliar con Google:', err);
      setStatusMessage('Error de red al conectar con el servidor de afiliación.');
    } finally {
      setIsLoading(false);
    }
  };

  const isAlreadyActive = profile?.status === 'ACTIVE_CERTIFIED';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-3xl bg-zinc-950 border border-blue-500/50 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header with Google Brand Elements */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-blue-950/80 via-zinc-900 to-indigo-950/80 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Google Colorful G SVG */}
            <div className="w-10 h-10 rounded-xl bg-white p-2 flex items-center justify-center shadow-md shrink-0">
              <svg viewBox="0 0 24 24" className="w-6 h-6">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  Google Suite Monetización &amp; Cloud Ads
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  Era OA &bull; Open Ads
                </span>
              </div>
              <p className="text-xs text-zinc-400 font-mono">
                Programa Oficial de Afiliación y Monetización Avanzada de Google
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-xs sm:text-sm text-zinc-300">
          {/* Status Message */}
          {statusMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 flex items-center gap-2 font-mono text-xs animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              {statusMessage}
            </div>
          )}

          {/* ADVANCED POSITIONING: GOOGLE PIONEER IN OA ERA */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-blue-950/40 to-zinc-900 border border-blue-500/30 space-y-3">
            <div className="flex items-center gap-2 text-blue-400 font-mono text-xs font-bold uppercase tracking-wider">
              <Cpu className="w-4 h-4" />
              Liderazgo de Google en la Nueva Era de la OA (Open Advertising)
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Google lidera la transición hacia una publicidad inteligente y respetuosa con la privacidad, eliminando cookies de terceros y reemplazándolas con modelos contextuales de alto rendimiento:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3 rounded-lg bg-black/50 border border-zinc-800 space-y-1">
                <div className="text-white font-bold font-mono text-xs flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                  Privacy Sandbox &amp; Topics API
                </div>
                <p className="text-[11px] text-zinc-400">
                  Segmentación basada en temas del navegador sin rastreo individualizado.
                </p>
              </div>
              <div className="p-3 rounded-lg bg-black/50 border border-zinc-800 space-y-1">
                <div className="text-white font-bold font-mono text-xs flex items-center gap-1.5">
                  <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
                  Google Cloud Ads Data Hub
                </div>
                <p className="text-[11px] text-zinc-400">
                  Clean Rooms con BigQuery para análisis cruzado de audiencias con First-Party Data.
                </p>
              </div>
              <div className="p-3 rounded-lg bg-black/50 border border-zinc-800 space-y-1">
                <div className="text-white font-bold font-mono text-xs flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  AI Smart Bidding (Gemini)
                </div>
                <p className="text-[11px] text-zinc-400">
                  Subasta autónoma en tiempo real que maximiza el valor por clic (CPC $0.45 – $4.80).
                </p>
              </div>
              <div className="p-3 rounded-lg bg-black/50 border border-zinc-800 space-y-1">
                <div className="text-white font-bold font-mono text-xs flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-purple-400" />
                  Liquidación Oficial AdSense
                </div>
                <p className="text-[11px] text-zinc-400">
                  Depósitos mensuales directos a cuenta bancaria con el ID oficial <strong className="text-white">pub-9493850506792206</strong>.
                </p>
              </div>
            </div>
          </div>

          {/* ACTIVE STATUS BANNER */}
          {profile && (
            <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/40 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-emerald-500/20">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-emerald-400" />
                  <span className="font-bold text-white font-mono text-xs">
                    ESTADO: AFILIADO OFICIAL VERIFICADO
                  </span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-mono font-bold">
                  {profile.status}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
                <div>
                  <span className="text-zinc-400 block text-[11px]">Cuenta Google:</span>
                  <span className="text-white font-semibold truncate block">{profile.email}</span>
                </div>
                <div>
                  <span className="text-zinc-400 block text-[11px]">Publisher ID Oficial:</span>
                  <span className="text-white font-semibold">{profile.publisherId}</span>
                </div>
                <div>
                  <span className="text-zinc-400 block text-[11px]">Código de Afiliado OA:</span>
                  <span className="text-blue-400 font-bold">{profile.affiliateCode}</span>
                </div>
              </div>

              {/* Personalized Referral / Monetization Link */}
              <div className="pt-2">
                <label className="block text-[11px] font-mono text-zinc-400 mb-1.5">
                  Tu Enlace Oficial de Afiliado Google Ads &amp; Monetización:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={profile.trackingUrl}
                    className="flex-1 px-3 py-2 rounded-xl bg-black border border-zinc-700 text-xs font-mono text-blue-300 select-all"
                  />
                  <button
                    onClick={() => handleCopy(profile.trackingUrl, 'aff-url')}
                    className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow"
                  >
                    {copiedKey === 'aff-url' ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedKey === 'aff-url' ? 'Copiado' : 'Copiar'}
                  </button>
                  <button
                    onClick={() => {
                      if (onTrackRealClick) {
                        onTrackRealClick(
                          'google-ads',
                          profile.affiliateCode,
                          profile.trackingUrl
                        );
                      }
                      window.open(profile.trackingUrl, '_blank');
                    }}
                    className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-mono flex items-center gap-1 transition-all"
                    title="Probar y registrar clic real"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Probar
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 1-CLICK ONBOARDING FORM / ACCOUNT CREATION */}
          <div className="p-5 rounded-xl bg-zinc-900/90 border border-zinc-800 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                {isAlreadyActive ? 'Actualizar o Cambiar Cuenta de Afiliado' : '1-Click Onboarding con Google'}
              </h4>
              <span className="text-[11px] font-mono text-zinc-500">Suite Google Ads 2026</span>
            </div>

            <form onSubmit={handleOnboardGoogle} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">
                    Correo de Google (Gmail / Google Workspace):
                  </label>
                  <input
                    type="email"
                    required
                    value={googleEmailInput}
                    onChange={(e) => setGoogleEmailInput(e.target.value)}
                    placeholder="tu-correo@gmail.com"
                    className="w-full px-3.5 py-2 rounded-xl bg-black border border-zinc-700 text-white text-xs font-mono focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">
                    Nombre o Nombre del Canal / Web:
                  </label>
                  <input
                    type="text"
                    required
                    value={userNameInput}
                    onChange={(e) => setUserNameInput(e.target.value)}
                    placeholder="Mi Canal de Noticias o Web"
                    className="w-full px-3.5 py-2 rounded-xl bg-black border border-zinc-700 text-white text-xs font-mono focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">
                  Identificador personalizado de Afiliado (opcional):
                </label>
                <div className="flex items-center">
                  <span className="px-3 py-2 bg-zinc-800 border border-r-0 border-zinc-700 text-zinc-400 text-xs font-mono rounded-l-xl">
                    GOOG-OA-
                  </span>
                  <input
                    type="text"
                    value={customSubIdInput}
                    onChange={(e) => setCustomSubIdInput(e.target.value.replace(/[^a-zA-Z0-9_-]/g, ''))}
                    placeholder="MI_CODIGO_VIP"
                    className="w-full px-3 py-2 rounded-r-xl bg-black border border-zinc-700 text-white text-xs font-mono focus:border-blue-500 focus:outline-none uppercase"
                  />
                </div>
                <span className="text-[11px] text-zinc-500 block mt-1 font-mono">
                  Se asociará automáticamente a la cuenta de AdSense <code className="text-zinc-400">pub-9493850506792206</code>
                </span>
              </div>

              {/* ACTION BUTTONS */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-3 px-4 rounded-xl bg-white hover:bg-zinc-100 text-zinc-900 font-bold text-xs sm:text-sm font-mono flex items-center justify-center gap-2.5 transition-all shadow-lg active:scale-95 disabled:opacity-50"
                >
                  {/* Google Icon */}
                  <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  {isLoading ? 'Conectando con Google...' : 'Afiliarme con Google al Instante'}
                </button>

                <a
                  href="https://accounts.google.com/signup?service=adsense"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-xs font-mono font-medium border border-zinc-700 flex items-center justify-center gap-1.5 transition-all text-center"
                >
                  <span>¿Sin cuenta Google? Crear cuenta gratis</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </form>
          </div>

          {/* ADS.TXT VERIFICATION SNIPPET */}
          <div className="p-4 rounded-xl bg-black/70 border border-zinc-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-zinc-400 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                Línea oficial ads.txt para autorización directa de Google:
              </span>
              <button
                onClick={() => handleCopy('google.com, pub-9493850506792206, DIRECT, f08c47fec0942fa0\n', 'adstxt')}
                className="text-xs font-mono text-blue-400 hover:text-blue-300 flex items-center gap-1"
              >
                {copiedKey === 'adstxt' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                {copiedKey === 'adstxt' ? 'Copiado' : 'Copiar línea'}
              </button>
            </div>
            <code className="block p-2.5 rounded-lg bg-zinc-900 text-zinc-200 font-mono text-xs border border-zinc-800 overflow-x-auto">
              google.com, pub-9493850506792206, DIRECT, f08c47fec0942fa0
            </code>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-zinc-900 border-t border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-400">
            <Globe className="w-3.5 h-3.5 text-blue-400" />
            Google Partner Network &bull; AdSense pub-9493850506792206
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-mono font-bold transition-all shadow"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
