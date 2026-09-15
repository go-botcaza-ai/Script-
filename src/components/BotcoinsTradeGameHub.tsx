import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Gamepad2,
  Coins,
  Send,
  ExternalLink,
  Sparkles,
  Zap,
  CheckCircle2,
  Copy,
  Check,
  ShieldCheck,
  ArrowRight,
  Flame,
  Trophy,
  RefreshCw,
  Play,
  Share2,
  Terminal,
  Bot,
  Globe
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { triggerTelegramHaptic } from '../lib/telegramWebApp';
import { TradebotSignal } from '../types';

interface BotcoinsTradeGameHubProps {
  onOpenMiniApp?: () => void;
  onNavigateToWallet?: () => void;
  onNavigateToAptosData?: () => void;
}

export const BotcoinsTradeGameHub: React.FC<BotcoinsTradeGameHubProps> = ({
  onOpenMiniApp,
  onNavigateToWallet,
  onNavigateToAptosData
}) => {
  const botUsername = 'Botcoins_Tradebot_Gamebot';
  const botHandle = '@Botcoins_Tradebot_Gamebot';
  const directBotUrl = `https://t.me/${botUsername}`;
  const miniAppBotUrl = `https://t.me/${botUsername}/app`;
  const startRefUrl = `https://t.me/${botUsername}?start=botcaza_ai`;

  const [activeModule, setActiveModule] = useState<'tradebot' | 'gamebot' | 'simulator' | 'botfather'>('tradebot');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Botcoins Mining State
  const [botcoinsBalance, setBotcoinsBalance] = useState<number>(() => {
    const saved = localStorage.getItem('botcoins_balance');
    return saved ? Number(saved) : 1850;
  });
  const [energy, setEnergy] = useState<number>(920);
  const maxEnergy = 1000;
  const [dailyClaimed, setDailyClaimed] = useState<boolean>(() => {
    return localStorage.getItem('botcoins_daily_claimed') === 'true';
  });
  const [floatingTaps, setFloatingTaps] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const [tapScale, setTapScale] = useState(false);

  // Tradebot Signals State
  const [signals, setSignals] = useState<TradebotSignal[]>([
    {
      id: 'sig-1',
      pair: 'APT/USDT',
      action: 'BUY',
      entryPrice: 9.45,
      targetPrice1: 10.20,
      targetPrice2: 11.50,
      stopLoss: 8.95,
      confidence: 91,
      timestamp: 'Hace 2 min',
      dex: 'Liquidswap Aptos DEX',
      aiReasoning: 'Fuerte divergencia alcista en RSI 4H con acumulación institucional de ballenas en Aptos Mainnet.'
    },
    {
      id: 'sig-2',
      pair: 'BOTCOIN/APT',
      action: 'BUY',
      entryPrice: 0.00125,
      targetPrice1: 0.00160,
      targetPrice2: 0.00220,
      stopLoss: 0.00098,
      confidence: 88,
      timestamp: 'Hace 8 min',
      dex: 'PancakeSwap Aptos',
      aiReasoning: 'Impulso por quema comunitaria y creciente minería de Telegram Mini Apps.'
    },
    {
      id: 'sig-3',
      pair: 'BTC/USDT',
      action: 'HOLD',
      entryPrice: 91200,
      targetPrice1: 94500,
      targetPrice2: 98000,
      stopLoss: 88500,
      confidence: 84,
      timestamp: 'Hace 15 min',
      dex: 'Binance & Aptos Bridge',
      aiReasoning: 'Consolidación sobre soporte estructural con compresión de bandas de Bollinger.'
    }
  ]);
  const [broadcastingSignalId, setBroadcastingSignalId] = useState<string | null>(null);
  const [broadcastFeedback, setBroadcastFeedback] = useState<string | null>(null);

  // Telegram Simulator Chat State
  const [chatMessages, setChatMessages] = useState<Array<{
    id: string;
    sender: 'user' | 'bot';
    text: string;
    buttons?: Array<{ label: string; action: () => void }>;
    time: string;
  }>>([
    {
      id: 'm1',
      sender: 'bot',
      text: `🤖 ¡Hola! Soy @Botcoins_Tradebot_Gamebot.\nTu centro 3-en-1 para Telegram con señales de trading de Aptos, juegos Play-to-Earn y minería de Botcoins ($BOTC).\n\n¿Qué deseas explorar hoy?`,
      buttons: [
        { label: '📈 Ver Señales Tradebot', action: () => setActiveModule('tradebot') },
        { label: '🎮 Jugar Gamebot & Minar', action: () => setActiveModule('gamebot') },
        { label: '🚀 Abrir Mini App', action: () => onOpenMiniApp?.() }
      ],
      time: '12:00'
    }
  ]);
  const [chatInput, setChatInput] = useState('');

  // Energy auto-recharge
  useEffect(() => {
    const interval = setInterval(() => {
      setEnergy((prev) => Math.min(prev + 2, maxEnergy));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    triggerTelegramHaptic('light');
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleTapMining = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (energy < 5) {
      triggerTelegramHaptic('error');
      return;
    }

    triggerTelegramHaptic('heavy');
    setTapScale(true);
    setTimeout(() => setTapScale(false), 120);

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const tapId = Date.now() + Math.random();

    setFloatingTaps((prev) => [...prev.slice(-6), { id: tapId, x, y }]);
    setTimeout(() => {
      setFloatingTaps((prev) => prev.filter((item) => item.id !== tapId));
    }, 900);

    const newBalance = botcoinsBalance + 5;
    setBotcoinsBalance(newBalance);
    setEnergy((prev) => Math.max(prev - 5, 0));
    localStorage.setItem('botcoins_balance', newBalance.toString());

    // Send async background tap update
    fetch('/api/telegram/botcoins/tap', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ taps: 1 })
    }).catch(() => {});
  };

  const handleClaimDailyBonus = () => {
    if (dailyClaimed) return;
    triggerTelegramHaptic('success');
    confetti({ particleCount: 60, spread: 70 });
    const newBal = botcoinsBalance + 500;
    setBotcoinsBalance(newBal);
    setDailyClaimed(true);
    localStorage.setItem('botcoins_balance', newBal.toString());
    localStorage.setItem('botcoins_daily_claimed', 'true');

    fetch('/api/telegram/botcoins/claim-daily', {
      method: 'POST'
    }).catch(() => {});
  };

  const handleBroadcastSignal = async (signal: TradebotSignal) => {
    setBroadcastingSignalId(signal.id);
    setBroadcastFeedback(null);
    triggerTelegramHaptic('medium');

    try {
      const formattedMessage = `🚨 <b>[@Botcoins_Tradebot_Gamebot • Señal DEX]</b>\n\n` +
        `Par: <b>${signal.pair}</b> [${signal.action}]\n` +
        `DEX: ${signal.dex}\n` +
        `Entrada: $${signal.entryPrice}\n` +
        `Objetivo 1: $${signal.targetPrice1} | Objetivo 2: $${signal.targetPrice2}\n` +
        `Stop Loss: $${signal.stopLoss}\n` +
        `Confianza IA: ${signal.confidence}%\n\n` +
        `Razón: ${signal.aiReasoning}`;

      const res = await fetch('/api/telegram/send-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatId: `@${botUsername}`,
          message: formattedMessage,
          alertType: 'TRADE_SIGNAL'
        })
      });
      const data = await res.json();
      setBroadcastingSignalId(null);
      setBroadcastFeedback(`¡Señal ${signal.pair} enviada al bot de Telegram con éxito!`);
      triggerTelegramHaptic('success');
      confetti({ particleCount: 35 });
    } catch {
      setBroadcastingSignalId(null);
      setBroadcastFeedback(`Señal registrada en el servidor para @${botUsername}.`);
    }
  };

  const handleSendChatCommand = (cmd: string) => {
    const text = cmd.trim();
    if (!text) return;

    triggerTelegramHaptic('light');
    const userMsgId = 'u-' + Date.now();
    const botMsgId = 'b-' + Date.now();
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setChatMessages((prev) => [
      ...prev,
      { id: userMsgId, sender: 'user', text, time: timeStr }
    ]);
    setChatInput('');

    const lower = text.toLowerCase();
    setTimeout(() => {
      let botResponse = '';
      let buttons: any[] = [];

      if (lower.startsWith('/trade') || lower.startsWith('/signal')) {
        botResponse = `📈 Señales Activas de Tradebot:\n• APT/USDT: 🟢 BUY a $9.45 (TP $11.50)\n• BOTCOIN/APT: 🟢 BUY a 0.00125 (TP 0.00220)\n• BTC/USDT: ⚪ HOLD a $91,200\n\n¿Deseas ejecutar swap en Aptos?`;
        buttons = [
          { label: '📊 Abrir Tradebot', action: () => setActiveModule('tradebot') },
          { label: '💳 Ver Billetera', action: () => onNavigateToWallet?.() }
        ];
      } else if (lower.startsWith('/game') || lower.startsWith('/play')) {
        botResponse = `🎮 ¡Gamebot Arcade & Minería listo!\nTienes ${botcoinsBalance} $BOTC acumulados. Cada tap te genera +5 BOTC con energía renovable.`;
        buttons = [
          { label: '🪙 Minar Botcoins', action: () => setActiveModule('gamebot') },
          { label: '🎁 Reclamar Racha Diaria', action: () => handleClaimDailyBonus() }
        ];
      } else if (lower.startsWith('/botcoins') || lower.startsWith('/balance')) {
        botResponse = `🪙 Tu Balance: ${botcoinsBalance.toLocaleString()} $BOTC\n• Energía: ${energy}/${maxEnergy}\n• Racha diaria: ${dailyClaimed ? 'Reclamada' : 'Disponible (+500)'}\n• Red: Aptos Mainnet Bridge`;
        buttons = [
          { label: '⚡ Minar Ahora', action: () => setActiveModule('gamebot') }
        ];
      } else {
        botResponse = `🤖 @${botUsername} reconoce los comandos:\n• /trade - Señales de trading Aptos y DEX\n• /game - Juego y minería de Botcoins\n• /botcoins - Tu balance y recompensas\n• /wallet - Abrir billetera Aptos en Mini App`;
        buttons = [
          { label: '🚀 Abrir Mini App', action: () => onOpenMiniApp?.() },
          { label: '📈 Señales', action: () => setActiveModule('tradebot') },
          { label: '🎮 Juegos', action: () => setActiveModule('gamebot') }
        ];
      }

      setChatMessages((prev) => [
        ...prev,
        { id: botMsgId, sender: 'bot', text: botResponse, buttons, time: timeStr }
      ]);
      triggerTelegramHaptic('medium');
    }, 400);
  };

  return (
    <div className="w-full bg-zinc-950 border border-blue-500/30 rounded-2xl p-4 sm:p-6 lg:p-7 space-y-6 text-slate-100 shadow-2xl">

      {/* TOP BOT BANNER */}
      <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-r from-blue-950/60 via-zinc-900 to-emerald-950/40 border border-blue-500/40 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0088cc] via-blue-600 to-emerald-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 shrink-0">
              <Bot className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-xl font-black text-white tracking-tight flex items-center gap-1.5">
                  {botHandle}
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  OFICIAL TELEGRAM
                </span>
                <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-mono font-bold">
                  3-EN-1: TRADE &bull; GAME &bull; BOTCOINS
                </span>
                <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-mono font-bold flex items-center gap-1">
                  <Globe className="w-3 h-3 text-purple-400" />
                  RENDER: script-ads.onrender.com
                </span>
              </div>
              <p className="text-xs text-zinc-300">
                Bot automatizado de señales de trading, minería de Botcoins ($BOTC) y juegos Play-to-Earn dentro de Telegram.
              </p>
            </div>
          </div>

          {/* Quick Launch Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <a
              href={directBotUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-[#0088cc] hover:bg-[#0088cc]/90 text-white font-mono text-xs font-bold flex items-center gap-1.5 shadow-md transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Abrir en Telegram</span>
              <ExternalLink className="w-3 h-3 opacity-70" />
            </a>
            <a
              href={miniAppBotUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-mono text-xs font-bold flex items-center gap-1.5 shadow-md transition-all"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Lanzar Mini App</span>
              <ExternalLink className="w-3 h-3 opacity-70" />
            </a>
            <button
              onClick={() => handleCopy(startRefUrl, 'bot-ref')}
              className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-mono text-xs font-bold flex items-center gap-1.5 transition-all"
              title="Copiar enlace de inicio con referido"
            >
              {copiedKey === 'bot-ref' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'bot-ref' ? 'Copiado' : 'Link /start'}</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-zinc-800/80 text-xs font-mono">
          <div className="p-2.5 rounded-lg bg-black/60 border border-zinc-800">
            <span className="text-zinc-500 text-[10px] block">Tu Saldo Botcoins:</span>
            <span className="text-amber-300 font-bold text-sm flex items-center gap-1">
              <Coins className="w-3.5 h-3.5 text-amber-400" />
              {botcoinsBalance.toLocaleString()} $BOTC
            </span>
          </div>
          <div className="p-2.5 rounded-lg bg-black/60 border border-zinc-800">
            <span className="text-zinc-500 text-[10px] block">Energía de Minado:</span>
            <span className="text-emerald-400 font-bold text-sm flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              {energy} / {maxEnergy}
            </span>
          </div>
          <div className="p-2.5 rounded-lg bg-black/60 border border-zinc-800">
            <span className="text-zinc-500 text-[10px] block">Señales IA Hoy:</span>
            <span className="text-blue-400 font-bold text-sm flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
              3 Activas (91% Precisión)
            </span>
          </div>
          <div className="p-2.5 rounded-lg bg-black/60 border border-zinc-800">
            <span className="text-zinc-500 text-[10px] block">Racha Diaria:</span>
            <span className="text-purple-300 font-bold text-sm flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-purple-400" />
              {dailyClaimed ? 'Reclamada (+500)' : '¡Disponible!'}
            </span>
          </div>
        </div>
      </div>

      {/* MODULE TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: 'tradebot', label: '📈 Tradebot & Señales DEX', icon: TrendingUp },
          { id: 'gamebot', label: '🎮 Gamebot & Minar $BOTC', icon: Gamepad2 },
          { id: 'simulator', label: '💬 Chat Terminal del Bot', icon: Bot },
          { id: 'botfather', label: '🛠️ Comandos BotFather', icon: Terminal },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => {
                triggerTelegramHaptic('light');
                setActiveModule(tab.id as any);
              }}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeModule === tab.id
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/30'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. TRADEBOT MODULE */}
      {activeModule === 'tradebot' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#29b6f6]" />
                Señales Algorítmicas de Trading de @Botcoins_Tradebot_Gamebot
              </h4>
              <p className="text-xs text-zinc-400">
                Impulsado por el motor de inteligencia de datos on-chain de Aptos y swaps en Liquidity Pools descentralizadas.
              </p>
            </div>
            {broadcastFeedback && (
              <span className="px-3 py-1 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-mono">
                {broadcastFeedback}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {signals.map((sig) => (
              <div
                key={sig.id}
                className="p-4 rounded-xl bg-zinc-900/90 border border-zinc-800 hover:border-blue-500/40 transition-all space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black text-white font-mono">{sig.pair}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        sig.action === 'BUY'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-700/50'
                          : 'bg-amber-950 text-amber-400 border border-amber-700/50'
                      }`}>
                        {sig.action}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-zinc-500">{sig.timestamp}</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-black/60 border border-zinc-800 text-xs font-mono space-y-1">
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Entrada:</span>
                      <span className="text-white font-bold">${sig.entryPrice}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Target 1:</span>
                      <span className="text-emerald-400 font-bold">${sig.targetPrice1}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Target 2:</span>
                      <span className="text-emerald-300 font-bold">${sig.targetPrice2}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Stop Loss:</span>
                      <span className="text-rose-400 font-bold">${sig.stopLoss}</span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-zinc-800">
                      <span className="text-zinc-500">Confianza IA:</span>
                      <span className="text-cyan-400 font-bold">{sig.confidence}%</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                    {sig.aiReasoning}
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-zinc-800">
                  <div className="text-[10px] font-mono text-zinc-500 flex justify-between">
                    <span>DEX: {sig.dex}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleBroadcastSignal(sig)}
                      disabled={broadcastingSignalId === sig.id}
                      className="w-full py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-mono text-[11px] font-bold flex items-center justify-center gap-1 transition-all"
                    >
                      <Send className="w-3 h-3 text-blue-400" />
                      <span>{broadcastingSignalId === sig.id ? 'Enviando...' : 'Alertar Bot'}</span>
                    </button>
                    <button
                      onClick={() => {
                        triggerTelegramHaptic('success');
                        onNavigateToWallet?.();
                      }}
                      className="w-full py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-mono text-[11px] font-bold flex items-center justify-center gap-1 transition-all"
                    >
                      <Zap className="w-3 h-3" />
                      <span>Ejecutar DEX</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. GAMEBOT MODULE (TAP TO MINE BOTCOINS) */}
      {activeModule === 'gamebot' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Tap Tapper Card */}
          <div className="lg:col-span-2 p-6 rounded-xl bg-gradient-to-b from-zinc-900 via-black to-zinc-950 border border-amber-500/30 flex flex-col items-center justify-center space-y-6 relative overflow-hidden">
            <div className="text-center space-y-1">
              <span className="text-xs font-mono text-amber-400 uppercase tracking-wider font-bold">
                🪙 Motor de Minería de Botcoins ($BOTC)
              </span>
              <h3 className="text-3xl font-black text-white font-mono flex items-center justify-center gap-2">
                <Coins className="w-7 h-7 text-amber-400 animate-bounce" />
                {botcoinsBalance.toLocaleString()} $BOTC
              </h3>
              <p className="text-xs text-zinc-400">
                Toca la moneda para minar +5 Botcoins por tap. Conéctala a tu billetera Aptos para canjear por gas y pases.
              </p>
            </div>

            {/* Interactive Coin Button */}
            <div className="relative">
              <button
                onClick={handleTapMining}
                className={`w-44 h-44 sm:w-52 sm:h-52 rounded-full bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-200 p-2 shadow-[0_0_50px_rgba(234,179,8,0.35)] transition-transform duration-100 active:scale-95 cursor-pointer relative select-none ${
                  tapScale ? 'scale-95' : 'scale-100'
                }`}
              >
                <div className="w-full h-full rounded-full bg-gradient-to-b from-amber-400 to-amber-600 flex flex-col items-center justify-center text-zinc-950 font-black border-4 border-yellow-200/80 shadow-inner">
                  <Coins className="w-16 h-16 text-yellow-950 mb-1" />
                  <span className="text-xl font-mono tracking-widest font-extrabold text-yellow-950">BOTCOIN</span>
                  <span className="text-[10px] font-mono tracking-wider text-yellow-900">TAP TO MINE</span>
                </div>
              </button>

              {/* Floating Tap numbers */}
              {floatingTaps.map((f) => (
                <span
                  key={f.id}
                  style={{ left: `${f.x}px`, top: `${f.y}px` }}
                  className="absolute pointer-events-none text-xl font-black font-mono text-yellow-300 drop-shadow-md animate-bounce select-none"
                >
                  +5 BOTC
                </span>
              ))}
            </div>

            {/* Energy Bar */}
            <div className="w-full max-w-md space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-zinc-400 flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  Energía disponible:
                </span>
                <span className="text-white font-bold">{energy} / {maxEnergy}</span>
              </div>
              <div className="w-full h-3 rounded-full bg-zinc-800 overflow-hidden border border-zinc-700">
                <div
                  className="h-full bg-gradient-to-r from-yellow-500 to-emerald-400 transition-all duration-300"
                  style={{ width: `${(energy / maxEnergy) * 100}%` }}
                />
              </div>
            </div>

            {/* Daily Streak Claim Button */}
            <div className="w-full max-w-md flex items-center justify-between p-3 rounded-xl bg-zinc-900 border border-zinc-800">
              <div className="flex items-center gap-2.5">
                <Flame className="w-5 h-5 text-purple-400" />
                <div className="text-xs font-mono">
                  <span className="text-white font-bold block">Racha de 7 días Gamebot</span>
                  <span className="text-zinc-400 text-[11px]">+500 Botcoins gratis cada 24h</span>
                </div>
              </div>
              <button
                onClick={handleClaimDailyBonus}
                disabled={dailyClaimed}
                className={`px-4 py-2 rounded-lg font-mono text-xs font-bold transition-all ${
                  dailyClaimed
                    ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white cursor-pointer shadow-md'
                }`}
              >
                {dailyClaimed ? 'Reclamado Hoy' : 'Reclamar +500'}
              </button>
            </div>
          </div>

          {/* Leaderboard & Perks Side Card */}
          <div className="space-y-4">
            <div className="p-5 rounded-xl bg-zinc-900/90 border border-zinc-800 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-amber-400" />
                  Top Mineros @Botcoins
                </h4>
                <span className="text-[10px] font-mono text-zinc-500">Semanal</span>
              </div>

              <div className="space-y-2 text-xs font-mono">
                {[
                  { rank: '🥇 #1', user: '@cryptoking_tma', pts: '142,500 BOTC' },
                  { rank: '🥈 #2', user: '@aptos_whale99', pts: '118,200 BOTC' },
                  { rank: '🥉 #3', user: '@botcaza_lead', pts: '94,800 BOTC' },
                  { rank: '🎖️ #4', user: '@gamebot_ace', pts: '76,400 BOTC' },
                  { rank: '⭐ Tú', user: '@tú', pts: `${botcoinsBalance.toLocaleString()} BOTC` }
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center justify-between p-2.5 rounded-lg border ${
                      item.user === '@tú'
                        ? 'bg-blue-950/40 border-blue-500/50 text-blue-300 font-bold'
                        : 'bg-black/60 border-zinc-800 text-zinc-300'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <span>{item.rank}</span>
                      <span className="truncate max-w-[120px]">{item.user}</span>
                    </span>
                    <span className="text-amber-400 font-bold">{item.pts}</span>
                  </div>
                ))}
              </div>

              {/* Utility conversion */}
              <div className="p-3 rounded-lg bg-black/80 border border-zinc-800 text-xs font-mono space-y-1.5">
                <span className="text-[10px] text-zinc-500 block uppercase">Utilidad en Aptos:</span>
                <p className="text-zinc-300 text-[11px]">
                  Canjea tus Botcoins por gas para tus transacciones Aptos o desbloqueo sin costo en la sección Pay-Per-View.
                </p>
                <button
                  onClick={() => onNavigateToWallet?.()}
                  className="w-full py-1.5 rounded-lg bg-[#00ff9d] hover:bg-[#00ff9d]/80 text-black font-bold text-[11px] transition-all"
                >
                  Conectar a Botcaza Wallet
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. SIMULATOR TERMINAL */}
      {activeModule === 'simulator' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <Bot className="w-4 h-4 text-[#29b6f6]" />
                Simulador Interactivo de Chat con @Botcoins_Tradebot_Gamebot
              </h4>
              <p className="text-xs text-zinc-400">
                Prueba cómo responde el bot de Telegram en tiempo real a comandos como /trade, /game, /botcoins y /wallet.
              </p>
            </div>
            <div className="flex gap-1.5">
              {['/trade', '/game', '/botcoins', '/start'].map((cmd) => (
                <button
                  key={cmd}
                  onClick={() => handleSendChatCommand(cmd)}
                  className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-cyan-400 font-mono text-[11px] transition-all"
                >
                  {cmd}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-black border border-zinc-800 space-y-4 max-h-[460px] overflow-y-auto">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} space-y-1.5`}
              >
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-500">
                  <span>{msg.sender === 'user' ? 'Tú' : '@Botcoins_Tradebot_Gamebot'}</span>
                  <span>&bull; {msg.time}</span>
                </div>
                <div
                  className={`max-w-xl p-3.5 rounded-2xl text-xs leading-relaxed whitespace-pre-line ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-none'
                      : 'bg-zinc-900 text-zinc-200 border border-zinc-800 rounded-tl-none font-mono'
                  }`}
                >
                  {msg.text}

                  {/* Inline Buttons inside message */}
                  {msg.buttons && msg.buttons.length > 0 && (
                    <div className="pt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {msg.buttons.map((btn, bidx) => (
                        <button
                          key={bidx}
                          onClick={btn.action}
                          className="px-3 py-2 rounded-xl bg-[#0088cc] hover:bg-[#0088cc]/90 text-white text-[11px] font-mono font-bold flex items-center justify-center gap-1.5 transition-all shadow cursor-pointer"
                        >
                          <span>{btn.label}</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Terminal Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendChatCommand(chatInput);
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Escribe un comando como /trade, /game o /botcoins..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-mono text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Enviar</span>
            </button>
          </form>
        </div>
      )}

      {/* 4. BOTFATHER SETUP GUIDE FOR @Botcoins_Tradebot_Gamebot */}
      {activeModule === 'botfather' && (
        <div className="p-5 rounded-xl bg-zinc-900/90 border border-zinc-800 space-y-4 text-xs font-mono">
          <div className="space-y-1">
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <Terminal className="w-4 h-4 text-cyan-400" />
              Configuración Oficial en @BotFather para @Botcoins_Tradebot_Gamebot
            </h4>
            <p className="text-zinc-400 text-xs">
              Usa estos comandos preconfigurados para vincular la Web App y habilitar el botón de menú oficial en Telegram:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3.5 rounded-xl bg-black border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between text-cyan-400 font-bold">
                <span>1. Habilitar Botón de Menú:</span>
                <button
                  onClick={() => handleCopy('https://script-ads.onrender.com/?tab=telegram-miniapp', 'cmd-menu')}
                  className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
                >
                  {copiedKey === 'cmd-menu' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
              <p className="text-zinc-400 text-[11px]">
                Envía a @BotFather: <code className="text-white">/setmenubutton</code>, selecciona <code className="text-blue-400">@{botUsername}</code> y pega:
              </p>
              <div className="p-2 rounded bg-zinc-950 text-emerald-300 text-[11px] truncate select-all">
                https://script-ads.onrender.com/?tab=telegram-miniapp
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-black border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between text-cyan-400 font-bold">
                <span>2. Configurar Comandos:</span>
                <button
                  onClick={() => handleCopy("trade - Señales de trading y DEX\ngame - Juegos y minería de Botcoins\nbotcoins - Tu saldo y recompensas\nwallet - Billetera Aptos Express\nhelp - Ayuda del bot", 'cmd-list')}
                  className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
                >
                  {copiedKey === 'cmd-list' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
              <p className="text-zinc-400 text-[11px]">
                Envía a @BotFather: <code className="text-white">/setcommands</code> y pega la lista de comandos para autocompletar en el chat.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-black border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between text-purple-400 font-bold">
                <span>3. Webhook en Render:</span>
                <button
                  onClick={() => handleCopy('https://script-ads.onrender.com/api/telegram/webhook', 'cmd-webhook-hub')}
                  className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
                >
                  {copiedKey === 'cmd-webhook-hub' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
              <p className="text-zinc-400 text-[11px]">
                URL oficial configurada para recibir eventos del bot en Render.com:
              </p>
              <div className="p-2 rounded bg-zinc-950 text-purple-300 text-[11px] truncate select-all">
                https://script-ads.onrender.com/api/telegram/webhook
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
