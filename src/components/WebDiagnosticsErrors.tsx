import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RefreshCw,
  Send,
  Code2,
  Copy,
  Check,
  Globe,
  ShieldAlert,
  Server,
  Terminal,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface ErrorItem {
  id: string;
  code: string;
  title: string;
  severity: 'high' | 'medium' | 'low';
  category: 'analytics' | 'network' | 'server' | 'security';
  description: string;
  whyItHappens: string[];
  solutionSteps: string[];
  codeFixSnippet?: string;
}

export const WebDiagnosticsErrors: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedError, setExpandedError] = useState<string>('ga4-no-data');
  const [pingStatus, setPingStatus] = useState<'idle' | 'testing' | 'success' | 'failed'>('idle');
  const [pingMessage, setPingMessage] = useState<string | null>(null);
  const [copiedSnippet, setCopiedSnippet] = useState(false);

  const handleTestPing = async () => {
    setPingStatus('testing');
    setPingMessage('Enviando evento de verificación a G-24Q6GBQN75...');

    try {
      if (typeof (window as any).gtag === 'function') {
        (window as any).gtag('event', 'diagnostic_ping_test', {
          event_category: 'Neuraforge_Troubleshooting',
          measurement_id: 'G-24Q6GBQN75',
          domain: 'https://go.botcaza.ai',
          publisher_id: 'pub-9493850506792206',
          timestamp: new Date().toISOString(),
        });
      }

      await new Promise(r => setTimeout(r, 1200));

      setPingStatus('success');
      setPingMessage('¡Evento enviado con éxito! Abre tu panel de Google Analytics > Informes > "En tiempo real" (Realtime) para ver la visita reflejada al instante.');
    } catch (e: any) {
      setPingStatus('failed');
      setPingMessage('Error al disparar el ping: ' + e.message);
    }
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  const COMMON_ERRORS: ErrorItem[] = [
    {
      id: 'ga4-no-data',
      code: 'GA4_NO_DATA_48H',
      title: 'Google Analytics: "No se han recibido datos durante las últimas 48 horas"',
      severity: 'high',
      category: 'analytics',
      description: 'El flujo de datos "Botcaza by NeuraforgeAI analitics" (G-24Q6GBQN75) muestra este aviso en tu consola de Google Analytics.',
      whyItHappens: [
        'Uso de Bloqueadores de Anuncios: Si tú o tus usuarios navegan con AdBlock, uBlock Origin o Brave Shields, el script googletagmanager.com es bloqueado por defecto y no envía datos.',
        'Falta de tráfico real inicial: Si la web aún no tiene visitantes constantes, pasadas 48 horas sin visitas GA4 emite este aviso automático.',
        'Etiqueta fuera del <head>: Si gtag.js está al final del body o dentro de un componente que carga tarde, los visitantes que salen rápido no se registran.',
        'Retraso del procesamiento de informes estándar: GA4 tarda entre 24 y 48 horas en poblar los gráficos generales, mientras que la sección "En tiempo real" es instantánea.'
      ],
      solutionSteps: [
        'Paso 1: Coloca el snippet de gtag.js como primer elemento dentro de <head> en https://go.botcaza.ai.',
        'Paso 2: Abre una pestaña en Modo Incógnito sin extensiones de AdBlock.',
        'Paso 3: Entra a Google Analytics > Informes > "En tiempo real" (Realtime) y verifica si aparece 1 usuario activo.',
        'Paso 4: Usa el botón de "Enviar Ping de Prueba" a continuación para confirmar el envío.'
      ],
      codeFixSnippet: `<!-- Código correcto para colocar en el <head> de https://go.botcaza.ai -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-24Q6GBQN75"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-24Q6GBQN75', {
    send_page_view: true,
    publisher_id: 'pub-9493850506792206'
  });
</script>`
    },
    {
      id: 'adsense-missing-ads-txt',
      code: 'ADSENSE_NO_ADS_TXT',
      title: 'Google AdSense: "Rastreador no autorizado / Falta de archivo ads.txt"',
      severity: 'high',
      category: 'analytics',
      description: 'Google AdSense retiene los pagos y clics de pub-9493850506792206 si el dominio go.botcaza.ai no expone su archivo ads.txt.',
      whyItHappens: [
        'El archivo no existe en la raíz pública del dominio (https://go.botcaza.ai/ads.txt).',
        'El archivo devuelve código 404 Not Found o una página HTML en vez de texto plano (Content-Type: text/plain).',
        'El ID del editor tiene un error tipográfico o falta la autorización DIRECT.'
      ],
      solutionSteps: [
        'Crea un archivo llamado "ads.txt" en la raíz de tu hosting o servidor web.',
        'Pega la línea oficial autorizada.',
        'Comprueba que al abrir https://go.botcaza.ai/ads.txt en tu navegador veas el texto directamente sin errores.'
      ],
      codeFixSnippet: `google.com, pub-9493850506792206, DIRECT, f08c47fec0942fa0`
    },
    {
      id: 'cors-policy-blocked',
      code: 'CORS_ERROR_FETCH',
      title: 'Error CORS: "Access to fetch has been blocked by CORS policy"',
      severity: 'medium',
      category: 'network',
      description: 'Ocurre cuando tu frontend en JavaScript intenta consultar una API de noticias o clima en otro dominio y el navegador bloquea la respuesta.',
      whyItHappens: [
        'La API remota no incluye la cabecera Access-Control-Allow-Origin: *.',
        'Peticiones autenticadas donde faltan cabeceras de pre-vuelo (OPTIONS).'
      ],
      solutionSteps: [
        'En tu backend de Node/Express, agrega el middleware cors() o la cabecera correspondiente.',
        'En PHP, agrega header("Access-Control-Allow-Origin: *"); al inicio del script.',
        'En frontend, utiliza tu propio backend como proxy intermediario.'
      ],
      codeFixSnippet: `// Solución en Node/Express:
import cors from 'cors';
app.use(cors({ origin: '*' }));

// Solución en PHP:
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');`
    },
    {
      id: 'error-502-bad-gateway',
      code: 'HTTP_502_BAD_GATEWAY',
      title: 'Error 502 Bad Gateway: "Servidor Proxy / NGINX sin respuesta"',
      severity: 'high',
      category: 'server',
      description: 'El servidor web intermediario (NGINX, Cloudflare o Cloud Run) intentó contactar con el proceso de tu aplicación pero este no respondió o se cayó.',
      whyItHappens: [
        'La aplicación Node/Python/PHP se cerró por un fallo no capturado (uncaught exception).',
        'El servidor está escuchando en el puerto equivocado (por ejemplo 8080 en vez de 3000).',
        'Falta de memoria RAM o CPU saturada.'
      ],
      solutionSteps: [
        'Verifica que el proceso esté activo con pm2 status o en los logs de Cloud Run.',
        'Asegúrate de que la aplicación enlace a host 0.0.0.0 y no únicamente a 127.0.0.1.',
        'Agrega manejadores process.on("uncaughtException") para evitar cierres repentinos.'
      ],
      codeFixSnippet: `// Asegurar enlace a todas las interfaces
app.listen(3000, '0.0.0.0', () => {
  console.log('Servidor corriendo correctamente en puerto 3000');
});`
    },
    {
      id: 'dns-nxdomain',
      code: 'DNS_PROBE_FINISHED_NXDOMAIN',
      title: 'Error DNS: "No se puede encontrar la dirección IP del servidor"',
      severity: 'high',
      category: 'network',
      description: 'Los visitantes no pueden abrir https://go.botcaza.ai porque los servidores DNS no encuentran los registros del dominio.',
      whyItHappens: [
        'Falta el registro tipo A apuntando a la IP pública del servidor.',
        'El subdominio "go" no tiene un registro CNAME configurado en tu panel de DNS (Cloudflare, GoDaddy, etc.).',
        'El dominio acaba de comprarse y está en periodo de propagación DNS (hasta 24-48 horas).'
      ],
      solutionSteps: [
        'Entra a tu proveedor de DNS y crea un registro CNAME con nombre "go" apuntando a la dirección de tu hosting.',
        'Si usas Cloudflare, activa el proxy (nube naranja) para protección DDoS y SSL automático.',
        'Verifica la propagación con herramientas como dnschecker.org.'
      ]
    },
    {
      id: 'ssl-mixed-content',
      code: 'SSL_MIXED_CONTENT',
      title: 'Error SSL / Mixed Content: "Bloqueo de contenido mixto HTTP/HTTPS"',
      severity: 'medium',
      category: 'security',
      description: 'Tu sitio web tiene candado seguro HTTPS (https://go.botcaza.ai), pero intenta cargar imágenes, scripts o fuentes desde URLs con "http://".',
      whyItHappens: [
        'Enlaces de APIs de noticias o clima con http:// en lugar de https://.',
        'Recursos externos que no soportan SSL.'
      ],
      solutionSteps: [
        'Reemplaza todas las URLs absolutas http:// por https://.',
        'Agrega la meta etiqueta upgrade-insecure-requests en el <head> para forzar HTTPS automáticamente.'
      ],
      codeFixSnippet: `<meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">`
    }
  ];

  const filteredErrors = selectedCategory === 'all'
    ? COMMON_ERRORS
    : COMMON_ERRORS.filter(e => e.category === selectedCategory);

  return (
    <div className="w-full bg-slate-950 text-slate-100 rounded-2xl border border-slate-800 p-4 sm:p-6 lg:p-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span className="text-xs font-mono font-bold tracking-wider text-amber-400 uppercase">
              Centro de Diagnóstico &bull; NeuraforgeAI
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white">
            Errores Más Comunes de Internet &amp; Google Analytics
          </h2>
          <p className="text-sm text-slate-400 max-w-2xl">
            Soluciones paso a paso para el aviso de 48 horas sin datos en <strong className="text-white">G-24Q6GBQN75</strong>, autorización de <strong className="text-white">pub-9493850506792206</strong>, fallos de CORS, 502 Bad Gateway y DNS.
          </p>
        </div>

        {/* Live Interactive Ping Test Button for G-24Q6GBQN75 */}
        <div className="p-4 rounded-xl bg-slate-900 border border-emerald-500/30 space-y-2.5 min-w-[280px]">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-zinc-400 font-bold">Test de Ping a GA4:</span>
            <span className="text-emerald-400">G-24Q6GBQN75</span>
          </div>

          <button
            onClick={handleTestPing}
            disabled={pingStatus === 'testing'}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-emerald-400 text-black font-mono font-bold text-xs hover:bg-emerald-300 transition-all cursor-pointer disabled:opacity-50"
          >
            <Send className={`w-3.5 h-3.5 ${pingStatus === 'testing' ? 'animate-spin' : ''}`} />
            <span>{pingStatus === 'testing' ? 'Enviando Ping...' : 'Enviar Ping de Prueba a GA4'}</span>
          </button>

          {pingMessage && (
            <div className={`p-2 rounded text-[11px] font-mono ${
              pingStatus === 'success' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-red-950 text-red-300'
            }`}>
              {pingMessage}
            </div>
          )}
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2">
        {[
          { id: 'all', label: 'Todos los Errores' },
          { id: 'analytics', label: 'Google Analytics & AdSense' },
          { id: 'network', label: 'CORS & Red' },
          { id: 'server', label: 'Servidor & Gateway (502/504)' },
          { id: 'security', label: 'SSL & Seguridad' },
        ].map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
              selectedCategory === cat.id
                ? 'bg-emerald-500 text-black font-bold'
                : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* List of Accordion Errors */}
      <div className="space-y-4">
        {filteredErrors.map(err => {
          const isExpanded = expandedError === err.id;
          return (
            <div
              key={err.id}
              className={`rounded-xl border transition-all ${
                isExpanded
                  ? 'bg-slate-900/90 border-emerald-500/50 shadow-lg'
                  : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Header Toggle */}
              <button
                onClick={() => setExpandedError(isExpanded ? '' : err.id)}
                className="w-full p-4 sm:p-5 flex items-center justify-between text-left gap-4"
              >
                <div className="flex items-center gap-3">
                  <span className={`p-2 rounded-lg ${
                    err.severity === 'high' ? 'bg-amber-950/80 text-amber-400 border border-amber-800/40' : 'bg-cyan-950/80 text-cyan-400 border border-cyan-800/40'
                  }`}>
                    <AlertTriangle className="w-4 h-4" />
                  </span>
                  <div>
                    <span className="text-[11px] font-mono text-emerald-400 font-bold block">
                      {err.code}
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-white">
                      {err.title}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-slate-400">
                  <span className="hidden sm:inline text-xs font-mono text-zinc-500">
                    {isExpanded ? 'Ocultar' : 'Ver solución'}
                  </span>
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {/* Collapsible Details */}
              {isExpanded && (
                <div className="px-4 sm:px-5 pb-5 pt-1 border-t border-slate-800/80 space-y-4 text-xs">
                  <p className="text-slate-300 leading-relaxed">
                    {err.description}
                  </p>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Why it happens */}
                    <div className="p-3.5 rounded-lg bg-black/50 border border-slate-800 space-y-2">
                      <div className="font-bold text-amber-400 font-mono flex items-center gap-1.5">
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span>¿Por qué ocurre este problema?</span>
                      </div>
                      <ul className="space-y-1 text-slate-400 list-disc list-inside">
                        {err.whyItHappens.map((w, i) => (
                          <li key={i}>{w}</li>
                        ))}
                      </ul>
                    </div>

                    {/* How to solve */}
                    <div className="p-3.5 rounded-lg bg-black/50 border border-slate-800 space-y-2">
                      <div className="font-bold text-emerald-400 font-mono flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Pasos para solucionarlo de raíz</span>
                      </div>
                      <ol className="space-y-1 text-slate-400 list-decimal list-inside">
                        {err.solutionSteps.map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ol>
                    </div>
                  </div>

                  {/* Code snippet if applicable */}
                  {err.codeFixSnippet && (
                    <div className="space-y-2 pt-2">
                      <div className="flex items-center justify-between text-zinc-400 font-mono text-[11px]">
                        <span>Código Corregido Listo para Copiar:</span>
                        <button
                          onClick={() => handleCopy(err.codeFixSnippet!)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-white"
                        >
                          {copiedSnippet ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedSnippet ? 'Copiado' : 'Copiar'}</span>
                        </button>
                      </div>
                      <div className="p-3 rounded-lg bg-black border border-zinc-800 font-mono text-emerald-400 overflow-x-auto text-[11px]">
                        <pre><code>{err.codeFixSnippet}</code></pre>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};
