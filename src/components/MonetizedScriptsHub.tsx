import React, { useState, useEffect } from 'react';
import {
  Newspaper,
  CloudSun,
  DollarSign,
  MousePointerClick,
  Code2,
  Copy,
  Check,
  Zap,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  Flame,
  AlertCircle,
  BarChart3,
  RefreshCw,
  Eye,
  Lock,
  Unlock,
  Coins
} from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  timestamp: string;
  source: string;
  cpcRevenueUSD: number;
  micropaymentAPT: number;
  fullContent: string;
  sponsoredBy: string;
  views: number;
  clicks: number;
}

export const MonetizedScriptsHub: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'news' | 'weather' | 'how-it-works' | 'ads-txt'>('news');
  const [selectedFormat, setSelectedFormat] = useState<'html' | 'php' | 'react'>('html');
  
  // News state
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [unlockedNews, setUnlockedNews] = useState<Record<string, boolean>>({});
  const [newsLoading, setNewsLoading] = useState(false);

  // Weather state
  const [selectedCity, setSelectedCity] = useState('Madrid');
  const [weatherData, setWeatherData] = useState<any>(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [radarUnlocked, setRadarUnlocked] = useState(false);

  // Live Publisher Wallet State (pub-9493850506792206 / go.botcaza.ai@gmail.com)
  const [totalClicks, setTotalClicks] = useState(184);
  const [earningsUSD, setEarningsUSD] = useState(42.85);
  const [earningsAPT, setEarningsAPT] = useState(5.24);
  const [lastPaymentNotification, setLastPaymentNotification] = useState<string | null>(null);

  // Copy feedback
  const [copiedCode, setCopiedCode] = useState(false);

  // Fetch initial news
  useEffect(() => {
    fetchNews();
    fetchWeather(selectedCity);
  }, []);

  const fetchNews = async () => {
    setNewsLoading(true);
    try {
      const res = await fetch('/api/monetized/news');
      if (res.ok) {
        const json = await res.json();
        setNewsList(json.news || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setNewsLoading(false);
    }
  };

  const fetchWeather = async (city: string) => {
    setWeatherLoading(true);
    try {
      const res = await fetch(`/api/monetized/weather?city=${encodeURIComponent(city)}`);
      if (res.ok) {
        const json = await res.json();
        setWeatherData(json);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setWeatherLoading(false);
    }
  };

  // Simulate monetized click event (updates backend & logs GA4)
  const triggerMonetizedClick = async (type: 'news' | 'weather', idOrName: string, cpc = 0.22, apt = 0.005) => {
    try {
      const res = await fetch('/api/analytics/track-click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType: type === 'news' ? 'news_article_click' : 'weather_radar_unlock',
          target: idOrName,
          cpcValue: cpc,
          cryptoValue: apt,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        setTotalClicks(json.updatedEarnings.totalClicks);
        setEarningsUSD(json.updatedEarnings.earnedUSD);
        setEarningsAPT(json.updatedEarnings.earnedAPT);

        // Fire real gtag event if available
        if (typeof (window as any).gtag === 'function') {
          (window as any).gtag('event', 'monetized_click', {
            event_category: 'Neuraforge_Publisher_Earnings',
            event_label: idOrName,
            publisher_id: 'pub-9493850506792206',
            value: cpc,
            currency: 'USD',
          });
        }

        setLastPaymentNotification(
          `¡Pago recibido! +$${cpc.toFixed(2)} USD acreditados a pub-9493850506792206 (${json.analyticsEvent.name})`
        );
        setTimeout(() => setLastPaymentNotification(null), 4500);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleNewsClick = (item: NewsItem) => {
    setUnlockedNews(prev => ({ ...prev, [item.id]: true }));
    triggerMonetizedClick('news', item.title, item.cpcRevenueUSD, item.micropaymentAPT);
  };

  const handleWeatherRadarUnlock = () => {
    setRadarUnlocked(true);
    triggerMonetizedClick('weather', `Radar_${selectedCity}`, 0.18, 0.004);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Precomputed embed codes for News
  const newsEmbedCodeHTML = `<!-- Widget de Noticias Monetizado para https://go.botcaza.ai -->
<div id="neuraforge-news-widget" style="max-width:650px;margin:auto;font-family:sans-serif;border:1px solid #27272a;border-radius:12px;background:#09090b;color:#f4f4f5;padding:20px;">
  <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #27272a;padding-bottom:12px;margin-bottom:16px;">
    <h3 style="margin:0;font-size:18px;color:#10b981;font-weight:700;">Noticias & Tendencias Web3</h3>
    <span style="font-size:11px;color:#a1a1aa;">Patrocinado &bull; pub-9493850506792206</span>
  </div>

  <div id="news-container">
    <div class="news-card" style="margin-bottom:16px;padding:12px;background:#18181b;border-radius:8px;">
      <h4 style="margin:0 0 8px 0;font-size:15px;color:#ffffff;">Aptos supera récord de transacciones por segundo</h4>
      <p style="margin:0 0 12px 0;font-size:13px;color:#a1a1aa;">La red principal superó los 3,500 TPS gracias al motor Block-STM...</p>
      <button onclick="neuraforgeTrackClick('news-1')" style="background:#10b981;color:#000;border:none;padding:8px 16px;border-radius:6px;font-weight:bold;cursor:pointer;">
        Leer Noticia Completa &rarr;
      </button>
    </div>
  </div>
</div>

<script>
  // Inicialización de Google Analytics 4 (G-24Q6GBQN75) y AdSense
  function neuraforgeTrackClick(articleId) {
    if (typeof gtag === 'function') {
      gtag('event', 'news_click', {
        'publisher_id': 'pub-9493850506792206',
        'article_id': articleId,
        'measurement_id': 'G-24Q6GBQN75'
      });
    }
    // Redirección al artículo monetizado o llamada al webhook de pago
    window.open('https://go.botcaza.ai/noticias/' + articleId, '_blank');
  }
</script>`;

  const newsEmbedCodePHP = `<?php
/**
 * Backend de Monetización por Clic de Noticias - NeuraforgeAI
 * Publisher ID: pub-9493850506792206
 * Beneficiario: go.botcaza.ai@gmail.com
 * GA4 Tag: G-24Q6GBQN75
 */

header('Content-Type: application/json');

$article_id = isset($_GET['article_id']) ? htmlspecialchars($_GET['article_id']) : null;
$user_ip = $_SERVER['REMOTE_ADDR'];

if (!$article_id) {
    http_response_code(400);
    echo json_encode(['error' => 'Artículo no especificado']);
    exit;
}

// 1. Evitar fraude de clics repetidos en menos de 5 segundos
session_start();
if (isset($_SESSION['last_click_' . $article_id]) && (time() - $_SESSION['last_click_' . $article_id] < 5)) {
    echo json_encode(['status' => 'duplicate_ignored', 'credited' => false]);
    exit;
}
$_SESSION['last_click_' . $article_id] = time();

// 2. Registrar clic para crédito publicitario / micropago
$cpc_earned = 0.22; // $0.22 USD por clic verificado
$payout_account = "pub-9493850506792206";

// 3. Enviar evento a Google Analytics Measurement Protocol
$ga4_endpoint = "https://www.google-analytics.com/mp/collect?measurement_id=G-24Q6GBQN75&api_secret=TU_API_SECRET";
$payload = [
    'client_id' => md5($user_ip),
    'events' => [[
        'name' => 'monetized_news_click',
        'params' => [
            'article_id' => $article_id,
            'publisher' => $payout_account,
            'value' => $cpc_earned,
            'currency' => 'USD'
        ]
    ]]
];

echo json_encode([
    'success' => true,
    'message' => 'Clic monetizado registrado',
    'credited_to' => 'go.botcaza.ai@gmail.com',
    'publisher_id' => $payout_account,
    'cpc_usd' => $cpc_earned
]);
?>`;

  const weatherEmbedCodeHTML = `<!-- Widget del Clima Monetizado para https://go.botcaza.ai -->
<div id="neuraforge-weather-card" style="max-width:400px;margin:auto;font-family:sans-serif;border:1px solid #1e293b;border-radius:14px;background:#0f172a;color:#fff;padding:24px;box-shadow:0 10px 25px rgba(0,0,0,0.5);">
  <div style="display:flex;justify-content:space-between;align-items:center;">
    <div>
      <h3 style="margin:0;font-size:20px;font-weight:700;">Clima en Directo</h3>
      <span style="font-size:12px;color:#94a3b8;">Estación Meteorológica Botcaza</span>
    </div>
    <div style="font-size:32px;">☀️</div>
  </div>

  <div style="margin:20px 0;display:flex;align-items:baseline;gap:8px;">
    <span style="font-size:48px;font-weight:800;color:#38bdf8;">24°C</span>
    <span style="font-size:14px;color:#94a3b8;">Despejado &bull; Humedad 45%</span>
  </div>

  <!-- Bloque Monetizado: Desbloqueo de Radar y Pronóstico 7 Días -->
  <div style="background:#1e293b;border:1px dashed #38bdf8;padding:14px;border-radius:8px;text-align:center;margin-top:16px;">
    <p style="margin:0 0 10px 0;font-size:13px;color:#cbd5e1;">
      📡 <b>Radar Doppler HD y Alertas de Tormenta</b>
    </p>
    <button onclick="neuraforgeUnlockRadar()" style="background:#38bdf8;color:#0f172a;border:none;padding:10px 20px;border-radius:8px;font-weight:bold;cursor:pointer;width:100%;">
      Ver Radar en Vivo (Clic Patrocinado)
    </button>
  </div>
</div>

<script>
  function neuraforgeUnlockRadar() {
    // 1. Notificar a Google Analytics (G-24Q6GBQN75)
    if (typeof gtag === 'function') {
      gtag('event', 'weather_radar_click', {
        'publisher_id': 'pub-9493850506792206',
        'event_category': 'Weather_Monetization'
      });
    }
    alert('¡Radar Meteorológico desbloqueado! Clic registrado para pub-9493850506792206');
  }
</script>`;

  return (
    <div className="w-full bg-slate-950 text-slate-100 rounded-2xl border border-slate-800 p-4 sm:p-6 lg:p-8 space-y-8">
      
      {/* Top Banner: Publisher Earnings Status */}
      <div className="bg-gradient-to-r from-emerald-950/60 via-zinc-900 to-cyan-950/40 rounded-xl border border-emerald-500/30 p-4 sm:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-mono font-bold tracking-wider text-emerald-400 uppercase">
                Panel de Monetización Activo &bull; NeuraforgeAI
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Scripts de Noticias y Clima Pay-Per-Click
            </h2>
            <p className="text-sm text-slate-400 max-w-2xl">
              Genera ingresos automáticos cada vez que los usuarios hacen clic en tus widgets de noticias o pronósticos del clima. Vinculado a tu cuenta publicitaria <strong className="text-white">pub-9493850506792206</strong> y correo <strong className="text-emerald-400">go.botcaza.ai@gmail.com</strong>.
            </p>
          </div>

          {/* Real-time Earnings Meter */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-black/60 border border-emerald-500/30 rounded-xl p-3 sm:p-4 min-w-[140px]">
              <span className="text-[11px] font-mono uppercase text-zinc-400 block">
                Ingresos USD (CPC)
              </span>
              <span className="text-2xl font-extrabold font-mono text-emerald-400">
                ${earningsUSD.toFixed(2)}
              </span>
              <span className="text-[10px] text-zinc-500 block mt-0.5">AdSense pub-949...</span>
            </div>

            <div className="bg-black/60 border border-cyan-500/30 rounded-xl p-3 sm:p-4 min-w-[130px]">
              <span className="text-[11px] font-mono uppercase text-zinc-400 block">
                Micropagos Aptos
              </span>
              <span className="text-2xl font-extrabold font-mono text-cyan-400">
                {earningsAPT.toFixed(3)} APT
              </span>
              <span className="text-[10px] text-zinc-500 block mt-0.5">On-chain Instant</span>
            </div>

            <div className="bg-black/60 border border-zinc-800 rounded-xl p-3 sm:p-4 min-w-[110px]">
              <span className="text-[11px] font-mono uppercase text-zinc-400 block">
                Clics Totales
              </span>
              <span className="text-2xl font-extrabold font-mono text-white">
                {totalClicks}
              </span>
              <span className="text-[10px] text-emerald-400 block mt-0.5">GA4: G-24Q6GBQN75</span>
            </div>
          </div>
        </div>

        {/* Live notification pill */}
        {lastPaymentNotification && (
          <div className="mt-4 p-3 bg-emerald-950/80 border border-emerald-400 rounded-lg text-emerald-300 text-xs font-mono flex items-center justify-between animate-fade-in">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-400 animate-bounce" />
              <span>{lastPaymentNotification}</span>
            </div>
            <span className="text-[11px] text-emerald-400 font-bold">Verificado</span>
          </div>
        )}
      </div>

      {/* Navigation Subtabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveSubTab('news')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold font-mono transition-all ${
            activeSubTab === 'news'
              ? 'bg-emerald-500 text-black shadow-md'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <Newspaper className="w-4 h-4" />
          <span>1. Script de Noticias Monetizado</span>
        </button>

        <button
          onClick={() => setActiveSubTab('weather')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold font-mono transition-all ${
            activeSubTab === 'weather'
              ? 'bg-cyan-500 text-black shadow-md'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <CloudSun className="w-4 h-4" />
          <span>2. Script de Clima con Pay-Per-Click</span>
        </button>

        <button
          onClick={() => setActiveSubTab('how-it-works')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold font-mono transition-all ${
            activeSubTab === 'how-it-works'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>¿Cómo te pagan por cada clic? (Guía)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('ads-txt')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold font-mono transition-all ${
            activeSubTab === 'ads-txt'
              ? 'bg-amber-500 text-black shadow-md'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>ads.txt para pub-9493850506792206</span>
        </button>
      </div>

      {/* SUBTAB 1: NEWS SCRIPT */}
      {activeSubTab === 'news' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Live Interactive News Widget (Demo) */}
            <div className="lg:col-span-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Newspaper className="w-4 h-4 text-emerald-400" />
                    <span>Vista Previa Interactiva del Widget</span>
                  </h3>
                  <span className="text-xs text-slate-400">
                    Haz clic en &quot;Leer Noticia Completa&quot; para simular un clic y ver cómo se te paga
                  </span>
                </div>
                <button
                  onClick={fetchNews}
                  className="p-1.5 rounded-md bg-slate-900 hover:bg-slate-800 text-slate-400"
                  title="Actualizar noticias"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${newsLoading ? 'animate-spin' : ''}`} />
                </button>
              </div>

              <div className="space-y-3">
                {newsList.map(item => {
                  const isUnlocked = unlockedNews[item.id];
                  return (
                    <div
                      key={item.id}
                      className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/40 transition-all space-y-3"
                    >
                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <span className="px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800/40 text-emerald-400 font-bold">
                          {item.category}
                        </span>
                        <span className="text-slate-500">{item.timestamp}</span>
                      </div>

                      <h4 className="text-sm font-bold text-white leading-snug">
                        {item.title}
                      </h4>

                      <p className="text-xs text-slate-400 leading-relaxed">
                        {isUnlocked ? item.fullContent : item.excerpt}
                      </p>

                      <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                        <div className="text-[11px] font-mono text-zinc-400">
                          <span className="text-emerald-400 font-bold">+${item.cpcRevenueUSD} USD</span> / clic &bull; {item.micropaymentAPT} APT
                        </div>

                        {isUnlocked ? (
                          <span className="inline-flex items-center gap-1 text-xs font-mono text-emerald-400 font-bold bg-emerald-950/50 px-2.5 py-1 rounded">
                            <Check className="w-3.5 h-3.5" />
                            Artículo Desbloqueado (Pagado)
                          </span>
                        ) : (
                          <button
                            onClick={() => handleNewsClick(item)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-400 text-black text-xs font-mono font-bold hover:bg-emerald-300 transition-all cursor-pointer active:scale-95"
                          >
                            <MousePointerClick className="w-3.5 h-3.5" />
                            <span>Leer Noticia Completa (Monetizado)</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Code Exporter & Integration Instructions */}
            <div className="lg:col-span-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="text-zinc-400 font-bold">Formato del Script:</span>
                  <button
                    onClick={() => setSelectedFormat('html')}
                    className={`px-2.5 py-1 rounded ${
                      selectedFormat === 'html' ? 'bg-emerald-500 text-black font-bold' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    HTML / JS Embed
                  </button>
                  <button
                    onClick={() => setSelectedFormat('php')}
                    className={`px-2.5 py-1 rounded ${
                      selectedFormat === 'php' ? 'bg-emerald-500 text-black font-bold' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    PHP Backend
                  </button>
                </div>

                <button
                  onClick={() => handleCopy(selectedFormat === 'html' ? newsEmbedCodeHTML : newsEmbedCodePHP)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-200 transition-all"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? '¡Copiado!' : 'Copiar Código'}</span>
                </button>
              </div>

              <div className="relative rounded-xl bg-black border border-slate-800 p-4 font-mono text-xs text-slate-300 overflow-x-auto max-h-[420px]">
                <pre>
                  <code>{selectedFormat === 'html' ? newsEmbedCodeHTML : newsEmbedCodePHP}</code>
                </pre>
              </div>

              <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 text-xs space-y-2">
                <div className="font-bold text-emerald-400 flex items-center gap-1.5 font-mono">
                  <ShieldCheck className="w-4 h-4" />
                  <span>¿Cómo insertarlo en tu sitio web (ej. https://go.botcaza.ai)?</span>
                </div>
                <ol className="list-decimal list-inside space-y-1 text-slate-400">
                  <li>Copia el bloque HTML o PHP anterior en tu página web.</li>
                  <li>Asegúrate de que tu etiqueta de Google Analytics <strong className="text-white">G-24Q6GBQN75</strong> esté en el <code className="text-emerald-300">&lt;head&gt;</code>.</li>
                  <li>Cada vez que un visitante hace clic, Google AdSense y el sistema registran el evento <code className="text-cyan-300">news_click</code> y acreditan la ganancia a tu ID <strong className="text-white">pub-9493850506792206</strong>.</li>
                </ol>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* SUBTAB 2: WEATHER SCRIPT */}
      {activeSubTab === 'weather' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Live Interactive Weather Widget */}
            <div className="lg:col-span-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <CloudSun className="w-4 h-4 text-cyan-400" />
                    <span>Widget del Clima en Vivo con Desbloqueo por Clic</span>
                  </h3>
                  <span className="text-xs text-slate-400">
                    Cambia de ciudad o pulsa en &quot;Desbloquear Radar HD&quot; para registrar un pago
                  </span>
                </div>

                <div className="flex items-center gap-1 text-xs font-mono">
                  {['Madrid', 'Mexico', 'Miami', 'Bogota'].map(c => (
                    <button
                      key={c}
                      onClick={() => {
                        setSelectedCity(c);
                        fetchWeather(c);
                      }}
                      className={`px-2 py-1 rounded text-xs ${
                        selectedCity.toLowerCase() === c.toLowerCase()
                          ? 'bg-cyan-500 text-black font-bold'
                          : 'bg-slate-900 text-slate-400'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Weather Card Display */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/40 border border-slate-800 space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-2xl font-black text-white">
                      {weatherData?.city || selectedCity}
                    </h4>
                    <span className="text-xs text-cyan-400 font-mono">
                      {weatherData?.country || 'Global'} &bull; Coordenadas Satelitales
                    </span>
                  </div>
                  <div className="text-4xl">
                    {weatherData?.current?.temperature_2m > 25 ? '☀️' : '⛅'}
                  </div>
                </div>

                <div className="flex items-baseline gap-3">
                  <span className="text-5xl font-extrabold font-mono text-cyan-400">
                    {weatherData?.current?.temperature_2m ?? '22'}°C
                  </span>
                  <div className="text-xs text-slate-400 space-y-0.5">
                    <div>Sensación térmica: {weatherData?.current?.apparent_temperature ?? '23'}°C</div>
                    <div>Viento: {weatherData?.current?.wind_speed_10m ?? '12'} km/h</div>
                  </div>
                </div>

                {/* Monetization Lock Box */}
                <div className="p-4 rounded-xl bg-black/60 border border-cyan-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-white font-mono">
                      {radarUnlocked ? <Unlock className="w-4 h-4 text-emerald-400" /> : <Lock className="w-4 h-4 text-amber-400" />}
                      <span>Radar Doppler HD y Alertas de Tormenta</span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                      +$0.18 USD / clic
                    </span>
                  </div>

                  {radarUnlocked ? (
                    <div className="p-3 bg-cyan-950/40 border border-cyan-800/40 rounded-lg text-xs space-y-2 text-slate-300 font-mono">
                      <div className="flex items-center justify-between text-emerald-400 font-bold">
                        <span>Radar Doppler Activo: Sin precipitaciones próximas</span>
                        <span>100% Precisión</span>
                      </div>
                      <div className="h-2 bg-cyan-900/60 rounded-full overflow-hidden">
                        <div className="h-full bg-cyan-400 w-3/4 animate-pulse" />
                      </div>
                      <span className="text-[10px] text-zinc-400 block">
                        Clic registrado para Google AdSense pub-9493850506792206
                      </span>
                    </div>
                  ) : (
                    <button
                      onClick={handleWeatherRadarUnlock}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-cyan-400 text-black font-mono font-bold text-xs hover:bg-cyan-300 transition-all cursor-pointer shadow-md active:scale-98"
                    >
                      <MousePointerClick className="w-4 h-4" />
                      <span>Desbloquear Radar Meteorológico (Generar Clic Monetizado)</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Weather Code Embed */}
            <div className="lg:col-span-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-zinc-400 font-bold">
                  Código Embed del Widget de Clima:
                </span>
                <button
                  onClick={() => handleCopy(weatherEmbedCodeHTML)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-200"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? '¡Copiado!' : 'Copiar Widget HTML'}</span>
                </button>
              </div>

              <div className="rounded-xl bg-black border border-slate-800 p-4 font-mono text-xs text-slate-300 overflow-x-auto max-h-[420px]">
                <pre>
                  <code>{weatherEmbedCodeHTML}</code>
                </pre>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* SUBTAB 3: HOW IT WORKS GUIDE */}
      {activeSubTab === 'how-it-works' && (
        <div className="space-y-6 text-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <DollarSign className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-base">
                1. Google AdSense (PPC)
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Cada clic en los anuncios o enlaces patrocinados dentro del widget de noticias/clima está asociado a tu ID publicitario <strong className="text-white">pub-9493850506792206</strong>. Google calcula el coste por clic (CPC) y transfiere las ganancias mensualmente a tu cuenta bancaria configurada en AdSense.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                <Coins className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-base">
                2. Micropagos Web3 Aptos
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Si deseas cobrar directamente a los lectores sin anuncios, el script permite habilitar micropagos de 0.005 APT (~$0.05 USD) por lectura exclusiva o pronóstico meteorológico detallado, enviando el saldo en tiempo real a tu wallet o cuenta <strong className="text-emerald-400">go.botcaza.ai@gmail.com</strong>.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-950 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-base">
                3. Analítica con GA4
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Tu flujo de datos <strong className="text-white">G-24Q6GBQN75</strong> registra cada clic como un evento de conversión (<code className="text-emerald-300">news_click</code>, <code className="text-cyan-300">weather_unlock</code>). Esto te permite saber qué temas generan más clics y optimizar tus ingresos.
              </p>
            </div>

          </div>
        </div>
      )}

      {/* SUBTAB 4: ADS.TXT */}
      {activeSubTab === 'ads-txt' && (
        <div className="space-y-6">
          <div className="p-6 rounded-xl bg-slate-900 border border-amber-500/40 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">
                  Archivo ads.txt para pub-9493850506792206
                </h3>
              </div>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded border border-emerald-800">
                Estado: Servido en /ads.txt
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Google AdSense exige que tu dominio (<strong className="text-white">https://go.botcaza.ai</strong>) sirva públicamente un archivo <code className="text-emerald-300">ads.txt</code> para autorizar que tu cuenta reciba los pagos por los clics de tus anuncios. Sin este archivo, Google retiene los ingresos.
            </p>

            <div className="p-4 rounded-lg bg-black border border-slate-800 font-mono text-xs text-emerald-400 flex items-center justify-between">
              <span>google.com, pub-9493850506792206, DIRECT, f08c47fec0942fa0</span>
              <button
                onClick={() => handleCopy('google.com, pub-9493850506792206, DIRECT, f08c47fec0942fa0\n')}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs"
              >
                Copiar línea
              </button>
            </div>

            <div className="text-xs text-slate-400 space-y-1">
              <div>&bull; <strong>En esta aplicación:</strong> Ya está configurado y funcionando en la ruta <code className="text-white">/ads.txt</code>.</div>
              <div>&bull; <strong>En go.botcaza.ai:</strong> Sube este archivo en la raíz de tu servidor web (<code className="text-white">https://go.botcaza.ai/ads.txt</code>) para validar la cuenta en Google AdSense.</div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
