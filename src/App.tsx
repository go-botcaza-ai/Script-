import React, { useState, useEffect, useRef } from 'react';
import {
  Film,
  Lock,
  Play,
  ShieldCheck,
  Code,
  CreditCard,
  Settings,
  Sparkles,
  Search,
  CheckCircle2,
  Mail,
  Zap,
  Check,
  ChevronRight,
  Info,
  Database,
  Activity,
  Cpu,
  Layers,
  Box,
  Flame,
  Newspaper,
  CloudSun,
  AlertTriangle,
  LifeBuoy,
  Globe,
  Wallet
} from 'lucide-react';
import { ContentItem, PurchaseRecord, AccessTokenState } from './types';
import { INITIAL_CONTENT, PHP_SCRIPT_CONFIG } from './data';
import { initAuth } from './lib/auth';
import { AuthBar } from './components/AuthBar';
import { ContentCard } from './components/ContentCard';
import { CheckoutModal } from './components/CheckoutModal';
import { VideoPlayerModal } from './components/VideoPlayerModal';
import { PhpScriptViewer } from './components/PhpScriptViewer';
import { AdminPanel } from './components/AdminPanel';
import { AptosDataAgentPanel } from './components/AptosDataAgentPanel';
import { AptosLiveExplorer } from './components/AptosLiveExplorer';
import { AptosBigQueryStudio } from './components/AptosBigQueryStudio';
import { AptosHeroBlack } from './components/AptosHeroBlack';
import { MonetizedScriptsHub } from './components/MonetizedScriptsHub';
import { WebDiagnosticsErrors } from './components/WebDiagnosticsErrors';
import { NeuraforgeSupportDesk } from './components/NeuraforgeSupportDesk';
import { GrowthMarketingTrafficGuide } from './components/GrowthMarketingTrafficGuide';
import { BotcazaWalletGatewayHub } from './components/BotcazaWalletGatewayHub';

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<
    | 'data-agent'
    | 'wallet-gateway'
    | 'monetization'
    | 'growth-marketing'
    | 'diagnostics'
    | 'support'
    | 'live-explorer'
    | 'bigquery'
    | 'catalog'
    | 'script'
    | 'admin'
  >('data-agent');

  // Aptos network state
  const [currentNetwork, setCurrentNetwork] = useState<string>('mainnet');
  const agentSectionRef = useRef<HTMLDivElement>(null);

  // Catalog State
  const [contentList, setContentList] = useState<ContentItem[]>(() => {
    const saved = localStorage.getItem('ppv_custom_catalog');
    return saved ? JSON.parse(saved) : INITIAL_CONTENT;
  });

  const [purchasedRecords, setPurchasedRecords] = useState<PurchaseRecord[]>(() => {
    const saved = localStorage.getItem('ppv_purchases_history');
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals & Selected Content
  const [activeItemForCheckout, setActiveItemForCheckout] = useState<ContentItem | null>(null);
  const [activeItemForPlayer, setActiveItemForPlayer] = useState<ContentItem | null>(null);

  // Auth State
  const [authState, setAuthState] = useState<AccessTokenState>({
    userEmail: null,
    userName: null,
    userPhoto: null,
    accessToken: null,
    isAuthenticated: false,
  });
  const [authLoading, setAuthLoading] = useState(false);

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Smooth scroll to agent when clicking INITIALIZE AGENT on the black hero
  const handleScrollToAgent = () => {
    if (activeTab !== 'data-agent') {
      setActiveTab('data-agent');
    }
    setTimeout(() => {
      if (agentSectionRef.current) {
        agentSectionRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  // Init Google Auth listener on mount
  useEffect(() => {
    initAuth(
      (user, token) => {
        setAuthState({
          userEmail: user.email,
          userName: user.displayName,
          userPhoto: user.photoURL,
          accessToken: token,
          isAuthenticated: true,
        });
      },
      () => {
        setAuthState({
          userEmail: null,
          userName: null,
          userPhoto: null,
          accessToken: null,
          isAuthenticated: false,
        });
      }
    );
  }, []);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('ppv_purchases_history', JSON.stringify(purchasedRecords));
  }, [purchasedRecords]);

  useEffect(() => {
    localStorage.setItem('ppv_custom_catalog', JSON.stringify(contentList));
  }, [contentList]);

  // Check if an item is unlocked
  const isItemUnlocked = (itemId: string): boolean => {
    return purchasedRecords.some((p) => p.contentId === itemId && p.status === 'completed');
  };

  const getPurchaseRecordForItem = (itemId: string): PurchaseRecord | undefined => {
    return purchasedRecords.find((p) => p.contentId === itemId && p.status === 'completed');
  };

  // Handle successful purchase
  const handleUnlockSuccess = (record: PurchaseRecord) => {
    setPurchasedRecords((prev) => [record, ...prev]);
    setActiveItemForCheckout(null);

    const foundItem = contentList.find((i) => i.id === record.contentId);
    if (foundItem) {
      setActiveItemForPlayer(foundItem);
    }

    if (record.receiptSentViaGmail) {
      showToast('¡Pago completado! Se ha enviado el recibo y token de acceso a tu Gmail.');
    } else {
      showToast('¡Acceso Pay Per View desbloqueado con éxito!');
    }
  };

  // Admin content management
  const handleAddNewContent = (newItem: ContentItem) => {
    setContentList((prev) => [newItem, ...prev]);
    showToast('Nuevo contenido agregado al catálogo con protección Pay Per View.');
  };

  const handleDeleteContent = (id: string) => {
    setContentList((prev) => prev.filter((i) => i.id !== id));
    showToast('Contenido eliminado del catálogo.');
  };

  // Filter items
  const filteredItems = contentList.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.instructor.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div id="aptos-data-agent-platform" className="min-h-screen bg-black text-slate-100 flex flex-col font-sans selection:bg-[#00ff9d] selection:text-black">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          id="system-toast"
          className="fixed bottom-6 right-6 z-50 bg-zinc-900 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-2xl border border-emerald-500/50 flex items-center gap-2.5 animate-in slide-in-from-bottom"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Dark Top Navigation Bar */}
      <header id="main-header" className="sticky top-0 z-40 bg-black/90 backdrop-blur-md border-b border-zinc-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 lg:gap-6">
            <div
              className="flex items-center gap-2.5 cursor-pointer"
              onClick={() => setActiveTab('data-agent')}
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-500 text-black flex items-center justify-center shadow-[0_0_15px_rgba(0,255,157,0.3)]">
                <Zap className="w-5 h-5 fill-black text-black" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-base font-black tracking-tight text-white leading-none">
                    Neuraforge<span className="text-[#00ff9d]">AI</span>
                  </span>
                  <span className="text-[10px] font-mono font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-800/50 px-1.5 py-0.5 rounded">
                    Botcaza
                  </span>
                </div>
                <span className="text-[10px] font-mono text-zinc-400 leading-none">
                  Aptos Intelligence &bull; pub-9493850506792206
                </span>
              </div>
            </div>

            {/* Navigation Tabs Desktop */}
            <nav className="hidden lg:flex items-center gap-1 bg-zinc-900/90 border border-zinc-800 p-1 rounded-xl">
              <button
                id="nav-tab-data-agent"
                onClick={() => setActiveTab('data-agent')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                  activeTab === 'data-agent'
                    ? 'bg-[#00ff9d] text-black shadow-xs'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                Aptos AI Analytics
              </button>

              <button
                id="nav-tab-wallet-gateway"
                onClick={() => setActiveTab('wallet-gateway')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                  activeTab === 'wallet-gateway'
                    ? 'bg-[#00ff9d] text-black shadow-xs'
                    : 'text-zinc-400 hover:text-white border border-emerald-500/30'
                }`}
              >
                <Wallet className="w-3.5 h-3.5 text-emerald-400" />
                Botcaza Wallet Gateway
              </button>

              <button
                id="nav-tab-monetization"
                onClick={() => setActiveTab('monetization')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                  activeTab === 'monetization'
                    ? 'bg-[#00ff9d] text-black shadow-xs'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Newspaper className="w-3.5 h-3.5" />
                Scripts Monetizados
              </button>

              <button
                id="nav-tab-growth"
                onClick={() => setActiveTab('growth-marketing')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                  activeTab === 'growth-marketing'
                    ? 'bg-gradient-to-r from-blue-500 to-rose-500 text-white shadow-xs'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                Meta &bull; TikTok &bull; YT
              </button>

              <button
                id="nav-tab-diagnostics"
                onClick={() => setActiveTab('diagnostics')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                  activeTab === 'diagnostics'
                    ? 'bg-amber-400 text-black shadow-xs'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                Diagnóstico Web &amp; GA4
              </button>

              <button
                id="nav-tab-support"
                onClick={() => setActiveTab('support')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                  activeTab === 'support'
                    ? 'bg-cyan-400 text-black shadow-xs'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <LifeBuoy className="w-3.5 h-3.5" />
                Soporte
              </button>

              <button
                id="nav-tab-live-explorer"
                onClick={() => setActiveTab('live-explorer')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                  activeTab === 'live-explorer'
                    ? 'bg-zinc-800 text-white'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Activity className="w-3.5 h-3.5 text-emerald-400" />
                Explorador
              </button>

              <button
                id="nav-tab-bigquery"
                onClick={() => setActiveTab('bigquery')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                  activeTab === 'bigquery'
                    ? 'bg-zinc-800 text-white'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Database className="w-3.5 h-3.5 text-indigo-400" />
                BigQuery SQL
              </button>

              <button
                id="nav-tab-catalog"
                onClick={() => setActiveTab('catalog')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                  activeTab === 'catalog'
                    ? 'bg-zinc-800 text-white'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Film className="w-3.5 h-3.5 text-amber-400" />
                PPV Hub
              </button>
            </nav>
          </div>

          {/* Right actions: Google Auth & Stats */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setActiveTab('support')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-emerald-500/50 text-xs font-mono text-zinc-300 transition-all cursor-pointer"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Ayuda 24/7</span>
            </button>

            <AuthBar
              authState={authState}
              onAuthStateChange={setAuthState}
              isLoading={authLoading}
              setIsLoading={setAuthLoading}
            />
          </div>
        </div>

        {/* Mobile Submenu Navigation */}
        <div className="lg:hidden flex items-center gap-1 overflow-x-auto px-4 py-2 bg-zinc-950 border-t border-zinc-800/80">
          <button
            onClick={() => setActiveTab('data-agent')}
            className={`text-xs px-3 py-1.5 rounded-lg whitespace-nowrap font-mono font-bold ${
              activeTab === 'data-agent' ? 'bg-[#00ff9d] text-black' : 'text-zinc-400'
            }`}
          >
            Aptos Analytics
          </button>
          <button
            onClick={() => setActiveTab('wallet-gateway')}
            className={`text-xs px-3 py-1.5 rounded-lg whitespace-nowrap font-mono font-bold ${
              activeTab === 'wallet-gateway' ? 'bg-[#00ff9d] text-black' : 'text-zinc-400'
            }`}
          >
            ⚡ Botcaza Wallet
          </button>
          <button
            onClick={() => setActiveTab('monetization')}
            className={`text-xs px-3 py-1.5 rounded-lg whitespace-nowrap font-mono font-bold ${
              activeTab === 'monetization' ? 'bg-[#00ff9d] text-black' : 'text-zinc-400'
            }`}
          >
            Scripts Monetizados
          </button>
          <button
            onClick={() => setActiveTab('growth-marketing')}
            className={`text-xs px-3 py-1.5 rounded-lg whitespace-nowrap font-mono font-bold ${
              activeTab === 'growth-marketing' ? 'bg-gradient-to-r from-blue-500 to-rose-500 text-white' : 'text-zinc-400'
            }`}
          >
            Meta &bull; TikTok &bull; YT
          </button>
          <button
            onClick={() => setActiveTab('diagnostics')}
            className={`text-xs px-3 py-1.5 rounded-lg whitespace-nowrap font-mono font-bold ${
              activeTab === 'diagnostics' ? 'bg-amber-400 text-black' : 'text-zinc-400'
            }`}
          >
            Diagnóstico Web &amp; GA4
          </button>
          <button
            onClick={() => setActiveTab('support')}
            className={`text-xs px-3 py-1.5 rounded-lg whitespace-nowrap font-mono font-bold ${
              activeTab === 'support' ? 'bg-cyan-400 text-black' : 'text-zinc-400'
            }`}
          >
            Soporte 24/7
          </button>
          <button
            onClick={() => setActiveTab('live-explorer')}
            className={`text-xs px-3 py-1.5 rounded-lg whitespace-nowrap font-mono ${
              activeTab === 'live-explorer' ? 'bg-zinc-800 text-white' : 'text-zinc-400'
            }`}
          >
            Explorador
          </button>
          <button
            onClick={() => setActiveTab('bigquery')}
            className={`text-xs px-3 py-1.5 rounded-lg whitespace-nowrap font-mono ${
              activeTab === 'bigquery' ? 'bg-zinc-800 text-white' : 'text-zinc-400'
            }`}
          >
            BigQuery
          </button>
          <button
            onClick={() => setActiveTab('catalog')}
            className={`text-xs px-3 py-1.5 rounded-lg whitespace-nowrap font-mono ${
              activeTab === 'catalog' ? 'bg-zinc-800 text-white' : 'text-zinc-400'
            }`}
          >
            Catálogo PPV
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 w-full">
        
        {/* TAB 1: APTOS AI ANALYTICS (Black Cyber Hero + Interactive Google Data Agent Panel) */}
        {activeTab === 'data-agent' && (
          <div className="space-y-8">
            {/* The Black Cyber Hero matching User Reference Screenshot */}
            <AptosHeroBlack
              onInitializeAgent={handleScrollToAgent}
              currentNetwork={currentNetwork}
            />

            {/* Interactive Google Data Agent Query & On-chain Studio */}
            <div ref={agentSectionRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <AptosDataAgentPanel
                currentNetwork={currentNetwork}
                onNetworkChange={setCurrentNetwork}
                onSelectAccount={(addr) => {
                  setActiveTab('live-explorer');
                }}
              />
            </div>
          </div>
        )}

        {/* TAB 1.5: BOTCAZA WALLET & FIREBASE GATEWAY HUB */}
        {activeTab === 'wallet-gateway' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <BotcazaWalletGatewayHub
              userEmail={authState.userEmail || 'go.botcaza.ai@gmail.com'}
              onNavigateToCatalog={() => setActiveTab('catalog')}
            />
          </div>
        )}

        {/* TAB 2: MONETIZED SCRIPTS (News & Weather Click-to-Earn) */}
        {activeTab === 'monetization' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <MonetizedScriptsHub />
          </div>
        )}

        {/* TAB 2.5: GROWTH MARKETING & PRODUCTION PLAYBOOK (Meta, TikTok, YouTube, GitHub) */}
        {activeTab === 'growth-marketing' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <GrowthMarketingTrafficGuide />
          </div>
        )}

        {/* TAB 3: WEB & GA4 DIAGNOSTICS */}
        {activeTab === 'diagnostics' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <WebDiagnosticsErrors />
          </div>
        )}

        {/* TAB 4: NEURAFORGE SUPPORT DESK */}
        {activeTab === 'support' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <NeuraforgeSupportDesk userEmail="go.botcaza.ai@gmail.com" />
          </div>
        )}

        {/* TAB 5: LIVE APTOS EXPLORER */}
        {activeTab === 'live-explorer' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <AptosLiveExplorer
              currentNetwork={currentNetwork}
              onNetworkChange={setCurrentNetwork}
              onAskAgentAboutAddress={(addr) => {
                setActiveTab('data-agent');
              }}
            />
          </div>
        )}

        {/* TAB 6: BIGQUERY SQL STUDIO */}
        {activeTab === 'bigquery' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <AptosBigQueryStudio
              onAskAgentWithSql={(sqlPrompt) => {
                setActiveTab('data-agent');
              }}
            />
          </div>
        )}

        {/* TAB 7: PAY PER VIEW CATALOG */}
        {activeTab === 'catalog' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            <div className="bg-zinc-900/90 text-white rounded-2xl p-6 border border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[11px] font-bold uppercase tracking-wider">
                    Solución Avanzada Pay Per View
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Compatible con PayPal, Stripe y Gmail API
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                  Monetización de Contenido por Visualización (PPV)
                </h1>
                <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                  Genera ingresos cobrando por el acceso a videos y contenido premium con control de accesos, tokens criptográficos y recibos por correo electrónico.
                </p>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-zinc-900/80 p-4 rounded-2xl border border-zinc-800">
              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
                {[
                  { id: 'all', label: 'Todos' },
                  { id: 'masterclass', label: 'Masterclass' },
                  { id: 'course', label: 'Cursos' },
                  { id: 'event', label: 'Eventos en Vivo' },
                  { id: 'video', label: 'Videos' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                      selectedCategory === cat.id
                        ? 'bg-white text-black font-bold'
                        : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
                <input
                  id="catalog-search-input"
                  type="text"
                  placeholder="Buscar por título o temática..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-zinc-700 bg-zinc-950 text-white placeholder-zinc-500 focus:outline-hidden focus:ring-2 focus:ring-emerald-400 transition-colors font-mono"
                />
              </div>
            </div>

            {/* Catalog Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <ContentCard
                  key={item.id}
                  item={item}
                  isUnlocked={isItemUnlocked(item.id)}
                  onSelect={(selected) => setActiveItemForCheckout(selected)}
                  onDirectPlay={(selected) => setActiveItemForPlayer(selected)}
                />
              ))}
            </div>

            {filteredItems.length === 0 && (
              <div className="p-12 text-center bg-zinc-900 rounded-2xl border border-zinc-800 text-zinc-400 space-y-2">
                <Info className="w-8 h-8 text-zinc-400 mx-auto" />
                <h4 className="text-sm font-bold text-white">No se encontraron contenidos</h4>
                <p className="text-xs text-zinc-400">Prueba con otro término de búsqueda o categoría.</p>
              </div>
            )}
          </div>
        )}

        {/* TAB 8: PHP SCRIPT */}
        {activeTab === 'script' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <PhpScriptViewer />
          </div>
        )}

        {/* TAB 9: ADMIN */}
        {activeTab === 'admin' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <AdminPanel
              contentItems={contentList}
              purchases={purchasedRecords}
              onAddNewContent={handleAddNewContent}
              onDeleteItem={handleDeleteContent}
            />
          </div>
        )}

      </div>

      {/* Checkout Pay Per View Modal */}
      <CheckoutModal
        item={activeItemForCheckout}
        isOpen={!!activeItemForCheckout}
        onClose={() => setActiveItemForCheckout(null)}
        authState={authState}
        onAuthStateChange={setAuthState}
        onUnlockSuccess={handleUnlockSuccess}
      />

      {/* Video Streaming / Player Modal */}
      <VideoPlayerModal
        item={activeItemForPlayer}
        isOpen={!!activeItemForPlayer}
        onClose={() => setActiveItemForPlayer(null)}
        purchaseRecord={activeItemForPlayer ? getPurchaseRecordForItem(activeItemForPlayer.id) : undefined}
        isPurchased={activeItemForPlayer ? isItemUnlocked(activeItemForPlayer.id) : false}
        onInitiateCheckout={(item) => setActiveItemForCheckout(item)}
      />

      {/* Dark Footer */}
      <footer className="mt-auto border-t border-zinc-800/80 bg-black py-8 text-xs text-zinc-400 font-mono">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-white font-bold">NeuraforgeAI &bull; Botcaza Analytics</span>
            <span className="text-zinc-600 mx-2">|</span>
            <span>pub-9493850506792206</span>
            <span className="text-zinc-600 mx-2">|</span>
            <span>GA4: G-24Q6GBQN75</span>
            <span className="text-zinc-600 mx-2">|</span>
            <a href="mailto:go.botcaza.ai@gmail.com" className="text-emerald-400 hover:underline">
              go.botcaza.ai@gmail.com
            </a>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-zinc-400">
            <span className="text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Mainnet Live
            </span>
            <span>BigQuery crypto_aptos</span>
            <span>Gemini Data Agent</span>
            <span>ads.txt Verificado</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
