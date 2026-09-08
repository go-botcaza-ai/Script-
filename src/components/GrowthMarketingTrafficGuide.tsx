import React, { useState } from 'react';
import {
  Rocket,
  Share2,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  FileCode2,
  Sparkles,
  TrendingUp,
  DollarSign,
  Tv,
  Smartphone,
  Eye,
  CheckCircle2,
  Code2,
  Github,
  Award
} from 'lucide-react';

export const GrowthMarketingTrafficGuide: React.FC = () => {
  const [activePlatform, setActivePlatform] = useState<'meta' | 'tiktok' | 'youtube' | 'github'>('meta');
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(key);
    setTimeout(() => setCopiedLink(null), 2500);
  };

  const TRACKING_URLS = {
    meta: 'https://go.botcaza.ai/?utm_source=meta&utm_medium=instagram_reels&utm_campaign=aptos_ai_agent',
    tiktok: 'https://go.botcaza.ai/?utm_source=tiktok&utm_medium=short_video&utm_campaign=whale_tracker',
    youtube: 'https://go.botcaza.ai/?utm_source=youtube&utm_medium=shorts_bio&utm_campaign=aptos_analytics',
  };

  return (
    <div className="w-full bg-black text-slate-100 rounded-2xl border border-zinc-800 p-4 sm:p-6 lg:p-8 space-y-8 font-sans">
      
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-zinc-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00ff9d] animate-pulse" />
            <span className="text-xs font-mono font-bold tracking-wider text-[#00ff9d] uppercase">
              Playbook de Producción &bull; NeuraforgeAI &bull; Botcaza
            </span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Guía de Producción, Tráfico (Meta, TikTok, YouTube) &amp; GitHub
          </h2>
          <p className="text-sm text-zinc-400 max-w-3xl">
            Aprende a conectar tu aplicación con campañas de publicidad y contenido orgánico en Meta, TikTok y YouTube, además de la configuración legal para tu repositorio de GitHub.
          </p>
        </div>

        {/* Quick Revenue Summary Box */}
        <div className="p-4 rounded-xl bg-zinc-900 border border-emerald-500/30 space-y-2 min-w-[280px]">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-zinc-400">Embudo de Ingresos:</span>
            <span className="text-emerald-400 font-bold">Activo</span>
          </div>
          <div className="text-xs text-zinc-300 font-mono space-y-1">
            <div className="flex justify-between">
              <span className="text-zinc-500">AdSense:</span>
              <span className="text-white">pub-9493850506792206</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Analytics:</span>
              <span className="text-emerald-400">G-24Q6GBQN75</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Web Oficial:</span>
              <span className="text-white">go.botcaza.ai</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Pills */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setActivePlatform('meta')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
            activePlatform === 'meta'
              ? 'bg-[#1877F2] text-white shadow-lg'
              : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
          }`}
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Meta &bull; Instagram &amp; Facebook</span>
        </button>

        <button
          onClick={() => setActivePlatform('tiktok')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
            activePlatform === 'tiktok'
              ? 'bg-rose-500 text-white shadow-lg'
              : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>TikTok Business</span>
        </button>

        <button
          onClick={() => setActivePlatform('youtube')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
            activePlatform === 'youtube'
              ? 'bg-red-600 text-white shadow-lg'
              : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
          }`}
        >
          <Tv className="w-3.5 h-3.5" />
          <span>YouTube Shorts &amp; Videos</span>
        </button>

        <button
          onClick={() => setActivePlatform('github')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
            activePlatform === 'github'
              ? 'bg-emerald-500 text-black shadow-lg'
              : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
          }`}
        >
          <Github className="w-3.5 h-3.5" />
          <span>GitHub &bull; Licencia, Lenguajes &amp; Créditos</span>
        </button>
      </div>

      {/* PLATFORM 1: META */}
      {activePlatform === 'meta' && (
        <div className="space-y-6">
          <div className="p-5 rounded-xl bg-zinc-900/60 border border-blue-500/30 space-y-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Share2 className="w-4 h-4 text-blue-400" />
              Estrategia de Meta (Instagram Reels &amp; Anuncios en Facebook)
            </h3>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Meta es ideal para captar entusiastas cripto, inversores y desarrolladores con videos en formato vertical (9:16). Puedes usar tanto publicaciones orgánicas como campañas pagadas con objetivo "Tráfico al Sitio Web".
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3 text-xs">
              <h4 className="font-bold text-[#00ff9d] font-mono flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                Guión de Video Recomendado (Reel de 15-20 segundos):
              </h4>
              <div className="p-3 rounded-lg bg-black text-zinc-300 font-mono text-[11px] space-y-2 border border-zinc-800">
                <p><strong className="text-amber-400">[0-3s Gancho]:</strong> "¿Sabías qué billetera movió 500,000 APT hace 10 minutos?"</p>
                <p><strong className="text-cyan-400">[3-12s Demostración]:</strong> Muestras en pantalla grabando la interfaz de go.botcaza.ai consultando al Agente de IA en tiempo real.</p>
                <p><strong className="text-emerald-400">[12-18s Llamada a la acción]:</strong> "Prueba la IA gratis en el enlace de nuestro perfil o en go.botcaza.ai".</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3 text-xs">
              <h4 className="font-bold text-blue-400 font-mono flex items-center gap-1.5">
                <Share2 className="w-4 h-4" />
                Configuración en Meta Business Manager:
              </h4>
              <ul className="space-y-2 text-zinc-300 list-disc list-inside">
                <li><strong>Objetivo de Campaña:</strong> "Tráfico" o "Interacción".</li>
                <li><strong>Segmentación de Audiencia:</strong> Intereses en Criptomonedas, Web3, Inteligencia Artificial, Finanzas y Tecnología.</li>
                <li><strong>Ubicaciones:</strong> Instagram Stories &amp; Reels (pantalla vertical completa).</li>
              </ul>
            </div>
          </div>

          {/* Enlace con UTM listo */}
          <div className="p-4 rounded-xl bg-black border border-zinc-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
              <span>Tu Enlace de Campaña para Meta (con seguimiento UTM para GA4):</span>
              <button
                onClick={() => handleCopy(TRACKING_URLS.meta, 'meta')}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white cursor-pointer"
              >
                {copiedLink === 'meta' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink === 'meta' ? 'Copiado' : 'Copiar Enlace'}</span>
              </button>
            </div>
            <div className="p-3 rounded-lg bg-zinc-950 font-mono text-emerald-400 text-xs overflow-x-auto">
              <code>{TRACKING_URLS.meta}</code>
            </div>
          </div>
        </div>
      )}

      {/* PLATFORM 2: TIKTOK */}
      {activePlatform === 'tiktok' && (
        <div className="space-y-6">
          <div className="p-5 rounded-xl bg-zinc-900/60 border border-rose-500/30 space-y-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-rose-400" />
              Estrategia de TikTok Business (Viralidad Orgánica &amp; TikTok Ads)
            </h3>
            <p className="text-xs text-zinc-300 leading-relaxed">
              TikTok tiene el algoritmo de descubrimiento orgánico más rápido del mundo. El público de TikTok ama ver herramientas útiles y pantallas con estética cyber/hacker en tiempo real.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3 text-xs">
              <h4 className="font-bold text-rose-400 font-mono flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                Fórmula de Gancho para TikTok:
              </h4>
              <div className="p-3 rounded-lg bg-black text-zinc-300 font-mono text-[11px] space-y-2 border border-zinc-800">
                <p><strong className="text-amber-400">Texto en portada grande:</strong> "Esta IA lee la blockchain de Aptos en segundos 🤖"</p>
                <p><strong className="text-cyan-400">Voz en off sintética:</strong> "Descubrí esta terminal web que conecta BigQuery con un modelo Gemini para rastrear transacciones on-chain gratis."</p>
                <p><strong className="text-emerald-400">CTA en video:</strong> "Guarda este video y entra al link en bio: go.botcaza.ai".</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3 text-xs">
              <h4 className="font-bold text-white font-mono flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-[#00ff9d]" />
                Monetización Inmediata del Visitante:
              </h4>
              <p className="text-zinc-300">
                Cuando el usuario de TikTok hace clic en tu enlace:
              </p>
              <ul className="space-y-1.5 text-zinc-300 list-disc list-inside">
                <li>Se carga la página y tu Google AdSense (<code>pub-9493850506792206</code>) contabiliza la impresión.</li>
                <li>Los visitantes que lean las noticias o consulten el clima generarán ingresos por clic.</li>
                <li>Los usuarios avanzados pueden desbloquear videos Pay-Per-View vía Google Pay o micro-pagos con Aptos.</li>
              </ul>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-black border border-zinc-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
              <span>Tu Enlace de Campaña para TikTok:</span>
              <button
                onClick={() => handleCopy(TRACKING_URLS.tiktok, 'tiktok')}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white cursor-pointer"
              >
                {copiedLink === 'tiktok' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink === 'tiktok' ? 'Copiado' : 'Copiar Enlace'}</span>
              </button>
            </div>
            <div className="p-3 rounded-lg bg-zinc-950 font-mono text-rose-400 text-xs overflow-x-auto">
              <code>{TRACKING_URLS.tiktok}</code>
            </div>
          </div>
        </div>
      )}

      {/* PLATFORM 3: YOUTUBE */}
      {activePlatform === 'youtube' && (
        <div className="space-y-6">
          <div className="p-5 rounded-xl bg-zinc-900/60 border border-red-500/30 space-y-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Tv className="w-4 h-4 text-red-400" />
              Estrategia de YouTube (Shorts &bull; Comentarios Fijados &bull; SEO)
            </h3>
            <p className="text-xs text-zinc-300 leading-relaxed">
              YouTube es el segundo buscador más grande del mundo. Los usuarios buscan activamente términos como "cómo analizar Aptos", "previsión de criptomonedas con IA" y "Google BigQuery crypto".
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3 text-xs">
              <h4 className="font-bold text-red-400 font-mono">1. Ubicación del Enlace en YouTube:</h4>
              <ul className="space-y-2 text-zinc-300 list-disc list-inside">
                <li><strong>Primer comentario fijado (Pinned Comment):</strong> "🤖 Accede a la plataforma oficial de IA aquí 👉 https://go.botcaza.ai".</li>
                <li><strong>Primeras 2 líneas de la descripción del video.</strong></li>
                <li><strong>Enlace en el banner del canal de YouTube.</strong></li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3 text-xs">
              <h4 className="font-bold text-amber-400 font-mono">2. Tipos de Contenido con Alto Alcance:</h4>
              <ul className="space-y-2 text-zinc-300 list-disc list-inside">
                <li>Tutoriales de 1 minuto mostrando consultas SQL en BigQuery Studio.</li>
                <li>Alertas en vivo de movimientos de ballenas en Aptos Mainnet.</li>
                <li>Tutoriales sobre cómo integrar el script de noticias monetizado en WordPress.</li>
              </ul>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-black border border-zinc-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
              <span>Tu Enlace de Campaña para YouTube:</span>
              <button
                onClick={() => handleCopy(TRACKING_URLS.youtube, 'youtube')}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white cursor-pointer"
              >
                {copiedLink === 'youtube' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink === 'youtube' ? 'Copiado' : 'Copiar Enlace'}</span>
              </button>
            </div>
            <div className="p-3 rounded-lg bg-zinc-950 font-mono text-red-400 text-xs overflow-x-auto">
              <code>{TRACKING_URLS.youtube}</code>
            </div>
          </div>
        </div>
      )}

      {/* PLATFORM 4: GITHUB CREDITS & LICENSING */}
      {activePlatform === 'github' && (
        <div className="space-y-6">
          <div className="p-5 rounded-xl bg-zinc-900/60 border border-emerald-500/30 space-y-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Github className="w-4 h-4 text-emerald-400" />
              Estructura Legal del Repositorio de GitHub (Créditos, Lenguajes y Licencia)
            </h3>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Para protegerte de cualquier infracción de derechos de autor, problemas de copyright o responsabilidades financieras, ya hemos generado en la raíz de tu proyecto el archivo <strong className="text-white">LICENSE</strong> (Licencia MIT) y el archivo <strong className="text-white">README.md</strong> completo con todas las menciones necesarias.
            </p>
          </div>

          {/* Languages Breakdown Table */}
          <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3">
            <h4 className="font-bold text-white font-mono text-xs flex items-center gap-2">
              <Code2 className="w-4 h-4 text-cyan-400" />
              Lenguajes y Tecnologías Declaradas en el Repositorio:
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs border-collapse">
                <thead>
                  <tr className="border-b border-zinc-800 text-zinc-400">
                    <th className="py-2 px-3">Lenguaje</th>
                    <th className="py-2 px-3">Uso en la Plataforma</th>
                    <th className="py-2 px-3">¿Por qué es seguro?</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-[#00ff9d]">Move / Rust</td>
                    <td className="py-2.5 px-3">Smart Contracts y Máquina Virtual de Aptos (Move VM compilada en Rust).</td>
                    <td className="py-2.5 px-3 text-zinc-400">Código abierto oficial de Aptos Foundation (Apache 2.0).</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-cyan-400">TypeScript / Node.js</td>
                    <td className="py-2.5 px-3">Backend Express (server.ts), API REST y SDK de Gemini 3.8 Flash.</td>
                    <td className="py-2.5 px-3 text-zinc-400">Desarrollo propio bajo Licencia MIT.</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-indigo-400">Python &amp; SQL</td>
                    <td className="py-2.5 px-3">Consultas analíticas a BigQuery (crypto_aptos dataset público de Google).</td>
                    <td className="py-2.5 px-3 text-zinc-400">Datos públicos bajo licencia de Google Cloud Open Datasets.</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-blue-400">HTML5 &amp; React</td>
                    <td className="py-2.5 px-3">Interfaz gráfica responsive, terminal interactiva y gráficos.</td>
                    <td className="py-2.5 px-3 text-zinc-400">Estándares web abiertos y componentes React libres.</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-purple-400">PHP</td>
                    <td className="py-2.5 px-3">Scripts drop-in para WordPress y servidores cPanel tradicionales.</td>
                    <td className="py-2.5 px-3 text-zinc-400">Código modular de distribución abierta.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Legal Protection Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3 text-xs">
              <h4 className="font-bold text-emerald-400 font-mono flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                Cláusulas de Protección Incluidas:
              </h4>
              <ul className="space-y-2 text-zinc-300 list-disc list-inside">
                <li><strong>Exención Financiera (No Financial Advice):</strong> El software aclara formalmente que ninguna predicción de IA o métrica on-chain es asesoría de inversión.</li>
                <li><strong>Exención de Garantía (AS IS):</strong> No eres responsable por caídas de nodos de terceros, cambios en la red Aptos o fluctuaciones de mercado.</li>
                <li><strong>Fair Use de Marcas:</strong> Mención explícita de que Aptos es marca de Aptos Foundation y Google es marca de Google LLC.</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3 text-xs">
              <h4 className="font-bold text-amber-400 font-mono flex items-center gap-1.5">
                <Award className="w-4 h-4" />
                Créditos Oficiales en tu Repositorio:
              </h4>
              <div className="p-3 rounded-lg bg-black text-zinc-300 font-mono text-[11px] space-y-2 border border-zinc-800">
                <p><strong>Autor Principal:</strong> NeuraforgeAI &amp; Botcaza</p>
                <p><strong>Licencia:</strong> MIT License (Permite monetizar al 100%)</p>
                <p><strong>Inspiración de Datos:</strong> Aptos Labs &bull; Google Cloud BigQuery crypto_aptos dataset</p>
                <p><strong>Soporte:</strong> go.botcaza.ai@gmail.com</p>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
