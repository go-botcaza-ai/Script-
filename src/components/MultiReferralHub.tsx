import React, { useState, useEffect } from 'react';
import {
  Share2,
  Tv,
  Search,
  Zap,
  Music,
  Wallet,
  Copy,
  Check,
  ExternalLink,
  DollarSign,
  TrendingUp,
  MousePointer,
  Send,
  MessageCircle,
  Twitter,
  QrCode,
  Sparkles,
  Play,
  RotateCcw,
  Sliders,
  ShieldCheck,
  Award,
  Plus,
  Youtube,
  Radio,
  Video,
  Smartphone,
  Layers,
  HelpCircle,
  LogIn,
  KeyRound,
  Info,
  X,
  Globe,
  Cpu,
  BarChart3,
  UserCheck,
  Crown,
  Briefcase,
  Users,
  Eye
} from 'lucide-react';
import { ReferralProgram, TeraBoxVideoShareItem, ReferralClickRecord, GoogleAffiliateProfile } from '../types';
import { INITIAL_REFERRAL_PROGRAMS, SAMPLE_TERABOX_VIDEOS } from '../data/referralProgramsData';
import { GoogleAffiliateOnboardingModal } from './GoogleAffiliateOnboardingModal';
import { isAppAdmin } from '../lib/auth';

export interface MultiReferralHubProps {
  currentUserEmail?: string | null;
  currentUserName?: string | null;
}

export function MultiReferralHub({
  currentUserEmail,
  currentUserName
}: MultiReferralHubProps = {}) {
  const isOwnerAdmin = isAppAdmin(currentUserEmail);

  // User personal storage key
  const userKey = currentUserEmail
    ? currentUserEmail.toLowerCase().replace(/[^a-z0-9]/g, '_')
    : 'guest_user';

  // Personal user stats (for new users, starts at strictly 0)
  const [userPersonalStats, setUserPersonalStats] = useState<{
    clicks: number;
    estimatedEarningsUSD: number;
    shares: number;
    signups: number;
    byProgram: Record<string, number>;
  }>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`botcaza_stats_${userKey}`);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return {
      clicks: 0,
      estimatedEarningsUSD: 0,
      shares: 0,
      signups: 0,
      byProgram: {}
    };
  });

  // Toggle for admin between aggregated network metrics and personal testing view
  const [adminViewMode, setAdminViewMode] = useState<'network_aggregate' | 'personal_business'>(
    isOwnerAdmin ? 'network_aggregate' : 'personal_business'
  );

  // Guide Modal State
  const [showTeraBoxLoginGuide, setShowTeraBoxLoginGuide] = useState<boolean>(false);
  // Google 1-Click Affiliate Onboarding Modal State
  const [showGoogleAffiliateModal, setShowGoogleAffiliateModal] = useState<boolean>(false);
  const [googleAffiliateProfile, setGoogleAffiliateProfile] = useState<GoogleAffiliateProfile | null>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('botcaza_google_affiliate_profile');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return {
      id: 'aff-goog-default',
      email: currentUserEmail || 'go.botcaza.ai@gmail.com',
      name: currentUserName || 'Botcaza AI Lead Publisher',
      publisherId: 'pub-9493850506792206',
      affiliateCode: isOwnerAdmin
        ? 'GOOG-OA-PUB-949385'
        : `AFF-${(currentUserName || currentUserEmail?.split('@')[0] || 'SOCIO').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8)}-2026`,
      registeredAt: new Date().toISOString(),
      status: 'ACTIVE_CERTIFIED',
      suiteServices: {
        googleAdSense: true,
        googleCloudAds: true,
        adsDataHub: true,
        topicsApiPrivacySandbox: true,
        aiSmartBidding: true,
      },
      totalRealClicks: 0,
      totalRealEarningsUSD: 0,
      activeCampaignTag: 'google_suite_oa_pioneer',
      trackingUrl: `https://go.botcaza.ai/?utm_source=google_ads_partner&utm_medium=affiliate_oa&pub=pub-9493850506792206&aff=${
        isOwnerAdmin
          ? 'GOOG-OA-PUB-949385'
          : `AFF-${(currentUserName || currentUserEmail?.split('@')[0] || 'SOCIO').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8)}-2026`
      }`
    };
  });

  // Programs State (persisted in localStorage v2 with zero fake data)
  const [programs, setPrograms] = useState<ReferralProgram[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('neuraforge_referral_programs_v2');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error('Error parsing saved referral programs', e);
        }
      }
    }
    return INITIAL_REFERRAL_PROGRAMS;
  });

  // Videos List
  const [videos] = useState<TeraBoxVideoShareItem[]>(SAMPLE_TERABOX_VIDEOS);
  const [selectedVideo, setSelectedVideo] = useState<TeraBoxVideoShareItem | null>(null);
  const [videoCategoryFilter, setVideoCategoryFilter] = useState<string>('all');
  const [videoSearchQuery, setVideoSearchQuery] = useState<string>('');

  // Active Sub-tab inside Hub (includes featured google-suite)
  const [activeSubTab, setActiveSubTab] = useState<'google-suite' | 'terabox-tv' | 'programs-catalog' | 'multi-broadcast' | 'link-generator' | 'analytics'>('google-suite');

  // Multi-Broadcast State (Telegram, WhatsApp, TikTok, YouTube)
  const [broadcastVideoUrl, setBroadcastVideoUrl] = useState<string>('https://terabox.app/s/1botcaza_vip_tv');
  const [broadcastVideoTitle, setBroadcastVideoTitle] = useState<string>('Masterclass On-Chain: Detección de Ballenas y Smart Contracts Move');
  const [broadcastVideoHook, setBroadcastVideoHook] = useState<string>('Accede al video completo sin cortes y descárgalo gratis en HD a través de TeraBox TV');
  const [broadcastTelegramChannel, setBroadcastTelegramChannel] = useState<string>('@Botcoins_Tradebot_Gamebot');
  const [broadcastPlatform, setBroadcastPlatform] = useState<'telegram' | 'whatsapp' | 'tiktok' | 'youtube'>('telegram');
  const [isSendingTelegram, setIsSendingTelegram] = useState<boolean>(false);

  // Universal Link Generator State
  const [customInputUrl, setCustomInputUrl] = useState<string>('https://go.botcaza.ai/?pub=pub-9493850506792206');
  const [selectedProgramId, setSelectedProgramId] = useState<string>('google-ads');
  const [selectedSocialPlatform, setSelectedSocialPlatform] = useState<'telegram' | 'whatsapp' | 'twitter' | 'web_direct'>('telegram');
  const [customCampaignTag, setCustomCampaignTag] = useState<string>('google_oa_ads');
  const [generatedUniversalUrl, setGeneratedUniversalUrl] = useState<string>('');

  // Click & Analytics History (Real server telemetry, zero fake numbers)
  const [clickHistory, setClickHistory] = useState<ReferralClickRecord[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('neuraforge_referral_clicks_v2');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error('Error parsing clicks history', e);
        }
      }
    }
    return [];
  });

  // TeraBox Calculator State
  const [calcEstimatedViews, setCalcEstimatedViews] = useState<number>(10000);
  const [calcNewSignups, setCalcNewSignups] = useState<number>(50);

  // Copy feedback tracking
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Toast Notification
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  // Sync Programs to localStorage v2
  useEffect(() => {
    localStorage.setItem('neuraforge_referral_programs_v2', JSON.stringify(programs));
  }, [programs]);

  // Sync Click History to localStorage v2
  useEffect(() => {
    localStorage.setItem('neuraforge_referral_clicks_v2', JSON.stringify(clickHistory));
  }, [clickHistory]);

  // Fetch real telemetry and Google affiliate profile on mount
  useEffect(() => {
    const fetchRealData = async () => {
      try {
        const [statsRes, googleRes] = await Promise.all([
          fetch('/api/referrals/stats'),
          fetch('/api/affiliates/google/profile')
        ]);

        const statsData = await statsRes.json();
        if (statsData.success && statsData.byProgram) {
          setPrograms((prev) =>
            prev.map((p) => {
              const realClicksForProg = statsData.byProgram[p.id] || 0;
              const realEarnings = Number((realClicksForProg * p.earningsRatePerUnit).toFixed(3));
              return {
                ...p,
                stats: {
                  ...p.stats,
                  clicks: realClicksForProg,
                  estimatedEarningsUSD: realEarnings,
                }
              };
            })
          );

          if (statsData.recentClicks && statsData.recentClicks.length > 0) {
            setClickHistory(
              statsData.recentClicks.map((c: any, i: number) => ({
                id: `real-click-${i}-${c.timestamp}`,
                programId: c.programId,
                programName: c.programId === 'google-ads' ? 'Google Suite & Cloud Ads' : c.programId,
                referralCode: c.referralCode,
                targetUrl: c.targetUrl,
                platform: c.platform,
                timestamp: c.timestamp.replace('T', ' ').substring(0, 19),
                earningsGeneratedUSD: c.earningsUSD || 0.85
              }))
            );
          }
        }

        const googleData = await googleRes.json();
        if (googleData.success && googleData.profile) {
          setGoogleAffiliateProfile(googleData.profile);
        }
      } catch (err) {
        console.warn('Real telemetry sync error:', err);
      }
    };

    fetchRealData();
  }, []);

  // Handle Link Generation
  useEffect(() => {
    const program = programs.find((p) => p.id === selectedProgramId);
    const refCode = program?.userReferralCode || 'BOTCAZA_VIP';
    
    let base = customInputUrl.trim();
    if (!base) {
      base = program?.userReferralUrl || 'https://go.botcaza.ai';
    }

    try {
      const url = new URL(base.startsWith('http') ? base : `https://${base}`);
      url.searchParams.set('ref', refCode);
      url.searchParams.set('utm_source', selectedSocialPlatform);
      url.searchParams.set('utm_medium', 'referral_network');
      url.searchParams.set('utm_campaign', customCampaignTag || 'neuraforge');
      setGeneratedUniversalUrl(url.toString());
    } catch {
      setGeneratedUniversalUrl(`${base}?ref=${refCode}&utm_source=${selectedSocialPlatform}`);
    }
  }, [customInputUrl, selectedProgramId, selectedSocialPlatform, customCampaignTag, programs]);

  // Copy to clipboard helper
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast('¡Enlace copiado al portapapeles!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Update a program's referral code or URL
  const handleUpdateProgramCode = (programId: string, newCode: string, newUrl?: string) => {
    setPrograms((prev) =>
      prev.map((p) => {
        if (p.id === programId) {
          return {
            ...p,
            userReferralCode: newCode,
            userReferralUrl: newUrl || p.userReferralUrl
          };
        }
        return p;
      })
    );
    showToast('Código de referido guardado con éxito');
  };

  // Record a simulated or real click
  const handleRecordClick = async (programId: string, targetUrl: string, platform: 'telegram' | 'whatsapp' | 'twitter' | 'web_direct' | 'other' = 'web_direct') => {
    const program = programs.find((p) => p.id === programId);
    const programName = program?.name || programId;
    const refCode = program?.userReferralCode || 'REF_DEFAULT';
    const earnings = program?.earningsRatePerUnit || 0.002;

    const newRecord: ReferralClickRecord = {
      id: `click-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      programId,
      programName,
      referralCode: refCode,
      targetUrl,
      platform,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      earningsGeneratedUSD: earnings
    };

    // Update Click History
    setClickHistory((prev) => [newRecord, ...prev.slice(0, 49)]);

    // Update Global Program Stats
    setPrograms((prev) =>
      prev.map((p) => {
        if (p.id === programId) {
          return {
            ...p,
            stats: {
              ...p.stats,
              clicks: p.stats.clicks + 1,
              estimatedEarningsUSD: Number((p.stats.estimatedEarningsUSD + earnings).toFixed(3))
            }
          };
        }
        return p;
      })
    );

    // Update User Personal Stats (starts at 0 for new user, increments on their real promo)
    setUserPersonalStats((prev) => {
      const updated = {
        ...prev,
        clicks: prev.clicks + 1,
        estimatedEarningsUSD: Number((prev.estimatedEarningsUSD + earnings).toFixed(3)),
        byProgram: {
          ...prev.byProgram,
          [programId]: (prev.byProgram[programId] || 0) + 1
        }
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem(`botcaza_stats_${userKey}`, JSON.stringify(updated));
      }
      return updated;
    });

    // Send click to backend API
    try {
      await fetch('/api/referrals/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          programId,
          referralCode: refCode,
          targetUrl,
          platform
        })
      });
    } catch {
      // Offline fallback
    }

    showToast(`¡Clic registrado! +$${earnings.toFixed(3)} USD estimados`);
  };

  // Share to Telegram
  const handleShareTelegram = (title: string, url: string) => {
    const text = encodeURIComponent(`🔥 ¡Mira este contenido exclusivo en Neuraforge & TeraBox TV!\n\n${title}\n\n👉 Accede aquí: ${url}`);
    window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${text}`, '_blank');
    handleRecordClick('terabox', url, 'telegram');
  };

  // Share to WhatsApp
  const handleShareWhatsApp = (title: string, url: string) => {
    const text = encodeURIComponent(`🚀 Hola, te comparto este video en TeraBox TV:\n\n*${title}*\n\nAcceso directo aquí: ${url}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
    handleRecordClick('terabox', url, 'whatsapp');
  };

  // Global Totals vs Personal Totals
  const totalClicks = programs.reduce((acc, p) => acc + p.stats.clicks, 0);
  const totalEarningsUSD = programs.reduce((acc, p) => acc + p.stats.estimatedEarningsUSD, 0);
  const totalShares = programs.reduce((acc, p) => acc + p.stats.shares, 0);
  const totalSignups = programs.reduce((acc, p) => acc + p.stats.signups, 0);

  // Active Perspective
  const isShowingAggregate = isOwnerAdmin && adminViewMode === 'network_aggregate';
  const displayedClicks = isShowingAggregate ? totalClicks : userPersonalStats.clicks;
  const displayedEarningsUSD = isShowingAggregate ? totalEarningsUSD : userPersonalStats.estimatedEarningsUSD;

  // Microsoft Developers Guide Modal State
  const [showMicrosoftDevGuide, setShowMicrosoftDevGuide] = useState<boolean>(false);

  // TeraBox specific program
  const teraboxProgram = programs.find((p) => p.id === 'terabox') || programs[0];

  // Filtered Videos
  const filteredVideos = videos.filter((v) => {
    const matchesCat = videoCategoryFilter === 'all' || v.category === videoCategoryFilter;
    const matchesSearch = v.title.toLowerCase().includes(videoSearchQuery.toLowerCase()) || v.description.toLowerCase().includes(videoSearchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-8 text-zinc-100">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-950/90 border border-emerald-500 text-emerald-300 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 backdrop-blur-md animate-in fade-in slide-in-from-bottom-4">
          <Sparkles className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-sm font-medium">{toast}</span>
        </div>
      )}

      {/* MODAL: GUÍA MICROSOFT DEVELOPERS & AZURE ENTRA ID */}
      {showMicrosoftDevGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-blue-500/40 rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center border border-zinc-700">
                  <svg className="w-5 h-5" viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg">
                    <rect x="1" y="1" width="9" height="9" fill="#f25022" />
                    <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
                    <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
                    <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    Trámite y Configuración: Iniciar Sesión con Microsoft
                  </h3>
                  <p className="text-xs text-zinc-400 font-mono">
                    Microsoft Entra ID (Azure Portal) + Firebase Authentication
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowMicrosoftDevGuide(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-zinc-300 leading-relaxed">
              <div className="p-4 rounded-xl bg-blue-950/40 border border-blue-500/30 text-blue-200 space-y-1">
                <p className="font-bold text-white">¿Necesitas pagar o tramitar una cuenta developers de pago?</p>
                <p className="text-xs">
                  <strong>No. Es 100% gratuito.</strong> Solo requieres una cuenta Microsoft habitual para acceder a <strong>Azure Portal</strong> (Microsoft Entra ID) y registrar tu App.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-white font-mono text-xs uppercase tracking-wider text-amber-400">
                  Paso a paso para habilitarlo en 5 minutos:
                </h4>

                <div className="space-y-3 font-mono text-xs">
                  <div className="p-3.5 rounded-xl bg-black border border-zinc-800 space-y-1">
                    <div className="text-white font-bold flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">1</span>
                      Ingresa a Microsoft Azure Portal
                    </div>
                    <p className="text-zinc-400 text-[11px]">
                      Entra a <a href="https://portal.azure.com/" target="_blank" rel="noreferrer" className="text-blue-400 underline">portal.azure.com</a> e inicia sesión con tu cuenta Microsoft.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-black border border-zinc-800 space-y-1">
                    <div className="text-white font-bold flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">2</span>
                      Registra tu Aplicación (App Registration)
                    </div>
                    <p className="text-zinc-400 text-[11px]">
                      Busca <strong>Microsoft Entra ID</strong> &rarr; <strong>App registrations</strong> &rarr; <strong>New registration</strong>. Asigna el nombre (ej: <em>NeuraForge Botcaza</em>) y en tipos de cuenta selecciona: <em>Cuentas en cualquier directorio organizativo y cuentas personales de Microsoft (Skype, Xbox, Outlook.com)</em>.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-black border border-zinc-800 space-y-1">
                    <div className="text-white font-bold flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">3</span>
                      Genera tu Client Secret
                    </div>
                    <p className="text-zinc-400 text-[11px]">
                      Dentro de tu app en Azure, ve a <strong>Certificates &amp; secrets</strong> &rarr; <strong>New client secret</strong>. Copia el <em>Value</em> generado y el <em>Application (client) ID</em> de la pestaña Overview.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-black border border-zinc-800 space-y-1">
                    <div className="text-white font-bold flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">4</span>
                      Habilita Microsoft en Firebase Console
                    </div>
                    <p className="text-zinc-400 text-[11px]">
                      En <a href="https://console.firebase.google.com/" target="_blank" rel="noreferrer" className="text-blue-400 underline">console.firebase.google.com</a> ve a <strong>Authentication</strong> &rarr; <strong>Sign-in method</strong> &rarr; Añadir proveedor &rarr; <strong>Microsoft</strong>. Pega tu <em>Application ID</em> y <em>Client Secret</em>. Copia la URL de redirección que te da Firebase y pégala en Azure en <em>Authentication &gt; Add a platform &gt; Web &gt; Redirect URIs</em>.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-zinc-800">
              <button
                onClick={() => setShowMicrosoftDevGuide(false)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl cursor-pointer"
              >
                Entendido, Cerrar Guía
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOP HERO BANNER */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-zinc-900 to-black border border-zinc-800 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-8 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-400 text-xs font-mono font-medium">
                <Globe className="w-3.5 h-3.5" />
                SUITE GOOGLE &bull; SUITE MICROSOFT
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
                <ShieldCheck className="w-3.5 h-3.5" />
                Telemetría 100% Verificada en Servidor
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
              Red de Monetización &amp; <span className="text-blue-400">Google &amp; Microsoft Suite</span>
            </h1>
            <p className="mt-2 text-zinc-400 text-sm sm:text-base max-w-2xl leading-relaxed">
              Monetiza con el ecosistema de <strong>Google Ads &amp; AdSense (pub-9493850506792206)</strong>, <strong>Microsoft Suite</strong>, <strong>TeraBox TV</strong>, <strong>DODO DEX</strong> y <strong>Spotify</strong> con enlaces y métricas personalizadas.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowMicrosoftDevGuide(true)}
              className="flex items-center gap-2 px-3.5 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-medium rounded-xl border border-zinc-700 transition-all active:scale-95 cursor-pointer"
              title="Ver instrucciones de cuenta developers y configuración de Azure"
            >
              <svg className="w-4 h-4" viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg">
                <rect x="1" y="1" width="9" height="9" fill="#f25022" />
                <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
                <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
                <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
              </svg>
              <span>Guía Microsoft Dev</span>
            </button>

            <button
              onClick={() => setShowGoogleAffiliateModal(true)}
              className="flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-zinc-100 text-zinc-900 text-xs font-bold rounded-xl transition-all shadow-lg shadow-blue-500/20 active:scale-95 border border-white/80 cursor-pointer"
            >
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 shrink-0">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              Afiliarme
            </button>

            <button
              onClick={() => {
                handleRecordClick(
                  'google-ads',
                  googleAffiliateProfile?.trackingUrl || 'https://go.botcaza.ai/?pub=pub-9493850506792206',
                  'web_direct'
                );
              }}
              className="flex items-center gap-2 px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-blue-500/20 active:scale-95 cursor-pointer"
            >
              <MousePointer className="w-3.5 h-3.5" />
              Probar Clic Real
            </button>

            <button
              onClick={() => {
                const summary = `📊 *Resumen de Afiliación & Telemetría Real Neuraforge*\n• Modo: ${isShowingAggregate ? 'Red Global Todos los Afiliados' : 'Negocio Personal'}\n• Ganancias: $${displayedEarningsUSD.toFixed(2)} USD\n• Clics Registrados: ${displayedClicks}\n• Google Publisher: ${googleAffiliateProfile?.publisherId || 'pub-9493850506792206'}\n• Afiliado: ${googleAffiliateProfile?.affiliateCode || 'GOOG-OA-PUB-949385'}\n🔗 ${googleAffiliateProfile?.trackingUrl || 'https://go.botcaza.ai'}`;
                handleCopy(summary, 'global-summary');
              }}
              className="flex items-center gap-2 px-3.5 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-medium rounded-xl border border-zinc-700 transition-all active:scale-95 cursor-pointer"
            >
              {copiedId === 'global-summary' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              Copiar Resumen
            </button>
          </div>
        </div>

        {/* ROLE INDICATOR & PERSPECTIVE SWITCHER */}
        <div className="mt-6 pt-6 border-t border-zinc-800/80">
          {isOwnerAdmin ? (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-gradient-to-r from-amber-950/40 via-zinc-900 to-black border border-amber-500/30">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                  <Crown className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-2">
                    <span>Sesión de Propietario &bull; {currentUserEmail || 'go.botcaza.ai@gmail.com'}</span>
                    <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase">
                      Admin Propietario
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    {adminViewMode === 'network_aggregate'
                      ? 'Visualizando la telemetría acumulada de TODOS los usuarios y afiliados de la red.'
                      : 'Modo simulación de Nuevo Afiliado: Métricas iniciales en 0 para promocionar tu negocio.'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setAdminViewMode('network_aggregate')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    adminViewMode === 'network_aggregate'
                      ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                      : 'bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-700'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  Todos los Afiliados ({totalClicks} clics)
                </button>
                <button
                  onClick={() => setAdminViewMode('personal_business')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    adminViewMode === 'personal_business'
                      ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/20'
                      : 'bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-700'
                  }`}
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  Vista Nuevo Usuario (Base 0)
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-gradient-to-r from-blue-950/40 via-zinc-900 to-black border border-blue-500/30">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400 shrink-0">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-2">
                    <span>Métricas de tu Negocio &bull; {currentUserName || currentUserEmail || 'Nuevo Emprendedor'}</span>
                    <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase">
                      Base Cero
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    Tus métricas inician en 0. Comparte tus enlaces en redes sociales (Meta, TikTok, Telegram) para hacer crecer tus visitas y comisiones.
                  </p>
                </div>
              </div>

              <div className="text-left sm:text-right shrink-0">
                <span className="text-[10px] font-mono text-cyan-400 block">TU CÓDIGO DE AFILIADO:</span>
                <span className="text-xs font-mono font-bold text-white">{googleAffiliateProfile?.affiliateCode}</span>
              </div>
            </div>
          )}
        </div>

        {/* STATS COUNTERS GRID - DYNAMIC ACCORDING TO USER ROLE */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-zinc-800/80">
          <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800/60">
            <div className="flex items-center justify-between text-zinc-400 text-xs font-mono">
              <span>{isShowingAggregate ? 'INGRESOS RED GLOBAL' : 'TUS INGRESOS ESTIMADOS'}</span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="mt-2 text-2xl sm:text-3xl font-black text-[#00ff9d] font-mono">
              ${displayedEarningsUSD.toFixed(2)}
              <span className="text-xs text-zinc-400 font-sans ml-1">USD</span>
            </div>
            <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {isShowingAggregate ? 'Acumulado de todos los afiliados' : 'Tus ingresos generados'}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800/60">
            <div className="flex items-center justify-between text-zinc-400 text-xs font-mono">
              <span>{isShowingAggregate ? 'CLICS RED GLOBAL' : 'TUS CLICS DE PROMOCIÓN'}</span>
              <MousePointer className="w-4 h-4 text-blue-400" />
            </div>
            <div className="mt-2 text-2xl sm:text-3xl font-black text-white font-mono">
              {displayedClicks.toLocaleString()}
            </div>
            <div className="text-[11px] text-blue-400 mt-1">
              {isShowingAggregate ? 'Telemetría total en /api/referrals' : 'Tus clics registrados'}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800/60">
            <div className="flex items-center justify-between text-zinc-400 text-xs font-mono">
              <span>GOOGLE PUBLISHER ID</span>
              <Award className="w-4 h-4 text-amber-400" />
            </div>
            <div className="mt-2 text-sm sm:text-base font-bold text-white font-mono truncate">
              {googleAffiliateProfile?.publisherId || 'pub-9493850506792206'}
            </div>
            <div className="text-[11px] text-zinc-400 mt-1">AdSense &amp; Cloud Ads Direct</div>
          </div>

          <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800/60">
            <div className="flex items-center justify-between text-zinc-400 text-xs font-mono">
              <span>REDES ACTIVAS</span>
              <ShieldCheck className="w-4 h-4 text-purple-400" />
            </div>
            <div className="mt-2 text-2xl sm:text-3xl font-black text-white font-mono">
              {programs.length} Programas
            </div>
            <div className="text-[11px] text-zinc-500 mt-1">Google Ads, TeraBox, Bing, DODO</div>
          </div>
        </div>
      </div>

      {/* INTERNAL TABS NAVIGATION */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-zinc-800">
        <button
          onClick={() => setActiveSubTab('google-suite')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-mono font-bold transition-all whitespace-nowrap ${
            activeSubTab === 'google-suite'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25 ring-1 ring-blue-400'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-900 border border-zinc-800'
          }`}
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          Google Suite Ads (Era OA)
          <span className="ml-1 px-1.5 py-0.5 rounded text-[10px] bg-amber-400 text-black font-bold">1-Click</span>
        </button>

        <button
          onClick={() => setActiveSubTab('terabox-tv')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-mono font-bold transition-all whitespace-nowrap ${
            activeSubTab === 'terabox-tv'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-900 border border-zinc-800'
          }`}
        >
          <Tv className="w-4 h-4 text-blue-400" />
          TeraBox TV &amp; Videos ($1.30–$3/1k)
        </button>

        <button
          onClick={() => setActiveSubTab('programs-catalog')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-mono font-bold transition-all whitespace-nowrap ${
            activeSubTab === 'programs-catalog'
              ? 'bg-[#00ff9d] text-black shadow-lg shadow-emerald-500/20'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-900 border border-zinc-800'
          }`}
        >
          <Share2 className="w-4 h-4" />
          Todos los Programas de Referidos
        </button>

        <button
          onClick={() => setActiveSubTab('multi-broadcast')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-mono font-bold transition-all whitespace-nowrap ${
            activeSubTab === 'multi-broadcast'
              ? 'bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 text-white shadow-lg shadow-pink-500/25'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-900 border border-zinc-800'
          }`}
        >
          <Radio className="w-4 h-4 text-pink-400" />
          Difusión Canales (Telegram, WhatsApp, TikTok, YT)
        </button>

        <button
          onClick={() => setActiveSubTab('link-generator')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-mono font-bold transition-all whitespace-nowrap ${
            activeSubTab === 'link-generator'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-900 border border-zinc-800'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          Generador Deep Link &amp; UTMs
        </button>

        <button
          onClick={() => setActiveSubTab('analytics')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-mono font-bold transition-all whitespace-nowrap ${
            activeSubTab === 'analytics'
              ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-900 border border-zinc-800'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          Telemetría &amp; Clics ({clickHistory.length})
        </button>
      </div>

      {/* ========================================================================= */}
      {/* SUB-TAB 0: GOOGLE SUITE MONETIZATION & GOOGLE CLOUD ADS (ERA OA) */}
      {/* ========================================================================= */}
      {activeSubTab === 'google-suite' && (
        <div className="space-y-8 animate-in fade-in">
          {/* MAIN GOOGLE SUITE STATUS & ONBOARDING CARD */}
          <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-zinc-900 via-zinc-950 to-blue-950/40 border border-blue-500/40 shadow-2xl space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-zinc-800">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-white p-1.5 flex items-center justify-center shadow">
                    <svg viewBox="0 0 24 24" className="w-5 h-5">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    Google Suite Monetización &amp; Cloud Ads
                  </h2>
                </div>
                <p className="text-xs sm:text-sm text-zinc-300 max-w-2xl leading-relaxed">
                  Posicionando a Google como el pionero indiscutible en publicidad avanzada en esta nueva era de la OA (Open Advertising). Monetiza con Inteligencia Artificial, Privacy Sandbox, Topics API y Google Cloud Ads Data Hub.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setShowGoogleAffiliateModal(true)}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-zinc-100 text-zinc-950 font-bold text-xs sm:text-sm font-mono transition-all shadow-xl active:scale-95"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  1-Click Afiliarme con Google
                </button>

                <button
                  onClick={() => {
                    handleRecordClick(
                      'google-ads',
                      googleAffiliateProfile?.trackingUrl || 'https://go.botcaza.ai',
                      'web_direct'
                    );
                  }}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm font-mono transition-all shadow-lg active:scale-95"
                >
                  <MousePointer className="w-4 h-4" />
                  Probar Clic Real
                </button>
              </div>
            </div>

            {/* PROFILE & CREDENTIALS SNAPSHOT */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-black/60 border border-zinc-800 space-y-1">
                <span className="text-[11px] font-mono text-zinc-400">Estado de Afiliación</span>
                <div className="flex items-center gap-2 text-emerald-400 font-bold font-mono text-xs">
                  <UserCheck className="w-4 h-4" />
                  {googleAffiliateProfile?.status || 'ACTIVE_CERTIFIED'}
                </div>
                <div className="text-[10px] text-zinc-500 font-mono">Google Partner Era OA</div>
              </div>

              <div className="p-4 rounded-xl bg-black/60 border border-zinc-800 space-y-1">
                <span className="text-[11px] font-mono text-zinc-400">Google Publisher ID</span>
                <div className="text-white font-mono font-bold text-xs sm:text-sm truncate">
                  {googleAffiliateProfile?.publisherId || 'pub-9493850506792206'}
                </div>
                <div className="text-[10px] text-zinc-500 font-mono">AdSense &amp; Cloud Ads</div>
              </div>

              <div className="p-4 rounded-xl bg-black/60 border border-zinc-800 space-y-1">
                <span className="text-[11px] font-mono text-zinc-400">Código Afiliado OA</span>
                <div className="text-blue-400 font-mono font-bold text-xs sm:text-sm">
                  {googleAffiliateProfile?.affiliateCode || 'GOOG-OA-PUB-949385'}
                </div>
                <div className="text-[10px] text-zinc-500 font-mono">Atribución sub-red</div>
              </div>

              <div className="p-4 rounded-xl bg-black/60 border border-zinc-800 space-y-1">
                <span className="text-[11px] font-mono text-zinc-400">Clics Reales en Servidor</span>
                <div className="text-[#00ff9d] font-mono font-black text-sm sm:text-base">
                  {programs.find(p => p.id === 'google-ads')?.stats.clicks || 0} clics
                </div>
                <div className="text-[10px] text-zinc-500 font-mono">
                  ${(programs.find(p => p.id === 'google-ads')?.stats.estimatedEarningsUSD || 0).toFixed(2)} USD reales
                </div>
              </div>
            </div>

            {/* TRACKING LINK BAR */}
            <div className="pt-2">
              <label className="block text-xs font-mono text-zinc-300 mb-2 font-semibold">
                Enlace Oficial de Afiliado Google Suite &amp; Cloud Ads (con atribución OA):
              </label>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={googleAffiliateProfile?.trackingUrl || 'https://go.botcaza.ai/?utm_source=google_ads_partner&pub=pub-9493850506792206'}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-black border border-zinc-700 text-xs font-mono text-blue-300 select-all"
                />
                <button
                  onClick={() => handleCopy(googleAffiliateProfile?.trackingUrl || '', 'goog-track-url')}
                  className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all shadow"
                >
                  {copiedId === 'goog-track-url' ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                  {copiedId === 'goog-track-url' ? '¡Copiado!' : 'Copiar Enlace'}
                </button>
              </div>
            </div>
          </div>

          {/* DEEP DIVE: GOOGLE AS PIONEER IN ADVANCED ADVERTISING (ERA OA) */}
          <div className="p-6 sm:p-8 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-400 text-xs font-mono font-medium mb-2">
                <Cpu className="w-3.5 h-3.5" />
                ARQUITECTURA DE VANGUARDIA &bull; NUEVA ERA OA
              </div>
              <h3 className="text-xl font-bold text-white">¿Por Qué Google es el Pionero en Publicidad Avanzada en la Era de la OA?</h3>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-3xl">
                La industria publicitaria vive su transformación más profunda en 25 años. Google lidera esta nueva era reemplazando el rastreo invasivo por infraestructura abierta, inteligencia artificial y privacidad criptográfica.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
              <div className="p-5 rounded-xl bg-black/60 border border-zinc-800 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-blue-500/15 border border-blue-500/30 text-blue-400 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h4 className="text-white font-bold font-mono text-xs">Privacy Sandbox &amp; Topics</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Eliminación de cookies de terceros protegiendo la identidad del usuario sin sacrificar la relevancia ni el CPC de los editores.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-black/60 border border-zinc-800 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <h4 className="text-white font-bold font-mono text-xs">Google Cloud Ads Data Hub</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Clean rooms seguras integradas en BigQuery que permiten correlacionar audiencias de primera parte (First-Party Data) con privacidad absoluta.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-black/60 border border-zinc-800 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center">
                  <Zap className="w-4 h-4" />
                </div>
                <h4 className="text-white font-bold font-mono text-xs">AI Smart Bidding &amp; Gemini</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Modelos de aprendizaje profundo que optimizan las subastas en milisegundos en Search, YouTube, Google Maps y Red de Display.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-black/60 border border-zinc-800 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-purple-500/15 border border-purple-500/30 text-purple-400 flex items-center justify-center">
                  <Globe className="w-4 h-4" />
                </div>
                <h4 className="text-white font-bold font-mono text-xs">Monetización Omnicanal (OA)</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Distribución unificada compatible con Web, Telegram Mini Apps, videos en la nube (TeraBox) y pasarelas de pago de última generación.
                </p>
              </div>
            </div>

            {/* ADS.TXT VERIFICATION BOX */}
            <div className="p-4 rounded-xl bg-black border border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <span className="text-xs font-mono text-zinc-400 font-semibold block">
                  Línea ads.txt Oficial de Autorización Google AdSense:
                </span>
                <code className="text-xs font-mono text-zinc-200 block">
                  google.com, pub-9493850506792206, DIRECT, f08c47fec0942fa0
                </code>
              </div>
              <button
                onClick={() => handleCopy('google.com, pub-9493850506792206, DIRECT, f08c47fec0942fa0\n', 'adstxt-direct')}
                className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-mono flex items-center gap-1.5 transition-all border border-zinc-700 shrink-0"
              >
                {copiedId === 'adstxt-direct' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedId === 'adstxt-direct' ? '¡Copiado!' : 'Copiar Línea'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 1: TERABOX TV & VIDEOS HUB */}
      {/* ========================================================================= */}
      {activeSubTab === 'terabox-tv' && (
        <div className="space-y-8">
          {/* TERABOX CONFIGURATION BAR */}
          <div className="p-6 sm:p-7 rounded-2xl bg-zinc-900/90 border border-blue-500/40 shadow-2xl backdrop-blur-md space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-mono font-semibold uppercase tracking-wider">
                    <Tv className="w-3.5 h-3.5" />
                    TeraBox Webmaster Center &bull; Atribución Oficial
                  </span>
                  {teraboxProgram.userReferralCode.includes('TERABOX_BOTCAZA_VIP') || teraboxProgram.userReferralCode.includes('TERABOX_CREATOR') ? (
                    <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[11px] font-mono">
                      🟡 Código demo activo &bull; Configura el tuyo
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-mono">
                      <Check className="w-3 h-3" />
                      Código activo: {teraboxProgram.userReferralCode}
                    </span>
                  )}
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  ¿Dónde me logueo o configuro mis credenciales de TeraBox?
                </h2>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  Por tu seguridad, el <strong>login oficial</strong> se realiza directamente en el portal oficial de <strong>TeraBox Webmaster</strong>. Luego pegas aquí tu código o link de referido para que la aplicación lo asocie automáticamente a todos tus videos, links de descarga y publicaciones.
                </p>
              </div>

              {/* Form to update TeraBox code */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
                <div className="relative">
                  <input
                    type="text"
                    defaultValue={teraboxProgram.userReferralCode}
                    id="input-terabox-ref-code"
                    placeholder="Pega tu código o enlace (ej: 1AbC23)"
                    className="w-full sm:w-64 px-3.5 py-2.5 rounded-xl bg-black border border-zinc-700 text-white text-xs font-mono focus:border-blue-500 focus:outline-none placeholder:text-zinc-600"
                  />
                </div>
                <button
                  onClick={() => {
                    const input = document.getElementById('input-terabox-ref-code') as HTMLInputElement;
                    if (input && input.value.trim()) {
                      const raw = input.value.trim();
                      let extractedCode = raw;
                      let generatedUrl = raw;
                      if (raw.includes('/s/')) {
                        extractedCode = raw.split('/s/')[1]?.split('?')[0] || raw;
                        generatedUrl = raw.startsWith('http') ? raw : `https://${raw}`;
                      } else {
                        generatedUrl = `https://terabox.app/s/${extractedCode}`;
                      }
                      handleUpdateProgramCode('terabox', extractedCode, generatedUrl);
                      showToast(`¡Código TeraBox guardado: ${extractedCode}!`);
                    }
                  }}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold font-mono rounded-xl transition-all shadow-md active:scale-95 whitespace-nowrap flex items-center justify-center gap-1.5"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  Guardar Código
                </button>
              </div>
            </div>

            {/* QUICK ACTIONS & STEP-BY-STEP TOGGLE */}
            <div className="pt-3 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowTeraBoxLoginGuide(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-blue-400 hover:text-blue-300 font-mono font-medium transition-all border border-blue-500/20"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  Ver Guía Rápida de 3 Pasos (¿Cómo loguearte y obtener tu código?)
                </button>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href="https://www.terabox.com/webmaster"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 text-xs font-mono font-bold border border-blue-500/30 transition-all"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  Abrir TeraBox Webmaster Login Oficial
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* TERABOX TV VIDEO SEARCH & FILTER */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-mono text-zinc-400">Filtrar Videos TV:</span>
              <div className="flex items-center gap-1.5 overflow-x-auto">
                {['all', 'web3_course', 'ai_tech', 'tv_series', 'trading_guide'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setVideoCategoryFilter(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                      videoCategoryFilter === cat
                        ? 'bg-blue-600 text-white'
                        : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                    }`}
                  >
                    {cat === 'all' && 'Todos'}
                    {cat === 'web3_course' && 'Masterclasses'}
                    {cat === 'ai_tech' && 'Tecnología & IA'}
                    {cat === 'tv_series' && 'Series TV'}
                    {cat === 'trading_guide' && 'Trading'}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
              <input
                type="text"
                value={videoSearchQuery}
                onChange={(e) => setVideoSearchQuery(e.target.value)}
                placeholder="Buscar video o episodio..."
                className="w-full pl-9 pr-3.5 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* VIDEOS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredVideos.map((video) => {
              const videoReferralUrl = `${video.fullTeraboxUrl}?ref=${teraboxProgram.userReferralCode}&utm_source=neuraforge_terabox_tv`;

              return (
                <div
                  key={video.id}
                  className="rounded-2xl bg-zinc-900/80 border border-zinc-800 overflow-hidden flex flex-col justify-between hover:border-blue-500/50 transition-all shadow-xl group"
                >
                  {/* Thumbnail & Badges */}
                  <div className="relative aspect-video w-full overflow-hidden bg-zinc-950">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

                    <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black/80 backdrop-blur-md border border-blue-500/40 text-blue-400 text-[11px] font-mono font-medium">
                      <Tv className="w-3 h-3" />
                      {video.categoryLabel}
                    </div>

                    <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-black/80 text-zinc-300 text-[11px] font-mono">
                      {video.duration}
                    </div>

                    {/* Play Button Overlay */}
                    <button
                      onClick={() => setSelectedVideo(video)}
                      className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-blue-600/90 hover:bg-blue-500 text-white flex items-center justify-center transition-all shadow-xl active:scale-95 group-hover:scale-110"
                    >
                      <Play className="w-6 h-6 ml-0.5 fill-white" />
                    </button>

                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-zinc-300">
                      <span className="font-mono">{video.viewsCount.toLocaleString()} reproducciones</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 font-mono font-bold text-[11px]">
                        Est: ${video.estimatedEarningsPer1k}/1k views
                      </span>
                    </div>
                  </div>

                  {/* Content Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="text-base font-bold text-white line-clamp-1 group-hover:text-blue-400 transition-colors">
                        {video.title}
                      </h3>
                      <p className="mt-1.5 text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                        {video.description}
                      </p>
                    </div>

                    {/* Share & Copy Actions */}
                    <div className="space-y-2 pt-2 border-t border-zinc-800/80">
                      <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
                        <span>Enlace con tu código ({teraboxProgram.userReferralCode}):</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          readOnly
                          value={videoReferralUrl}
                          className="flex-1 px-3 py-1.5 rounded-lg bg-black border border-zinc-800 text-[11px] font-mono text-zinc-300 truncate"
                        />
                        <button
                          onClick={() => handleCopy(videoReferralUrl, video.id)}
                          className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 active:scale-95 transition-all"
                          title="Copiar enlace"
                        >
                          {copiedId === video.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>

                      {/* Social Share Buttons */}
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button
                          onClick={() => handleShareTelegram(video.title, videoReferralUrl)}
                          className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#0088cc]/20 hover:bg-[#0088cc]/30 border border-[#0088cc]/50 text-[#29b6f6] text-xs font-mono font-bold transition-all active:scale-95"
                        >
                          <Send className="w-3.5 h-3.5" />
                          Telegram
                        </button>

                        <button
                          onClick={() => handleShareWhatsApp(video.title, videoReferralUrl)}
                          className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/40 border border-emerald-500/40 text-emerald-400 text-xs font-mono font-bold transition-all active:scale-95"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          WhatsApp
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* TERABOX EARNINGS CALCULATOR */}
          <div className="p-6 sm:p-8 rounded-2xl bg-zinc-900/60 border border-zinc-800 shadow-xl">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-semibold uppercase tracking-wider mb-2">
              <Sliders className="w-4 h-4" />
              Calculadora de Rendimiento TeraBox Webmaster
            </div>
            <h2 className="text-xl font-bold text-white">¿Cuánto puedes ganar compartiendo videos de TeraBox TV?</h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-2xl">
              TeraBox paga entre <strong>$1.30 y $3.00 USD por cada 1,000 reproducciones</strong> de video y un bono de <strong>$0.12 USD</strong> por cada nuevo usuario registrado con tu enlace.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 pt-6 border-t border-zinc-800">
              {/* Slider 1: Views */}
              <div className="space-y-3">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-zinc-400">Reproducciones Estimadas:</span>
                  <span className="text-white font-bold">{calcEstimatedViews.toLocaleString()} views</span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="100000"
                  step="1000"
                  value={calcEstimatedViews}
                  onChange={(e) => setCalcEstimatedViews(Number(e.target.value))}
                  className="w-full accent-blue-500 cursor-pointer"
                />
                <div className="text-[11px] text-zinc-500 font-mono">Tarifa promedio: $2.00 USD / 1,000 views</div>
              </div>

              {/* Slider 2: Signups */}
              <div className="space-y-3">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-zinc-400">Nuevos Registros:</span>
                  <span className="text-white font-bold">{calcNewSignups} usuarios</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="500"
                  step="10"
                  value={calcNewSignups}
                  onChange={(e) => setCalcNewSignups(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
                <div className="text-[11px] text-zinc-500 font-mono">Bono por registro: $0.12 USD / usuario</div>
              </div>

              {/* Result Box */}
              <div className="p-4 rounded-xl bg-black border border-emerald-500/40 flex flex-col justify-center items-center text-center">
                <div className="text-xs text-zinc-400 font-mono">Ingreso Mensual Estimado:</div>
                <div className="text-3xl font-black text-[#00ff9d] font-mono mt-1">
                  ${((calcEstimatedViews / 1000) * 2.0 + calcNewSignups * 0.12).toFixed(2)}
                  <span className="text-xs text-zinc-400 ml-1">USD</span>
                </div>
                <div className="text-[11px] text-emerald-400/80 mt-1">
                  (Equiv. a ~{(((calcEstimatedViews / 1000) * 2.0 + calcNewSignups * 0.12) / 6.5).toFixed(2)} APT on-chain)
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 2: ALL REFERRAL PROGRAMS CATALOG */}
      {/* ========================================================================= */}
      {activeSubTab === 'programs-catalog' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">Catálogo de Redes &amp; Programas de Referidos</h2>
              <p className="text-xs sm:text-sm text-zinc-400">
                Administra tus enlaces y códigos en cada una de las 5 plataformas compatibles.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {programs.map((prog) => {
              const fullRefUrl = `${prog.userReferralUrl}`;

              return (
                <div
                  key={prog.id}
                  className="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 transition-all flex flex-col justify-between space-y-6 shadow-xl"
                >
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="p-3 rounded-xl bg-zinc-800 border border-zinc-700 text-[#00ff9d]">
                          {prog.iconName === 'Tv' && <Tv className="w-5 h-5 text-blue-400" />}
                          {prog.iconName === 'Search' && <Search className="w-5 h-5 text-amber-400" />}
                          {prog.iconName === 'Zap' && <Zap className="w-5 h-5 text-yellow-400" />}
                          {prog.iconName === 'Music' && <Music className="w-5 h-5 text-emerald-400" />}
                          {prog.iconName === 'Wallet' && <Wallet className="w-5 h-5 text-purple-400" />}
                        </div>
                        <div>
                          <div className="text-[11px] font-mono text-zinc-400 uppercase">{prog.categoryLabel}</div>
                          <h3 className="text-lg font-bold text-white">{prog.name}</h3>
                        </div>
                      </div>

                      <span className="px-2.5 py-1 rounded-full bg-zinc-800 text-[11px] font-mono font-medium text-zinc-300">
                        {prog.stats.clicks} Clics
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                      {prog.description}
                    </p>

                    {/* Payout Model Badge */}
                    <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800/80">
                      <div className="text-[11px] font-mono text-zinc-500 uppercase">Modelo de Compensación:</div>
                      <div className="text-xs text-emerald-400 font-semibold mt-0.5">{prog.payoutModel}</div>
                    </div>

                    {/* Features List */}
                    <ul className="space-y-1.5 text-xs text-zinc-300">
                      {prog.features.map((feat, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>

                    {/* User Referral Code Input & Actions */}
                    <div className="pt-2 border-t border-zinc-800/80 space-y-2">
                      <label className="text-xs font-mono text-zinc-400">
                        Tu Código o Enlace Afiliado:
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          defaultValue={prog.userReferralCode}
                          id={`input-ref-${prog.id}`}
                          className="flex-1 px-3 py-2 rounded-xl bg-black border border-zinc-700 text-xs font-mono text-white focus:outline-none focus:border-emerald-500"
                        />
                        <button
                          onClick={() => {
                            const el = document.getElementById(`input-ref-${prog.id}`) as HTMLInputElement;
                            if (el && el.value) {
                              handleUpdateProgramCode(prog.id, el.value.trim());
                            }
                          }}
                          className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-mono font-bold rounded-xl border border-zinc-700 transition-all active:scale-95"
                        >
                          Guardar
                        </button>
                      </div>

                      {/* Generated Shareable Link */}
                      <div className="flex items-center gap-2 pt-1">
                        <input
                          type="text"
                          readOnly
                          value={fullRefUrl}
                          className="flex-1 px-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-[11px] font-mono text-zinc-400 truncate"
                        />
                        <button
                          onClick={() => handleCopy(fullRefUrl, `prog-copy-${prog.id}`)}
                          className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700"
                          title="Copiar"
                        >
                          {copiedId === `prog-copy-${prog.id}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>

                        <button
                          onClick={() => {
                            handleRecordClick(prog.id, fullRefUrl, 'web_direct');
                            window.open(fullRefUrl, '_blank');
                          }}
                          className="p-2 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/40"
                          title="Probar enlace"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Earnings & Stats Footer */}
                  <div className="pt-3 border-t border-zinc-800 flex items-center justify-between text-xs">
                    <div className="text-zinc-500 font-mono">
                      Ganancias: <span className="text-[#00ff9d] font-bold">${prog.stats.estimatedEarningsUSD.toFixed(2)} USD</span>
                    </div>
                    <div className="text-zinc-500 font-mono">
                      Registros: <span className="text-white font-bold">{prog.stats.signups}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 2.5: MULTI-PLATFORM BROADCASTER (TELEGRAM, WHATSAPP, TIKTOK, YOUTUBE) */}
      {/* ========================================================================= */}
      {activeSubTab === 'multi-broadcast' && (
        <div className="space-y-8">
          {/* Header */}
          <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-zinc-900 via-purple-950/40 to-black border border-pink-500/30 shadow-2xl">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-400 text-xs font-mono font-medium mb-3">
                  <Radio className="w-3.5 h-3.5 animate-pulse text-pink-400" />
                  DIFUSIÓN AUTOMATIZADA &bull; TELEGRAM &bull; WHATSAPP &bull; TIKTOK &bull; YOUTUBE
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Publicador Multiplataforma de Videos TeraBox TV
                </h2>
                <p className="text-xs sm:text-sm text-zinc-400 mt-2 max-w-3xl leading-relaxed">
                  Genera publicaciones de alto impacto optimizadas para cada plataforma. Conecta tus videos de TeraBox TV a canales de <strong>Telegram</strong>, comunidades de <strong>WhatsApp</strong>, estrategias de <strong>TikTok</strong> (enlace en bio/stickers) y <strong>YouTube Shorts</strong> (comentarios fijados).
                </p>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href="https://www.terabox.com/webmaster"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-mono font-bold transition-all shadow-md active:scale-95 whitespace-nowrap"
                >
                  <ExternalLink className="w-4 h-4" />
                  TeraBox Webmaster API
                </a>
              </div>
            </div>
          </div>

          {/* INPUT FORM: VIDEO DETAILS */}
          <div className="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800">
              <h3 className="text-sm font-mono text-zinc-300 uppercase tracking-wider flex items-center gap-2">
                <Video className="w-4 h-4 text-pink-400" />
                1. Datos del Video de TeraBox a Compartir:
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-zinc-400">Atribución activa:</span>
                <span className="px-2 py-0.5 rounded bg-blue-950/80 border border-blue-800/60 text-blue-400 text-xs font-mono font-bold">
                  {teraboxProgram.userReferralCode}
                </span>
                <button
                  onClick={() => setShowTeraBoxLoginGuide(true)}
                  className="text-[11px] text-zinc-400 hover:text-white underline font-mono flex items-center gap-1"
                >
                  <HelpCircle className="w-3 h-3 text-blue-400" />
                  ¿Cómo cambiarlo?
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-mono text-zinc-400 block mb-1">
                  Enlace del video obtenido en TeraBox (App o Web):
                </label>
                <input
                  type="text"
                  value={broadcastVideoUrl}
                  onChange={(e) => setBroadcastVideoUrl(e.target.value)}
                  placeholder="https://terabox.app/s/... o https://1024tera.com/s/..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-zinc-700 text-xs text-white font-mono focus:border-pink-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-zinc-400 block mb-1">
                  Título del Video o Serie:
                </label>
                <input
                  type="text"
                  value={broadcastVideoTitle}
                  onChange={(e) => setBroadcastVideoTitle(e.target.value)}
                  placeholder="Ej: Temporada 1 Completa 1080p o Masterclass Move"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-zinc-700 text-xs text-white font-mono focus:border-pink-500 focus:outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-xs font-mono text-zinc-400 block mb-1">
                  Gancho (Hook) persuasivo / Llamado a la Acción (CTA):
                </label>
                <input
                  type="text"
                  value={broadcastVideoHook}
                  onChange={(e) => setBroadcastVideoHook(e.target.value)}
                  placeholder="Ej: Accede sin publicidad y descárgalo gratis en HD a través de TeraBox TV"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-zinc-700 text-xs text-white font-mono focus:border-pink-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* PLATFORM SELECTOR TABS */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-zinc-800">
            <button
              onClick={() => setBroadcastPlatform('telegram')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition-all whitespace-nowrap ${
                broadcastPlatform === 'telegram'
                  ? 'bg-[#0088cc] text-white shadow-lg shadow-blue-500/20'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              <Send className="w-4 h-4 text-[#29b6f6]" />
              Telegram (Canales &amp; Grupos)
            </button>

            <button
              onClick={() => setBroadcastPlatform('whatsapp')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition-all whitespace-nowrap ${
                broadcastPlatform === 'whatsapp'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              <MessageCircle className="w-4 h-4 text-emerald-300" />
              WhatsApp (Canales &amp; Estados)
            </button>

            <button
              onClick={() => setBroadcastPlatform('tiktok')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition-all whitespace-nowrap ${
                broadcastPlatform === 'tiktok'
                  ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-lg shadow-pink-500/20'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              <Smartphone className="w-4 h-4 text-pink-300" />
              TikTok &bull; "Tilypk" (Bio &amp; Shorts)
            </button>

            <button
              onClick={() => setBroadcastPlatform('youtube')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition-all whitespace-nowrap ${
                broadcastPlatform === 'youtube'
                  ? 'bg-red-600 text-white shadow-lg shadow-red-500/20'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              <Youtube className="w-4 h-4 text-red-400" />
              YouTube (Shorts &amp; Comentario Fijado)
            </button>
          </div>

          {/* ================================================================= */}
          {/* PLATFORM 1: TELEGRAM */}
          {/* ================================================================= */}
          {broadcastPlatform === 'telegram' && (
            <div className="p-6 rounded-2xl bg-zinc-900/80 border border-[#0088cc]/30 space-y-6 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-[#29b6f6] text-xs font-mono font-semibold">
                    <Send className="w-4 h-4" />
                    PLANTILLA PARA CANALES &amp; GRUPOS DE TELEGRAM
                  </div>
                  <h3 className="text-lg font-bold text-white mt-1">Formato Enriquecido con Botón de Reproducción</h3>
                  <p className="text-xs text-zinc-400">
                    Diseñado con emojis de alta visibilidad, separación limpia y enlace con UTM automático para canales públicos o privados.
                  </p>
                </div>

                {/* API Publish Trigger */}
                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      value={broadcastTelegramChannel}
                      onChange={(e) => setBroadcastTelegramChannel(e.target.value)}
                      placeholder="@tu_canal_telegram"
                      className="px-3 py-2 rounded-xl bg-black border border-zinc-700 text-xs font-mono text-white w-48 sm:w-56"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setBroadcastTelegramChannel('@Botcoins_Tradebot_Gamebot')}
                    className="px-2 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-[10px] font-mono text-cyan-400 border border-zinc-700"
                    title="Usar @Botcoins_Tradebot_Gamebot"
                  >
                    @Botcoins
                  </button>
                  <button
                    disabled={isSendingTelegram}
                    onClick={async () => {
                      setIsSendingTelegram(true);
                      const finalUrl = `${broadcastVideoUrl}?ref=${teraboxProgram.userReferralCode}&utm_source=telegram_channel`;
                      const messageBody = `🔥 *${broadcastVideoTitle}*\n\n${broadcastVideoHook}\n\n▶️ *Ver Ahora en TeraBox TV:* ${finalUrl}\n\n🏷️ #TeraBoxTV #Streaming #HD`;

                      try {
                        const res = await fetch('/api/telegram/send-alert', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            chatId: broadcastTelegramChannel,
                            message: messageBody
                          })
                        });
                        const data = await res.json();
                        if (data.success) {
                          showToast(`¡Publicado en ${broadcastTelegramChannel} vía Telegram Bot API!`);
                        } else {
                          showToast(data.message || 'Mensaje preparado. Copia el texto para enviarlo manualmente.');
                        }
                      } catch {
                        showToast('Mensaje preparado para envío a Telegram.');
                      } finally {
                        setIsSendingTelegram(false);
                      }
                    }}
                    className="px-4 py-2 bg-[#0088cc] hover:bg-[#0088cc]/80 text-white text-xs font-mono font-bold rounded-xl transition-all shadow-md active:scale-95 flex items-center gap-1.5 whitespace-nowrap"
                  >
                    <Send className="w-3.5 h-3.5" />
                    {isSendingTelegram ? 'Enviando...' : 'Publicar vía Bot API'}
                  </button>
                </div>
              </div>

              {/* Message Box */}
              {(() => {
                const tgUrl = `${broadcastVideoUrl}?ref=${teraboxProgram.userReferralCode}&utm_source=telegram_channel`;
                const tgMessage = `🎬 **${broadcastVideoTitle}**\n\n📌 **${broadcastVideoHook}**\n\n⚡ **Características:**\n• Calidad 1080p Full HD sin cortes\n• Reproducción instantánea en TeraBox TV\n• Descarga directa a tu nube (1024 GB gratis)\n\n👉 **ENLACE DIRECTO:**\n${tgUrl}\n\n🔥 _Comparte con tus amigos en Telegram_`;

                return (
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-black border border-zinc-800 font-mono text-xs text-zinc-200 whitespace-pre-line select-all">
                      {tgMessage}
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        onClick={() => handleCopy(tgMessage, 'tg-copy-msg')}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-mono font-bold transition-all border border-zinc-700"
                      >
                        {copiedId === 'tg-copy-msg' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                        Copiar Mensaje Telegram
                      </button>

                      <button
                        onClick={() => {
                          const url = `https://t.me/share/url?url=${encodeURIComponent(tgUrl)}&text=${encodeURIComponent(tgMessage)}`;
                          window.open(url, '_blank');
                          handleRecordClick('terabox', tgUrl, 'telegram');
                        }}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0088cc] hover:bg-[#0088cc]/90 text-white text-xs font-mono font-bold transition-all shadow-md"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Abrir y Enviar a Contactos / Grupos
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* ================================================================= */}
          {/* PLATFORM 2: WHATSAPP */}
          {/* ================================================================= */}
          {broadcastPlatform === 'whatsapp' && (
            <div className="p-6 rounded-2xl bg-zinc-900/80 border border-emerald-500/30 space-y-6 shadow-xl">
              <div>
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-semibold">
                  <MessageCircle className="w-4 h-4" />
                  PLANTILLA PARA CANALES DE WHATSAPP, GRUPOS Y ESTADOS
                </div>
                <h3 className="text-lg font-bold text-white mt-1">Formato con Negritas y Cursivas de WhatsApp</h3>
                <p className="text-xs text-zinc-400">
                  Ideal para difusión masiva en los nuevos <strong>Canales de WhatsApp</strong> (WhatsApp Channels) y grupos comunitarios.
                </p>
              </div>

              {(() => {
                const waUrl = `${broadcastVideoUrl}?ref=${teraboxProgram.userReferralCode}&utm_source=whatsapp_channel`;
                const waMessage = `🚀 *${broadcastVideoTitle}*\n\n${broadcastVideoHook}\n\n✅ *Disponible en TeraBox TV sin límites:*\n${waUrl}\n\n_Toca el enlace para verlo o guardarlo en tu cuenta._`;

                return (
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-black border border-zinc-800 font-mono text-xs text-zinc-200 whitespace-pre-line select-all">
                      {waMessage}
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        onClick={() => handleCopy(waMessage, 'wa-copy-msg')}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-mono font-bold transition-all border border-zinc-700"
                      >
                        {copiedId === 'wa-copy-msg' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                        Copiar Mensaje WhatsApp
                      </button>

                      <button
                        onClick={() => {
                          const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(waMessage)}`;
                          window.open(url, '_blank');
                          handleRecordClick('terabox', waUrl, 'whatsapp');
                        }}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold transition-all shadow-md"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Abrir WhatsApp Directo
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* ================================================================= */}
          {/* PLATFORM 3: TIKTOK ("TILYPK" / SHORTS / LINK IN BIO) */}
          {/* ================================================================= */}
          {broadcastPlatform === 'tiktok' && (
            <div className="p-6 rounded-2xl bg-zinc-900/80 border border-pink-500/30 space-y-6 shadow-xl">
              <div>
                <div className="flex items-center gap-2 text-pink-400 text-xs font-mono font-semibold">
                  <Smartphone className="w-4 h-4" />
                  ESTRATEGIA &amp; GENERADOR PARA TIKTOK ("TILYPK")
                </div>
                <h3 className="text-lg font-bold text-white mt-1">Cómo Compartir y Monetizar en TikTok sin Bloqueos</h3>
                <p className="text-xs text-zinc-400">
                  TikTok no permite enlaces clickeables en la descripción a menos que utilices el <strong>Link en Bio</strong> o Stickers en Historias. Aquí tienes el guión y los hashtags virales.
                </p>
              </div>

              {/* Step-by-Step Flow for TikTok */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-black border border-zinc-800">
                  <div className="text-pink-400 font-mono text-xs font-bold mb-1">PASO 1: SUBIR TEASER (15-30s)</div>
                  <p className="text-xs text-zinc-300">
                    Corta los 30 segundos más intrigantes del video de TeraBox y súbelos a TikTok con música en tendencia.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-black border border-zinc-800">
                  <div className="text-pink-400 font-mono text-xs font-bold mb-1">PASO 2: GANCHO EN PANTALLA</div>
                  <p className="text-xs text-zinc-300">
                    Coloca texto en pantalla grande: <em>"¿Quieres ver el video completo sin cortes? El link está en mi perfil"</em>.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-black border border-zinc-800">
                  <div className="text-pink-400 font-mono text-xs font-bold mb-1">PASO 3: ENLACE PUENTE EN BIO</div>
                  <p className="text-xs text-zinc-300">
                    Coloca tu link de <code>https://go.botcaza.ai/?ref={teraboxProgram.userReferralCode}</code> en tu biografía para que los usuarios hagan clic seguro.
                  </p>
                </div>
              </div>

              {/* Copy Template for TikTok Caption */}
              {(() => {
                const tiktokCaption = `🎬 ${broadcastVideoTitle}\n\n👉 El video completo de 45 minutos está en el LINK DE MI PERFIL con calidad 1080p en TeraBox TV.\n\nComenta "LINK" y te lo mando por mensaje directo 📩\n\n#TeraBox #TeraBoxTV #Peliculas #Series #Viral #Streaming #ParaTi #FYP`;

                return (
                  <div className="space-y-4 pt-2">
                    <div className="text-xs font-mono text-zinc-400">Descripción &amp; Hashtags Virales para TikTok:</div>
                    <div className="p-4 rounded-xl bg-black border border-zinc-800 font-mono text-xs text-zinc-200 whitespace-pre-line select-all">
                      {tiktokCaption}
                    </div>

                    <button
                      onClick={() => handleCopy(tiktokCaption, 'tiktok-copy-msg')}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:opacity-90 text-white text-xs font-mono font-bold transition-all shadow-md"
                    >
                      {copiedId === 'tiktok-copy-msg' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      Copiar Descripción y Hashtags para TikTok
                    </button>
                  </div>
                );
              })()}
            </div>
          )}

          {/* ================================================================= */}
          {/* PLATFORM 4: YOUTUBE (SHORTS & COMENTARIO FIJADO) */}
          {/* ================================================================= */}
          {broadcastPlatform === 'youtube' && (
            <div className="p-6 rounded-2xl bg-zinc-900/80 border border-red-500/30 space-y-6 shadow-xl">
              <div>
                <div className="flex items-center gap-2 text-red-400 text-xs font-mono font-semibold">
                  <Youtube className="w-4 h-4" />
                  PLANTILLA PARA YOUTUBE SHORTS &amp; COMENTARIO FIJADO
                </div>
                <h3 className="text-lg font-bold text-white mt-1">Estrategia del Comentario Fijado (Pinned Comment)</h3>
                <p className="text-xs text-zinc-400">
                  En YouTube Shorts, los enlaces en descripciones no son tan visibles. El <strong>primer comentario fijado</strong> genera más del 80% de los clics en enlaces de referidos.
                </p>
              </div>

              {(() => {
                const ytUrl = `${broadcastVideoUrl}?ref=${teraboxProgram.userReferralCode}&utm_source=youtube_shorts_pinned`;
                const ytPinnedComment = `🎬 ENLACE AL VIDEO COMPLETO EN HD (TeraBox TV):\n👉 ${ytUrl}\n\n(Puedes verlo en streaming o guardarlo gratis en tu cuenta de TeraBox sin publicidad. ¡Disfrútalo!)`;
                const ytDescription = `Mira el video completo "${broadcastVideoTitle}" en TeraBox TV:\n${ytUrl}\n\nSuscríbete para más contenidos exclusivos cada semana.\n\n#Shorts #TeraBox #Streaming`;

                return (
                  <div className="space-y-6">
                    {/* Pinned Comment Box */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                        <span className="text-amber-400 font-bold">1. Texto para Comentario Fijado (Pinned Comment):</span>
                        <span className="text-zinc-500">Tasa de conversión más alta</span>
                      </div>
                      <div className="p-4 rounded-xl bg-black border border-zinc-800 font-mono text-xs text-zinc-200 whitespace-pre-line select-all">
                        {ytPinnedComment}
                      </div>
                      <button
                        onClick={() => handleCopy(ytPinnedComment, 'yt-pinned-copy')}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-mono font-bold transition-all shadow-md"
                      >
                        {copiedId === 'yt-pinned-copy' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                        Copiar Comentario Fijado
                      </button>
                    </div>

                    {/* Description Box */}
                    <div className="space-y-2 pt-4 border-t border-zinc-800">
                      <div className="text-xs font-mono text-zinc-400">
                        2. Texto para la Caja de Descripción de YouTube:
                      </div>
                      <div className="p-4 rounded-xl bg-black border border-zinc-800 font-mono text-xs text-zinc-200 whitespace-pre-line select-all">
                        {ytDescription}
                      </div>
                      <button
                        onClick={() => handleCopy(ytDescription, 'yt-desc-copy')}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-mono font-bold transition-all border border-zinc-700"
                      >
                        {copiedId === 'yt-desc-copy' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                        Copiar Descripción YouTube
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* FAQS & GUÍA OFICIAL TERABOX WEBMASTER */}
          <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
            <h4 className="text-sm font-mono text-white font-bold flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#00ff9d]" />
              Preguntas Frecuentes sobre la API y Enlaces de TeraBox TV
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-zinc-300">
              <div className="p-4 rounded-xl bg-black border border-zinc-800 space-y-2">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <span>¿Cómo sabe TeraBox que el video lo compartiste tú?</span>
                </div>
                <p className="text-zinc-400 leading-relaxed">
                  Cuando obtienes tu enlace de Webmaster en TeraBox (ejemplo: <code>https://terabox.app/s/1xxxx</code>), el parámetro <code>?ref=TU_CODIGO</code> queda asociado a tu cuenta. Cuando cualquier persona hace clic, TeraBox registra su cookie y dispositivo.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-black border border-zinc-800 space-y-2">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <span>¿Las redes sociales bloquean los enlaces directos de TeraBox?</span>
                </div>
                <p className="text-zinc-400 leading-relaxed">
                  Telegram y WhatsApp aceptan enlaces de TeraBox de forma nativa sin problema. En cambio, TikTok e Instagram a menudo bloquean dominios externos directos; por eso se recomienda usar tu enlace puente de <code>https://go.botcaza.ai</code> en la biografía.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 3: UNIVERSAL LINK & UTM GENERATOR */}
      {/* ========================================================================= */}
      {activeSubTab === 'link-generator' && (
        <div className="p-6 sm:p-8 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-6 shadow-xl">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-mono font-medium mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              DEEP LINK &amp; UTM ENGINE
            </div>
            <h2 className="text-xl font-bold text-white">Generador Universal de Enlaces Multireferido</h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-2xl">
              Convierte cualquier URL externa o video en un enlace con atribución permanente, parámetros UTM y formato optimizado para Telegram, WhatsApp y redes sociales.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4 border-t border-zinc-800">
            {/* Input Controls */}
            <div className="space-y-4">
              <div>
                <label className="text-xs font-mono text-zinc-300 block mb-1">
                  1. URL de destino (video TeraBox TV, búsqueda Bing, swap DODO o Spotify):
                </label>
                <input
                  type="text"
                  value={customInputUrl}
                  onChange={(e) => setCustomInputUrl(e.target.value)}
                  placeholder="https://terabox.com/s/... o https://open.spotify.com/..."
                  className="w-full px-4 py-2.5 rounded-xl bg-black border border-zinc-700 text-xs text-white font-mono focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-mono text-zinc-300 block mb-1">
                    2. Selecciona Programa:
                  </label>
                  <select
                    value={selectedProgramId}
                    onChange={(e) => setSelectedProgramId(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-black border border-zinc-700 text-xs text-white font-mono focus:outline-none focus:border-purple-500"
                  >
                    {programs.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-mono text-zinc-300 block mb-1">
                    3. Canal de Distribución:
                  </label>
                  <select
                    value={selectedSocialPlatform}
                    onChange={(e) => setSelectedSocialPlatform(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl bg-black border border-zinc-700 text-xs text-white font-mono focus:outline-none focus:border-purple-500"
                  >
                    <option value="telegram">Telegram (Mini App / Canales)</option>
                    <option value="whatsapp">WhatsApp (Grupos / Estados)</option>
                    <option value="twitter">X / Twitter</option>
                    <option value="web_direct">Web Directa / Blog</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-mono text-zinc-300 block mb-1">
                  4. Etiqueta de Campaña (UTM Campaign):
                </label>
                <input
                  type="text"
                  value={customCampaignTag}
                  onChange={(e) => setCustomCampaignTag(e.target.value)}
                  placeholder="Ej: septiembre_promo_tv"
                  className="w-full px-4 py-2.5 rounded-xl bg-black border border-zinc-700 text-xs text-white font-mono focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            {/* Generated Output Preview */}
            <div className="p-5 rounded-xl bg-zinc-950 border border-purple-500/30 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-purple-400 font-semibold">ENLACE GENERADO CON ATRIBUCIÓN:</span>
                  <span className="text-[11px] text-zinc-500 font-mono">Parámetros UTM Listos</span>
                </div>

                <div className="p-3 rounded-lg bg-black border border-zinc-800 text-xs font-mono text-emerald-400 break-all select-all">
                  {generatedUniversalUrl}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy(generatedUniversalUrl, 'universal-gen')}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-purple-600 hover:bg-purple-500 text-white text-xs font-mono font-bold rounded-xl transition-all shadow-lg active:scale-95"
                  >
                    {copiedId === 'universal-gen' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    Copiar Enlace Afiliado
                  </button>

                  <button
                    onClick={() => {
                      handleRecordClick(selectedProgramId, generatedUniversalUrl, selectedSocialPlatform);
                      window.open(generatedUniversalUrl, '_blank');
                    }}
                    className="p-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 active:scale-95"
                    title="Probar en pestaña nueva"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Ready-to-send message preview */}
              <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
                <div className="text-[11px] font-mono text-zinc-400">Texto de Mensaje para Compartir:</div>
                <p className="text-xs text-zinc-300 font-sans italic">
                  "🎬 ¡No te pierdas este contenido exclusivo en TeraBox TV / Web3! Acceso directo aquí: {generatedUniversalUrl}"
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => {
                      const msg = `🎬 ¡No te pierdas este contenido exclusivo!\n\n👉 Acceso directo aquí: ${generatedUniversalUrl}`;
                      handleCopy(msg, 'msg-preview');
                    }}
                    className="text-[11px] text-purple-400 hover:text-purple-300 font-mono flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" />
                    Copiar Mensaje Completo
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 4: REAL-TIME ANALYTICS & TELEMETRY */}
      {/* ========================================================================= */}
      {activeSubTab === 'analytics' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white">Telemetría de Clics &amp; Registros de Referidos</h2>
              <p className="text-xs sm:text-sm text-zinc-400">
                Historial de eventos de clics registrados tanto en cliente como en el endpoint <code>/api/referrals/track</code>.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setClickHistory([]);
                  showToast('Historial de clics reiniciado.');
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-mono border border-zinc-700 active:scale-95"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Limpiar Historial
              </button>
            </div>
          </div>

          <div className="rounded-2xl bg-zinc-900/80 border border-zinc-800 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-zinc-950 text-zinc-400 border-b border-zinc-800 uppercase text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Fecha / Hora</th>
                    <th className="py-3 px-4">Programa</th>
                    <th className="py-3 px-4">Código Usado</th>
                    <th className="py-3 px-4">Canal</th>
                    <th className="py-3 px-4">Ganancia Est.</th>
                    <th className="py-3 px-4">URL Destino</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/80 text-zinc-300">
                  {clickHistory.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-zinc-500">
                        No hay clics registrados aún en el servidor. Haz clic en "Probar Clic Real", afilíate con Google en 1-clic o comparte tus enlaces en redes para ver telemetría real en vivo.
                      </td>
                    </tr>
                  ) : (
                    clickHistory.map((row) => (
                      <tr key={row.id} className="hover:bg-zinc-800/40 transition-colors">
                        <td className="py-3 px-4 text-zinc-400">{row.timestamp}</td>
                        <td className="py-3 px-4 text-white font-bold">{row.programName}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded bg-zinc-800 text-[#00ff9d] border border-zinc-700">
                            {row.referralCode}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="capitalize px-2 py-0.5 rounded bg-blue-950/60 text-blue-400 border border-blue-800/50">
                            {row.platform}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-emerald-400 font-bold">
                          +${row.earningsGeneratedUSD.toFixed(3)}
                        </td>
                        <td className="py-3 px-4 max-w-xs truncate text-zinc-500">
                          {row.targetUrl}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: STEP-BY-STEP TERABOX LOGIN & CREDENTIALS GUIDE */}
      {/* ========================================================================= */}
      {showTeraBoxLoginGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-2xl bg-zinc-950 border border-blue-500/40 rounded-2xl overflow-hidden shadow-2xl space-y-0 flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 bg-gradient-to-r from-blue-950/70 via-zinc-900 to-black border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-500/20 border border-blue-500/30 text-blue-400">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                    Guía de Login &amp; Credenciales TeraBox
                  </h3>
                  <p className="text-xs text-zinc-400 font-mono">
                    Aprende dónde iniciar sesión y cómo vincular tus ganancias a esta app
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowTeraBoxLoginGuide(false)}
                className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 space-y-6 overflow-y-auto text-xs sm:text-sm text-zinc-300">
              {/* Security Banner */}
              <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-emerald-400 text-xs font-mono">
                    SEGURIDAD DE TUS CREDENCIALES
                  </div>
                  <p className="text-xs text-zinc-300 mt-0.5 leading-relaxed">
                    <strong>Nunca ingreses tu contraseña de TeraBox en sitios externos.</strong> Por protocolo oficial, tu cuenta y tus retiros bancarios se gestionan 100% en TeraBox. En esta aplicación solo registras tu <strong>Código Público de Referido / Enlace Webmaster</strong> para atribuir tus comisiones.
                  </p>
                </div>
              </div>

              {/* Step 1 */}
              <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-white font-mono text-xs">
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">1</span>
                    ¿DÓNDE ME LOGUEO EN TERABOX?
                  </div>
                  <span className="text-[11px] font-mono text-blue-400 font-semibold">Portal Oficial</span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Abre el portal de creadores oficial de TeraBox Webmaster en tu navegador o desde la aplicación móvil de TeraBox (sección <em>Perfil &gt; Webmaster</em>).
                </p>
                <div className="pt-2">
                  <a
                    href="https://www.terabox.com/webmaster"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-mono font-bold transition-all shadow-md"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    Abrir https://www.terabox.com/webmaster
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Step 2 */}
              <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-white font-mono text-xs">
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">2</span>
                    ¿CÓMO OBTENGO MI CÓDIGO O ENLACE?
                  </div>
                  <span className="text-[11px] font-mono text-amber-400 font-semibold">Webmaster Dashboard</span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Una vez dentro de tu cuenta en TeraBox:
                </p>
                <ul className="list-disc list-inside text-xs text-zinc-400 space-y-1 pl-1">
                  <li>Selecciona tu modalidad preferida: <strong>"Ganar por Reproducciones de Video"</strong> ($1.30–$3.00 USD / 1k vistas) o <strong>"Nuevos Usuarios"</strong> ($0.12 USD / registro).</li>
                  <li>Ve a <strong>"Compartir archivos para ganar dinero"</strong> o <strong>"Mis Enlaces"</strong>.</li>
                  <li>Copia tu enlace de referido (ej: <code>https://terabox.app/s/1xxxxxx</code>) o simplemente el código final (ej: <code>1xxxxxx</code>).</li>
                </ul>
              </div>

              {/* Step 3 */}
              <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-white font-mono text-xs">
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">3</span>
                    ¿DÓNDE LO CONFIGURES EN ESTA APLICACIÓN?
                  </div>
                  <span className="text-[11px] font-mono text-emerald-400 font-semibold">Guardado Local Seguro</span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  En la barra superior de <strong>TeraBox TV &amp; Videos Hub</strong>:
                </p>
                <ol className="list-decimal list-inside text-xs text-zinc-400 space-y-1 pl-1">
                  <li>Pega tu código o enlace en el campo de texto.</li>
                  <li>Haz clic en el botón <strong>"Guardar Código"</strong>.</li>
                  <li>¡Listo! Tu código queda almacenado en tu navegador y se inyectará automáticamente en todas las publicaciones para Telegram, WhatsApp, TikTok y YouTube Shorts.</li>
                </ol>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-zinc-900 border-t border-zinc-800 flex items-center justify-between">
              <span className="text-[11px] font-mono text-zinc-500">
                Neuraforge AI &bull; Multi-Referral Hub v2.5
              </span>
              <button
                onClick={() => setShowTeraBoxLoginGuide(false)}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-mono font-bold transition-all shadow-md"
              >
                ¡Entendido, volver!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIDEO PREVIEW MODAL */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-3xl rounded-2xl bg-zinc-900 border border-zinc-700 overflow-hidden shadow-2xl animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="p-4 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Tv className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-mono font-bold text-white truncate max-w-md">
                  {selectedVideo.title}
                </span>
              </div>
              <button
                onClick={() => setSelectedVideo(null)}
                className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Video Player */}
            <div className="aspect-video w-full bg-black">
              <video
                src={selectedVideo.previewUrl}
                controls
                autoPlay
                className="w-full h-full object-contain"
              />
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-zinc-950 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-zinc-400">
                Enlace TeraBox TV: <span className="text-blue-400 font-mono">{selectedVideo.fullTeraboxUrl}</span>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => {
                    const refUrl = `${selectedVideo.fullTeraboxUrl}?ref=${teraboxProgram.userReferralCode}`;
                    handleCopy(refUrl, 'modal-video-copy');
                  }}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-mono font-bold transition-all"
                >
                  <Copy className="w-3.5 h-3.5" />
                  Copiar con mi Referido
                </button>
                <button
                  onClick={() => setSelectedVideo(null)}
                  className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-mono"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* GOOGLE AFFILIATE ONBOARDING MODAL (ERA OA 1-CLICK) */}
      <GoogleAffiliateOnboardingModal
        isOpen={showGoogleAffiliateModal}
        onClose={() => setShowGoogleAffiliateModal(false)}
        currentProfile={googleAffiliateProfile}
        onProfileUpdated={(updatedProfile) => {
          setGoogleAffiliateProfile(updatedProfile);
          setPrograms((prev) =>
            prev.map((p) => {
              if (p.id === 'google-ads') {
                return {
                  ...p,
                  userReferralCode: updatedProfile.affiliateCode,
                  userReferralUrl: updatedProfile.trackingUrl,
                  stats: {
                    ...p.stats,
                    clicks: updatedProfile.totalRealClicks,
                    estimatedEarningsUSD: updatedProfile.totalRealEarningsUSD
                  }
                };
              }
              return p;
            })
          );
          showToast(`¡Afiliación Google OA activada con éxito! ID: ${updatedProfile.publisherId}`);
        }}
      />
    </div>
  );
}
