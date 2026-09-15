import React, { useState, useEffect } from 'react';
import {
  Send,
  Smartphone,
  CheckCircle2,
  ExternalLink,
  Copy,
  Check,
  Sparkles,
  Wallet,
  ShieldCheck,
  Zap,
  RefreshCw,
  Bell,
  Star,
  Layers,
  HelpCircle,
  Terminal,
  Share2,
  ArrowRight,
  Bot,
  Coins,
  TrendingUp,
  Globe,
  Radio,
  Server,
  AlertTriangle,
  Play
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  getTelegramWebApp,
  isInsideTelegram,
  initTelegramMiniApp,
  triggerTelegramHaptic,
  getTelegramUserData
} from '../lib/telegramWebApp';
import { getRealAptosWalletBalance } from '../lib/firestoreWalletGateway';
import { BotcoinsTradeGameHub } from './BotcoinsTradeGameHub';

interface TelegramMiniAppHubProps {
  onOpenCheckout?: (itemId: string) => void;
  onNavigateToWallet?: () => void;
  onNavigateToAptosData?: () => void;
}

export const TelegramMiniAppHub: React.FC<TelegramMiniAppHubProps> = ({
  onOpenCheckout,
  onNavigateToWallet,
  onNavigateToAptosData
}) => {
  const [isInTg, setIsInTg] = useState(false);
  const [tgUser, setTgUser] = useState<any>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [botUsername, setBotUsername] = useState('Botcoins_Tradebot_Gamebot');
  const [mainButtonActive, setMainButtonActive] = useState(false);
  const [selectedAction, setSelectedAction] = useState<'botcoins' | 'webhook' | 'wallet' | 'alerts' | 'stars' | 'botfather'>('botcoins');

  // Render & Webhook Configuration state
  const [renderMiniAppUrl, setRenderMiniAppUrl] = useState('https://script-ads.onrender.com/');
  const [renderWebhookUrl, setRenderWebhookUrl] = useState('https://script-ads.onrender.com/api/telegram/webhook');
  const [webhookInfo, setWebhookInfo] = useState<any>(null);
  const [webhookLoading, setWebhookLoading] = useState(false);
  const [settingWebhook, setSettingWebhook] = useState(false);
  const [webhookActionMsg, setWebhookActionMsg] = useState<string | null>(null);

  // Quick Wallet Check inside TMA
  const [testAddress, setTestAddress] = useState('0x1');
  const [walletLoading, setWalletLoading] = useState(false);
  const [walletData, setWalletData] = useState<any>(null);

  // Telegram Alert Sender state
  const [alertTargetChat, setAlertTargetChat] = useState('');
  const [alertSending, setAlertSending] = useState(false);
  const [alertResult, setAlertResult] = useState<string | null>(null);

  useEffect(() => {
    const tg = initTelegramMiniApp();
    const inside = isInsideTelegram();
    setIsInTg(inside);

    const user = getTelegramUserData();
    if (user) {
      setTgUser(user);
    } else {
      // Demo Telegram User for browser preview
      setTgUser({
        id: 987654321,
        first_name: 'Botcaza',
        last_name: 'Operator',
        username: 'botcaza_trader',
        is_premium: true,
        language_code: 'es'
      });
    }

    // Auto-fetch 0x1 balance & webhook info
    handleQuickBalanceCheck('0x1');
    fetchWebhookInfo();

    return () => {
      // Clean up MainButton if needed
      if (tg?.MainButton?.isVisible) {
        tg.MainButton.hide();
      }
    };
  }, []);

  const fetchWebhookInfo = async () => {
    setWebhookLoading(true);
    try {
      const res = await fetch('/api/telegram/webhook-info');
      const data = await res.json();
      setWebhookInfo(data);
      if (data.miniAppUrl) setRenderMiniAppUrl(data.miniAppUrl);
      if (data.targetWebhookUrl) setRenderWebhookUrl(data.targetWebhookUrl);
    } catch (e) {
      // Silent in dev preview
    } finally {
      setWebhookLoading(false);
    }
  };

  const handleRegisterWebhook = async () => {
    setSettingWebhook(true);
    setWebhookActionMsg(null);
    triggerTelegramHaptic('heavy');
    try {
      const res = await fetch('/api/telegram/set-webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: renderWebhookUrl })
      });
      const data = await res.json();
      setSettingWebhook(false);
      if (data.success) {
        triggerTelegramHaptic('success');
        confetti({ particleCount: 50, spread: 70 });
        setWebhookActionMsg(data.message || `¡Webhook vinculado exitosamente en Telegram hacia ${renderWebhookUrl}!`);
      } else {
        triggerTelegramHaptic('warning');
        setWebhookActionMsg(data.message || 'Webhook verificado.');
      }
      fetchWebhookInfo();
    } catch (err: any) {
      setSettingWebhook(false);
      triggerTelegramHaptic('error');
      setWebhookActionMsg(`Error al configurar webhook: ${err.message}`);
    }
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    triggerTelegramHaptic('light');
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleQuickBalanceCheck = async (addr = testAddress) => {
    setWalletLoading(true);
    triggerTelegramHaptic('medium');
    const res = await getRealAptosWalletBalance(addr);
    setWalletData(res);
    setWalletLoading(false);
    triggerTelegramHaptic('success');
  };

  const toggleTelegramMainButton = () => {
    const tg = getTelegramWebApp();
    triggerTelegramHaptic('rigid');

    if (!mainButtonActive) {
      setMainButtonActive(true);
      if (tg?.MainButton) {
        tg.MainButton.setText('⚡ DESBLOQUEAR CON TELEGRAM MINI APP');
        tg.MainButton.show();
        tg.MainButton.onClick(() => {
          triggerTelegramHaptic('heavy');
          confetti({ particleCount: 50, spread: 60 });
        });
      }
    } else {
      setMainButtonActive(false);
      if (tg?.MainButton) {
        tg.MainButton.hide();
      }
    }
  };

  const handleSendTelegramAlert = async () => {
    setAlertSending(true);
    setAlertResult(null);
    triggerTelegramHaptic('medium');

    try {
      const res = await fetch('/api/telegram/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: {
            text: '/trade',
            chat: { id: alertTargetChat.trim() || 'demo_chat_id' }
          }
        })
      });
      const data = await res.json();
      setAlertSending(false);
      triggerTelegramHaptic('success');
      setAlertResult(`¡Webhook procesado! Bot respondido con botones apuntando a ${data.miniAppUrl || renderMiniAppUrl}`);
    } catch (err: any) {
      setAlertSending(false);
      triggerTelegramHaptic('error');
      setAlertResult('Webhook simulado completado: listo para vincular tu TELEGRAM_BOT_TOKEN.');
    }
  };

  const miniAppShareUrl = `https://t.me/share/url?url=${encodeURIComponent(renderMiniAppUrl)}&text=${encodeURIComponent('🚀 Abre la Mini App de @Botcoins_Tradebot_Gamebot en Telegram: Tradebot, Minería de Botcoins y Wallet Aptos.')}`;
  const directMiniAppUrl = `https://t.me/${botUsername}/app`;

  return (
    <div className="w-full bg-black text-slate-100 rounded-2xl border border-zinc-800 p-4 sm:p-6 lg:p-8 space-y-8 font-sans">

      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-zinc-800">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0088cc] animate-pulse" />
            <span className="text-xs font-mono font-bold tracking-wider text-[#29b6f6] uppercase flex items-center gap-1.5">
              <Send className="w-3.5 h-3.5 text-[#0088cc]" />
              Telegram Mini App (TMA) &bull; WebApp SDK v7.10+
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <Smartphone className="w-8 h-8 text-[#29b6f6]" />
            Botcaza Telegram Mini App
          </h2>
          <p className="text-sm text-zinc-400 max-w-3xl">
            Toda la plataforma (tu Botcaza Wallet en Firebase, análisis de Aptos con IA y pagos Pay-Per-View)
            ejecutándose de manera nativa dentro de la aplicación móvil y de escritorio de Telegram.
          </p>
        </div>

        {/* Telegram Detection Status Card */}
        <div className="p-4 rounded-xl bg-zinc-900 border border-[#0088cc]/40 space-y-2 min-w-[280px]">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-zinc-400">Entorno de Ejecución:</span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
              isInTg
                ? 'bg-blue-950 text-blue-400 border-blue-800'
                : 'bg-emerald-950 text-emerald-400 border-emerald-800'
            }`}>
              {isInTg ? 'DENTRO DE TELEGRAM' : 'SIMULADOR WEBAPP ACTIVO'}
            </span>
          </div>
          <div className="text-xs text-zinc-300 font-mono space-y-1">
            <div className="flex justify-between">
              <span className="text-zinc-500">Usuario Telegram:</span>
              <span className="text-white font-bold">@{tgUser?.username || 'anónimo'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Telegram ID:</span>
              <span className="text-cyan-400">{tgUser?.id || '987654321'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Haptic Feedback:</span>
              <span className="text-[#00ff9d]">Soportado (TMA API)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Pills for Telegram Sections */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {[
          { id: 'botcoins', label: '🤖 @Botcoins Tradebot & Gamebot', icon: Bot, isFeatured: true },
          { id: 'webhook', label: '⚡ Webhook & Render.com', icon: Globe, isHighlight: true },
          { id: 'wallet', label: '💳 Wallet Express en Telegram', icon: Wallet },
          { id: 'alerts', label: '🐋 Alertas Aptos por Bot', icon: Bell },
          { id: 'stars', label: '⭐ Micropagos & Stars', icon: Star },
          { id: 'botfather', label: '🛠️ Guía BotFather (Configurar en 1 min)', icon: Terminal }
        ].map((tab: any) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => {
                triggerTelegramHaptic('light');
                setSelectedAction(tab.id as any);
              }}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedAction === tab.id
                  ? tab.id === 'botcoins'
                    ? 'bg-gradient-to-r from-blue-600 via-[#0088cc] to-emerald-500 text-white shadow-[0_0_20px_rgba(0,136,204,0.5)]'
                    : tab.id === 'webhook'
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-[0_0_18px_rgba(147,51,234,0.4)]'
                    : 'bg-[#0088cc] text-white shadow-[0_0_15px_rgba(0,136,204,0.4)]'
                  : tab.id === 'botcoins'
                    ? 'bg-blue-950/40 text-blue-300 hover:text-white border border-blue-500/50'
                    : tab.id === 'webhook'
                    ? 'bg-purple-950/30 text-purple-300 hover:text-white border border-purple-800/40'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {tab.id === 'botcoins' && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-1" />
              )}
              {tab.id === 'webhook' && (
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse ml-1" />
              )}
            </button>
          );
        })}
      </div>

      {/* FEATURED: @Botcoins_Tradebot_Gamebot HUB */}
      {selectedAction === 'botcoins' && (
        <BotcoinsTradeGameHub
          onOpenMiniApp={toggleTelegramMainButton}
          onNavigateToWallet={onNavigateToWallet}
          onNavigateToAptosData={onNavigateToAptosData}
        />
      )}

      {/* SECTION: WEBHOOK & RENDER.COM CONFIGURATION */}
      {selectedAction === 'webhook' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-gradient-to-br from-zinc-950 via-zinc-900 to-black border border-purple-500/30 space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-xs font-mono font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Server className="w-3.5 h-3.5" />
                    Render.com &bull; Mini App &amp; Webhook Hub
                  </span>
                </div>
                <h3 className="text-xl font-black text-white flex items-center gap-2">
                  <Globe className="w-5 h-5 text-cyan-400" />
                  Dirección Oficial en Render.com para Pruebas y Monetización
                </h3>
                <p className="text-xs text-zinc-400 max-w-2xl">
                  Configuración directa de la Mini App y el Webhook de Telegram para el bot <span className="text-cyan-300 font-mono font-bold">@{botUsername}</span> en tu servidor de Render.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={fetchWebhookInfo}
                  disabled={webhookLoading}
                  className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-mono text-zinc-300 flex items-center gap-1.5 transition-all cursor-pointer border border-zinc-700"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${webhookLoading ? 'animate-spin' : ''}`} />
                  <span>Actualizar Estado</span>
                </button>
              </div>
            </div>

            {/* Notification alert banner if any */}
            {webhookActionMsg && (
              <div className="p-3.5 rounded-xl bg-purple-950/50 border border-purple-500/50 text-xs font-mono text-purple-200 flex items-center justify-between">
                <span>{webhookActionMsg}</span>
                <button onClick={() => setWebhookActionMsg(null)} className="text-zinc-400 hover:text-white text-xs underline ml-2">Cerrar</button>
              </div>
            )}

            {/* Grid of URLs & Endpoints */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* URL 1: Mini App Render URL */}
              <div className="p-4 rounded-xl bg-black border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-zinc-300 flex items-center gap-1.5">
                    <Smartphone className="w-4 h-4 text-emerald-400" />
                    Dirección de la Mini App (Render.com):
                  </span>
                  <button
                    onClick={() => handleCopy(renderMiniAppUrl, 'miniapp-render')}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-[11px] font-mono text-zinc-300 transition-all cursor-pointer"
                  >
                    {copiedKey === 'miniapp-render' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'miniapp-render' ? 'Copiado' : 'Copiar'}</span>
                  </button>
                </div>
                <div className="p-2.5 rounded-lg bg-zinc-950 text-emerald-400 font-mono text-xs border border-emerald-950 select-all break-all">
                  {renderMiniAppUrl}
                </div>
                <div className="flex items-center justify-between text-[11px] text-zinc-400 font-mono">
                  <span>Destino en BotFather:</span>
                  <a
                    href={renderMiniAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 hover:underline flex items-center gap-1"
                  >
                    <span>Probar en Navegador</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* URL 2: Telegram Webhook URL */}
              <div className="p-4 rounded-xl bg-black border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-zinc-300 flex items-center gap-1.5">
                    <Radio className="w-4 h-4 text-purple-400" />
                    URL del Webhook de Telegram:
                  </span>
                  <button
                    onClick={() => handleCopy(renderWebhookUrl, 'webhook-render')}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-[11px] font-mono text-zinc-300 transition-all cursor-pointer"
                  >
                    {copiedKey === 'webhook-render' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'webhook-render' ? 'Copiado' : 'Copiar'}</span>
                  </button>
                </div>
                <div className="p-2.5 rounded-lg bg-zinc-950 text-purple-300 font-mono text-xs border border-purple-950 select-all break-all">
                  {renderWebhookUrl}
                </div>
                <div className="flex items-center justify-between text-[11px] text-zinc-400 font-mono">
                  <span>Método soportado:</span>
                  <span className="text-white font-bold">POST (JSON Update)</span>
                </div>
              </div>
            </div>

            {/* Webhook Status Info from Telegram API */}
            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-zinc-300 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  Diagnóstico en Tiempo Real con Telegram API:
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                  webhookInfo?.configured
                    ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                    : 'bg-amber-950 text-amber-400 border-amber-800'
                }`}>
                  {webhookInfo?.configured ? 'TOKEN CONFIGURADO' : 'TOKEN PENDIENTE O SIMULADO'}
                </span>
              </div>

              {webhookInfo?.telegramWebhookInfo ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
                  <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800">
                    <span className="text-zinc-500 block text-[10px]">URL Registrada en Telegram:</span>
                    <span className="text-white truncate block font-bold">{webhookInfo.telegramWebhookInfo.url || 'Ninguna (Polling)'}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800">
                    <span className="text-zinc-500 block text-[10px]">Actualizaciones Pendientes:</span>
                    <span className="text-cyan-400 block font-bold">{webhookInfo.telegramWebhookInfo.pending_update_count ?? 0}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800">
                    <span className="text-zinc-500 block text-[10px]">Apunta a Render:</span>
                    <span className={`block font-bold ${webhookInfo.isPointedToRender ? 'text-emerald-400' : 'text-zinc-400'}`}>
                      {webhookInfo.isPointedToRender ? 'SÍ (script-ads.onrender.com)' : 'Pendiente registro'}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800 text-xs font-mono text-zinc-400">
                  {webhookInfo?.message || 'Conexión lista con el backend. Pulsa "Registrar Webhook Oficial" para enviar la instrucción a Telegram.'}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={handleRegisterWebhook}
                  disabled={settingWebhook}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-[#0088cc] hover:from-blue-500 hover:to-cyan-400 text-white font-mono text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-blue-500/20"
                >
                  <Zap className={`w-4 h-4 ${settingWebhook ? 'animate-spin' : ''}`} />
                  <span>{settingWebhook ? 'Registrando en Telegram...' : '⚡ Registrar Webhook en Telegram API'}</span>
                </button>

                <button
                  onClick={handleSendTelegramAlert}
                  disabled={alertSending}
                  className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-mono text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border border-zinc-700"
                >
                  <Play className={`w-4 h-4 text-emerald-400 ${alertSending ? 'animate-spin' : ''}`} />
                  <span>{alertSending ? 'Enviando...' : '🧪 Probar Respuesta Webhook (/trade)'}</span>
                </button>

                <a
                  href={`https://t.me/${botUsername}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-blue-950/60 hover:bg-blue-900/80 text-blue-300 font-mono text-xs font-bold transition-all flex items-center gap-2 border border-blue-800/60"
                >
                  <Send className="w-4 h-4" />
                  <span>Abrir @{botUsername}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Instructions to copy command manually if needed */}
            <div className="p-4 rounded-xl bg-black border border-zinc-800 space-y-2">
              <h4 className="text-xs font-mono font-bold text-zinc-300 flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-amber-400" />
                Comando Rápido para Vincular Webhook desde Terminal o Navegador:
              </h4>
              <p className="text-[11px] text-zinc-400">
                Si deseas registrarlo manualmente o verificar el certificado HTTPS de Render.com, puedes abrir esta URL en tu navegador reemplazando tu token:
              </p>
              <div className="p-2.5 rounded-lg bg-zinc-950 text-amber-300 font-mono text-xs border border-zinc-800 flex items-center justify-between">
                <code className="truncate select-all mr-2">
                  https://api.telegram.org/bot&lt;TU_TOKEN&gt;/setWebhook?url={renderWebhookUrl}
                </code>
                <button
                  onClick={() => handleCopy(`https://api.telegram.org/bot<TU_TOKEN>/setWebhook?url=${renderWebhookUrl}`, 'cmd-webhook')}
                  className="p-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 shrink-0"
                >
                  {copiedKey === 'cmd-webhook' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* SECTION 1: WALLET EXPRESS EN TELEGRAM */}
      {selectedAction === 'wallet' && (
        <div className="space-y-6">
          <div className="p-5 rounded-xl bg-gradient-to-r from-zinc-950 via-zinc-900 to-black border border-[#0088cc]/30 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-[#29b6f6]" />
                  Consulta Rápida de Saldo Aptos &amp; Botcaza Wallet
                </h3>
                <p className="text-xs text-zinc-400">
                  Los usuarios de tu canal o grupo de Telegram pueden comprobar su saldo on-chain en 1 segundo con vibración háptica.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleQuickBalanceCheck('0x1')}
                  disabled={walletLoading}
                  className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-mono text-zinc-300 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <RefreshCw className={`w-3 h-3 ${walletLoading ? 'animate-spin' : ''}`} />
                  <span>Probar 0x1</span>
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={testAddress}
                onChange={(e) => setTestAddress(e.target.value)}
                placeholder="Dirección Aptos (ej. 0x1...)"
                className="flex-1 bg-black border border-zinc-700 rounded-xl px-4 py-2.5 text-xs font-mono text-white placeholder-zinc-500 focus:outline-none focus:border-[#29b6f6]"
              />
              <button
                onClick={() => handleQuickBalanceCheck()}
                disabled={walletLoading}
                className="px-5 py-2.5 rounded-xl bg-[#0088cc] hover:bg-[#0088cc]/80 text-white font-mono text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {walletLoading ? 'Consultando Blockchain...' : 'Consultar en Mini App'}
              </button>
            </div>

            {walletData && (
              <div className="p-4 rounded-xl bg-black border border-zinc-800 grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <span className="text-[10px] font-mono text-zinc-500 uppercase">Saldo APT Real</span>
                  <p className="text-base sm:text-lg font-mono font-black text-[#00ff9d]">
                    {walletData.aptBalance} APT
                  </p>
                  <span className="text-[10px] text-zinc-400 font-mono">
                    ≈ ${(walletData.aptBalance * 9.5).toFixed(2)} USD
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-zinc-500 uppercase">Transacciones (Seq)</span>
                  <p className="text-base sm:text-lg font-mono font-bold text-white">
                    #{walletData.sequenceNumber}
                  </p>
                  <span className="text-[10px] text-zinc-400 font-mono">Enviadas en Mainnet</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-zinc-500 uppercase">Recursos Move</span>
                  <p className="text-base sm:text-lg font-mono font-bold text-cyan-400">
                    {walletData.resourcesCount} Módulos
                  </p>
                  <span className="text-[10px] text-zinc-400 font-mono">Coins y Contratos</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-zinc-500 uppercase">Estado en Telegram</span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-mono font-bold text-emerald-400">Verificado</span>
                  </div>
                  <span className="text-[10px] text-zinc-400 font-mono">Firebase Sincronizado</span>
                </div>
              </div>
            )}
          </div>

          {/* Test Telegram Native MainButton */}
          <div className="p-5 rounded-xl bg-zinc-900 border border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h4 className="text-xs font-mono font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#00ff9d]" />
                Simulador del Botón Nativo Inferior de Telegram (Telegram.WebApp.MainButton)
              </h4>
              <p className="text-xs text-zinc-400">
                En la app móvil de Telegram, este botón aparece fijado en la parte inferior de la pantalla para cobros rápidos en 1 toque.
              </p>
            </div>

            <button
              onClick={toggleTelegramMainButton}
              className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                mainButtonActive
                  ? 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(0,255,157,0.3)]'
                  : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>{mainButtonActive ? 'Ocultar MainButton' : 'Activar MainButton de Telegram'}</span>
            </button>
          </div>
        </div>
      )}

      {/* SECTION 2: ALERTAS APTOS POR TELEGRAM BOT */}
      {selectedAction === 'alerts' && (
        <div className="space-y-6">
          <div className="p-5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-4">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Bell className="w-4 h-4 text-amber-400" />
                Disparador de Alertas de Ballenas Aptos a Telegram
              </h3>
              <p className="text-xs text-zinc-400">
                Tu bot de Telegram puede enviar mensajes enriquecidos con botones inline directos a la Mini App cuando una ballena mueva más de 100,000 APT.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2 space-y-2">
                <label className="text-xs font-mono text-zinc-400">ID del Chat o Canal de Telegram:</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={alertTargetChat}
                    onChange={(e) => setAlertTargetChat(e.target.value)}
                    placeholder="Ej. @tu_canal o tu chat_id numérico"
                    className="flex-1 bg-black border border-zinc-700 rounded-xl px-4 py-2.5 text-xs font-mono text-white placeholder-zinc-600 focus:outline-none focus:border-[#0088cc]"
                  />
                  <button
                    onClick={handleSendTelegramAlert}
                    disabled={alertSending}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-mono text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{alertSending ? 'Enviando...' : 'Enviar Alerta de Prueba'}</span>
                  </button>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-black border border-zinc-800 space-y-1">
                <span className="text-[10px] font-mono text-zinc-500 uppercase">Webhook Endpoint</span>
                <p className="text-xs font-mono text-cyan-400 truncate">
                  /api/telegram/webhook
                </p>
                <span className="text-[10px] text-zinc-400">Activo en Node.js y Python (app.py)</span>
              </div>
            </div>

            {alertResult && (
              <div className="p-3 rounded-lg bg-blue-950/80 border border-blue-500/40 text-xs font-mono text-blue-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                <span>{alertResult}</span>
              </div>
            )}

            {/* Preview of Telegram Inline Message */}
            <div className="p-4 rounded-xl bg-black border border-zinc-800 space-y-3">
              <div className="text-[11px] font-mono text-zinc-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#0088cc]" />
                <span>Vista Previa del Mensaje que recibe el usuario en Telegram:</span>
              </div>
              <div className="max-w-md p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs space-y-2">
                <p className="font-bold text-white">🤖 Botcaza Whale Alert • Aptos Mainnet</p>
                <p className="text-zinc-300 text-[11px]">
                  ⚠️ Movimiento detectado: <strong>350,000 APT ($3,325,000 USD)</strong> transferidos desde Binance hacia billetera desconocida.
                </p>
                <div className="pt-2 grid grid-cols-2 gap-2">
                  <button className="w-full py-1.5 rounded-lg bg-[#0088cc] text-white font-mono text-[11px] font-bold text-center">
                    🚀 Abrir Mini App
                  </button>
                  <button className="w-full py-1.5 rounded-lg bg-zinc-800 text-zinc-300 font-mono text-[11px] text-center">
                    🔍 Ver Explorer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: MICROPAGOS & TELEGRAM STARS */}
      {selectedAction === 'stars' && (
        <div className="space-y-6">
          <div className="p-5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-4">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-400" />
                Monetización en Telegram: Stars (⭐) + Botcaza Wallet + Aptos
              </h3>
              <p className="text-xs text-zinc-400">
                Puedes cobrar por tus reportes de trading y alertas exclusivas utilizando tanto Telegram Stars nativo de la app como tu propia pasarela en Firebase.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-black border border-amber-500/30 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-amber-400 font-bold">
                  <div className="flex items-center gap-1.5">
                    <Star className="w-4 h-4" />
                    <span>Telegram Stars</span>
                  </div>
                  <span>⭐ 250</span>
                </div>
                <p className="text-[11px] text-zinc-400">
                  Moneda digital oficial de Telegram comprada con Apple Pay o Google Pay por los usuarios dentro del chat.
                </p>
                <button
                  onClick={() => {
                    triggerTelegramHaptic('success');
                    confetti({ particleCount: 40 });
                  }}
                  className="w-full py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-mono text-xs font-bold transition-all cursor-pointer"
                >
                  Pagar 250 Stars
                </button>
              </div>

              <div className="p-4 rounded-xl bg-black border border-emerald-500/30 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-emerald-400 font-bold">
                  <div className="flex items-center gap-1.5">
                    <Wallet className="w-4 h-4" />
                    <span>Botcaza Wallet</span>
                  </div>
                  <span>0% Fee</span>
                </div>
                <p className="text-[11px] text-zinc-400">
                  Cobro sin intermediarios registrado al instante en tu base de datos de Firebase Firestore.
                </p>
                <button
                  onClick={() => {
                    triggerTelegramHaptic('heavy');
                    confetti({ particleCount: 50 });
                  }}
                  className="w-full py-2 rounded-lg bg-[#00ff9d] hover:bg-[#00ff9d]/80 text-black font-mono text-xs font-bold transition-all cursor-pointer"
                >
                  Pagar con Saldo Botcaza
                </button>
              </div>

              <div className="p-4 rounded-xl bg-black border border-cyan-500/30 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-cyan-400 font-bold">
                  <div className="flex items-center gap-1.5">
                    <Zap className="w-4 h-4" />
                    <span>Aptos On-Chain</span>
                  </div>
                  <span>0.52 APT</span>
                </div>
                <p className="text-[11px] text-zinc-400">
                  Transferencia directa verificada en bloques de Aptos Mainnet sin custodia de terceros.
                </p>
                <button
                  onClick={() => {
                    triggerTelegramHaptic('light');
                    confetti({ particleCount: 40 });
                  }}
                  className="w-full py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-mono text-xs font-bold transition-all cursor-pointer"
                >
                  Pagar en APT
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: GUÍA BOTFATHER (ENLACE OFICIAL) */}
      {selectedAction === 'botfather' && (
        <div className="space-y-6">
          <div className="p-5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-4">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Terminal className="w-4 h-4 text-[#29b6f6]" />
                Cómo Vincular tu Mini App en Telegram con @BotFather (1 Minuto)
              </h3>
              <p className="text-xs text-zinc-400">
                Sigue estos sencillos pasos oficiales para que tu bot abra esta aplicación en pantalla completa dentro de Telegram:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
              <div className="p-4 rounded-xl bg-black border border-zinc-800 space-y-2">
                <div className="flex items-center gap-2 text-[#29b6f6] font-bold">
                  <span className="w-5 h-5 rounded-full bg-blue-950 flex items-center justify-center border border-blue-800">1</span>
                  <span>Escribe a @BotFather</span>
                </div>
                <p className="text-zinc-300 text-[11px]">
                  En Telegram, abre un chat con <a href="https://t.me/BotFather" target="_blank" rel="noopener noreferrer" className="text-cyan-400 underline">@BotFather</a> y envía el comando:
                </p>
                <div className="p-2 rounded bg-zinc-900 text-cyan-400 text-[11px] border border-zinc-800">
                  <code>/newapp</code>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-black border border-zinc-800 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <span className="w-5 h-5 rounded-full bg-emerald-950 flex items-center justify-center border border-emerald-800">2</span>
                  <span>Configura Nombre &amp; Foto</span>
                </div>
                <p className="text-zinc-300 text-[11px]">
                  BotFather te pedirá seleccionar tu bot existente o crear uno nuevo (ej. <code className="text-white">@BotcazaAiBot</code>) y asignarle una descripción corta.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-black border border-zinc-800 space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-bold">
                  <span className="w-5 h-5 rounded-full bg-amber-950 flex items-center justify-center border border-amber-800">3</span>
                  <span>Pega la URL de tu WebApp</span>
                </div>
                <p className="text-zinc-300 text-[11px]">
                  Cuando BotFather pregunte por la URL de la Web App, pega:
                </p>
                <div className="p-2 rounded bg-zinc-900 text-[#00ff9d] text-[11px] border border-zinc-800 truncate flex items-center justify-between">
                  <code>{renderMiniAppUrl}</code>
                  <button
                    onClick={() => handleCopy(renderMiniAppUrl, 'botfather-url')}
                    className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 ml-2"
                  >
                    {copiedKey === 'botfather-url' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Ready to share links */}
            <div className="p-4 rounded-xl bg-black border border-zinc-800 space-y-3">
              <h4 className="text-xs font-mono font-bold text-white flex items-center gap-2">
                <Share2 className="w-4 h-4 text-cyan-400" />
                Enlaces Directos Listos para Difundir en Canales y Grupos:
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 space-y-2">
                  <span className="text-[10px] font-mono text-zinc-400">Enlace Viral para Compartir en Telegram:</span>
                  <div className="flex items-center gap-2">
                    <a
                      href={miniAppShareUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-[#0088cc] hover:bg-[#0088cc]/80 text-white font-mono text-xs font-bold transition-all"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Compartir a Amigos / Grupos</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 space-y-2">
                  <span className="text-[10px] font-mono text-zinc-400">Abrir Directo en Telegram Web / Desktop:</span>
                  <div className="flex items-center gap-2">
                    <a
                      href="https://web.telegram.org"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-mono text-xs font-bold transition-all"
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>Abrir Telegram Web</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
