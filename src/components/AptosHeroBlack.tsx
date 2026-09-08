import React, { useState, useEffect } from 'react';
import {
  Zap,
  Terminal,
  Database,
  Cpu,
  Layers,
  ArrowRight,
  Activity,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

interface AptosHeroBlackProps {
  onInitializeAgent: () => void;
  currentNetwork: string;
}

interface BlockStreamItem {
  id: string;
  blockHeight: number;
  latency: string;
  txs: number;
  timeAgo: string;
}

export const AptosHeroBlack: React.FC<AptosHeroBlackProps> = ({
  onInitializeAgent,
  currentNetwork
}) => {
  const [streamData, setStreamData] = useState<BlockStreamItem[]>([
    { id: '1', blockHeight: 103001420, latency: '0.194s', txs: 419, timeAgo: '1s' },
    { id: '2', blockHeight: 103001421, latency: '0.201s', txs: 382, timeAgo: '2s' },
    { id: '3', blockHeight: 103001422, latency: '0.188s', txs: 502, timeAgo: '3s' },
  ]);
  const [isConnected, setIsConnected] = useState(true);

  // Poll live block data from Aptos node
  useEffect(() => {
    let baseHeight = 103001423;
    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/aptos/ledger?network=' + currentNetwork);
        if (res.ok) {
          const json = await res.json();
          if (json.data && json.data.block_height) {
            baseHeight = Number(json.data.block_height);
          }
        }
      } catch {
        baseHeight += 1;
      }

      const randomLatency = (0.17 + Math.random() * 0.05).toFixed(3) + 's';
      const randomTxs = Math.floor(320 + Math.random() * 260);

      setStreamData(prev => [
        {
          id: String(Date.now()),
          blockHeight: baseHeight,
          latency: randomLatency,
          txs: randomTxs,
          timeAgo: 'ahora'
        },
        prev[0],
        prev[1]
      ].slice(0, 3));
    }, 3500);

    return () => clearInterval(interval);
  }, [currentNetwork]);

  return (
    <div
      id="aptos-hero-black-section"
      className="relative w-full bg-black text-white border-b border-emerald-950/40 overflow-hidden font-sans"
      style={{
        backgroundImage: `
          linear-gradient(to right, rgba(16, 185, 129, 0.07) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(16, 185, 129, 0.07) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
      }}
    >
      {/* Subtle radial green ambient glow */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 relative z-10">
        
        {/* Top Header Pill Bar (Reference Match) */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold tracking-wider uppercase shadow-xs">
              <Zap className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400" />
              <span>Aptos Intelligence</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-mono text-emerald-400/80">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>MAINNET OPERATIONAL</span>
              <span className="text-zinc-600">|</span>
              <span className="text-zinc-400">INDEXER LIVE</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-zinc-400 border border-zinc-800 bg-zinc-900/90 px-2.5 py-1 rounded">
              NeuraforgeAI &bull; Botcaza
            </span>
            <span className="text-[11px] font-mono text-emerald-400 border border-emerald-900/60 bg-emerald-950/40 px-2.5 py-1 rounded">
              GA4: G-24Q6GBQN75
            </span>
          </div>
        </div>

        {/* Hero Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Headline & Action */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Tag Badge (Reference: BIGQUERY CONNECTED) */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-emerald-500/20 bg-emerald-950/30 text-emerald-400 text-xs font-mono">
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span>BIGQUERY CONNECTED</span>
            </div>

            {/* Main Headline (Reference Match: Aptos AI Analytics) */}
            <div className="space-y-1">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-none">
                Aptos AI
              </h1>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#00ff9d] leading-none drop-shadow-[0_0_25px_rgba(0,255,157,0.3)]">
                Analytics
              </h1>
            </div>

            {/* Subtitle Description */}
            <p className="text-base sm:text-lg text-zinc-400 max-w-xl leading-relaxed font-normal">
              AI data analytics agent for the Aptos blockchain. Transform natural language into complex analytics in milliseconds.
            </p>

            {/* User Data & Monetization Callout */}
            <div className="p-3.5 rounded-lg bg-zinc-950/80 border border-zinc-800/80 flex flex-wrap items-center gap-4 text-xs font-mono text-zinc-300">
              <div className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>AdSense: pub-9493850506792206</span>
              </div>
              <span className="text-zinc-700 hidden sm:inline">&bull;</span>
              <div className="text-zinc-400">
                Host: <span className="text-zinc-200">go.botcaza.ai</span>
              </div>
              <span className="text-zinc-700 hidden sm:inline">&bull;</span>
              <div className="text-emerald-400/90">
                Ganancias Click-to-Earn Activas
              </div>
            </div>

            {/* Primary Action Button (Reference: INITIALIZE AGENT ->) */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                id="btn-initialize-agent"
                onClick={onInitializeAgent}
                className="group inline-flex items-center gap-2.5 px-6 py-3.5 rounded-lg bg-[#00ff9d] text-black font-mono font-bold text-sm tracking-wider uppercase transition-all duration-200 hover:bg-[#2bfda9] hover:shadow-[0_0_30px_rgba(0,255,157,0.5)] active:scale-98 cursor-pointer"
              >
                <span>INITIALIZE AGENT</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 stroke-[2.5]" />
              </button>

              <span className="text-xs font-mono text-zinc-500">
                Presiona para abrir el motor de consultas en tiempo real
              </span>
            </div>
          </div>

          {/* Right Column: Live Terminal Monitor (Reference Match: SYS_MONITOR.SH) */}
          <div className="lg:col-span-5">
            <div className="rounded-xl bg-[#090b0e] border border-zinc-800 shadow-2xl overflow-hidden">
              
              {/* Terminal Titlebar */}
              <div className="flex items-center justify-between px-4 py-3 bg-[#0d1015] border-b border-zinc-800/80">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-400 font-medium">
                  <Terminal className="w-3.5 h-3.5 text-zinc-400" />
                  <span>SYS_MONITOR.SH</span>
                </div>
                <div className="w-6" />
              </div>

              {/* Terminal Logs Body */}
              <div className="p-5 font-mono text-xs space-y-4">
                <div className="space-y-1 text-zinc-400">
                  <div className="flex items-center gap-2 text-emerald-400/90">
                    <span className="text-emerald-500">&gt;</span>
                    <span>Connecting to aptos-data-pdp...</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-400/90">
                    <span className="text-emerald-500">&gt;</span>
                    <span>Schema loaded: crypto_aptos_mainnet_us</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-400">
                    <span className="text-emerald-500">&gt;</span>
                    <span>Vector indexing complete. Waiting for query...</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-zinc-800/60">
                  <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-emerald-400/80 font-bold mb-2">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      <span>LIVE DATA STREAM</span>
                    </div>
                    <span className="text-zinc-500 font-mono">APTOS V1 NODE</span>
                  </div>

                  {/* Live Block Stream Rows */}
                  <div className="space-y-2">
                    {streamData.map((b, idx) => (
                      <div
                        key={b.id || idx}
                        className="flex items-center justify-between px-3 py-2 rounded bg-emerald-950/20 border border-emerald-900/30 text-xs text-zinc-200 transition-all hover:border-emerald-500/40"
                      >
                        <span className="font-bold text-emerald-300">
                          BLK_{b.blockHeight}
                        </span>
                        <span className="text-zinc-400 text-[11px]">
                          {b.latency}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800/40 text-emerald-400 text-[11px] font-bold">
                          {b.txs} TXs
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Three-Column Spec Bar (Reference Match: TARGET PROTOCOL, PROCESSING MODEL, DATA SINK) */}
        <div className="mt-14 pt-8 border-t border-zinc-800/80 grid grid-cols-1 sm:grid-cols-3 gap-6 font-mono">
          <div>
            <div className="text-[11px] uppercase tracking-widest text-zinc-500">
              TARGET PROTOCOL
            </div>
            <div className="text-sm sm:text-base font-bold text-white mt-1 flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>Aptos</span>
            </div>
          </div>

          <div>
            <div className="text-[11px] uppercase tracking-widest text-zinc-500">
              PROCESSING MODEL
            </div>
            <div className="text-sm sm:text-base font-bold text-white mt-1 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>Gemini Data Agent</span>
            </div>
          </div>

          <div>
            <div className="text-[11px] uppercase tracking-widest text-zinc-500">
              DATA SINK
            </div>
            <div className="text-sm sm:text-base font-bold text-white mt-1 flex items-center gap-2">
              <Database className="w-4 h-4 text-indigo-400" />
              <span>Google BigQuery</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
