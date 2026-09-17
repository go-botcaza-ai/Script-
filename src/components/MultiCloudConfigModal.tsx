import React, { useState } from 'react';
import {
  Server,
  Cloud,
  Cpu,
  Shield,
  Activity,
  CheckCircle2,
  X,
  ExternalLink,
  Layers,
  Database,
  Radio,
  Sliders,
  Sparkles,
  Zap,
  Globe,
  Share2,
  ArrowRight
} from 'lucide-react';
import { AccessTokenState } from '../types';

interface MultiCloudConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  authState: AccessTokenState;
}

type CloudProvider = 'google' | 'microsoft' | 'facebook';

export const MultiCloudConfigModal: React.FC<MultiCloudConfigModalProps> = ({
  isOpen,
  onClose,
  authState
}) => {
  const [activeTab, setActiveTab] = useState<'status' | 'routing' | 'credentials'>('status');
  const [selectedSimulatedProvider, setSelectedSimulatedProvider] = useState<CloudProvider>(
    authState.authProvider || 'google'
  );

  if (!isOpen) return null;

  const currentProvider = authState.authProvider || selectedSimulatedProvider || 'google';

  return (
    <div
      id="multi-cloud-config-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="multi-cloud-config-card"
        className="bg-zinc-950 border border-zinc-800 text-white rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-zinc-900 via-zinc-900 to-black p-6 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 text-black flex items-center justify-center font-bold shadow-md">
              <Server className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">
                  Centro de Infraestructura &amp; Servidores Multi-Cloud
                </h2>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold">
                  IAgentbotcaza Core
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Arquitectura distribuida con balanceo de cargas por proveedor (Google, Microsoft &amp; Meta Business).
              </p>
            </div>
          </div>

          <button
            id="btn-close-cloud-config"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition-colors border border-zinc-800 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex items-center gap-2 px-6 pt-4 border-b border-zinc-800/80 bg-zinc-950/60">
          <button
            id="tab-btn-cloud-status"
            onClick={() => setActiveTab('status')}
            className={`pb-3 px-3 text-xs font-semibold border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'status'
                ? 'border-emerald-400 text-emerald-400 font-bold'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            Servidores &amp; Clústers
          </button>

          <button
            id="tab-btn-cloud-routing"
            onClick={() => setActiveTab('routing')}
            className={`pb-3 px-3 text-xs font-semibold border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'routing'
                ? 'border-emerald-400 text-emerald-400 font-bold'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            Enrutamiento &amp; Balanceo de Carga
          </button>

          <button
            id="tab-btn-cloud-credentials"
            onClick={() => setActiveTab('credentials')}
            className={`pb-3 px-3 text-xs font-semibold border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'credentials'
                ? 'border-emerald-400 text-emerald-400 font-bold'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            Guía de Trámites Developers
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* TAB 1: CLUSTERS & SERVERS */}
          {activeTab === 'status' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 text-xs text-zinc-300 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>
                    Proveedor asignado a tu sesión:{' '}
                    <strong className="text-white capitalize font-mono">
                      {currentProvider === 'google'
                        ? 'Google Cloud & Gemini Suite'
                        : currentProvider === 'microsoft'
                        ? 'Microsoft Azure & OpenAI Suite'
                        : 'Meta Cloud & Facebook Business Suite'}
                    </strong>
                  </span>
                </div>
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded">
                  Balanceado automáticamente
                </span>
              </div>

              {/* 3 Clusters Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 1. Google Suite */}
                <div
                  className={`p-4 rounded-2xl border transition-all ${
                    currentProvider === 'google'
                      ? 'bg-zinc-900 border-blue-500/60 shadow-[0_0_20px_rgba(66,133,244,0.15)]'
                      : 'bg-zinc-900/40 border-zinc-800 opacity-80'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                      <svg className="w-4 h-4" viewBox="0 0 48 48">
                        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                      </svg>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                      ONLINE &bull; 14ms
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white">Google Cloud &amp; Gemini</h3>
                  <p className="text-[11px] text-zinc-400 mt-1 mb-3">
                    Infraestructura dedicada a IA generativa, analítica masiva y monetización AdSense.
                  </p>
                  <div className="space-y-1.5 text-[11px] font-mono text-zinc-300">
                    <div className="flex justify-between py-1 border-b border-zinc-800/60">
                      <span className="text-zinc-500">Servidores:</span>
                      <span className="text-white">Cloud Run us-east5</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-zinc-800/60">
                      <span className="text-zinc-500">Motor IA:</span>
                      <span className="text-emerald-400">Gemini 2.5 Flash</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-zinc-800/60">
                      <span className="text-zinc-500">AdSense ID:</span>
                      <span className="text-zinc-400">pub-9493850506792206</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-zinc-500">GA4 Tag:</span>
                      <span className="text-zinc-400">G-24Q6GBQN75</span>
                    </div>
                  </div>
                </div>

                {/* 2. Microsoft Azure Suite */}
                <div
                  className={`p-4 rounded-2xl border transition-all ${
                    currentProvider === 'microsoft'
                      ? 'bg-zinc-900 border-cyan-500/60 shadow-[0_0_20px_rgba(0,164,239,0.15)]'
                      : 'bg-zinc-900/40 border-zinc-800 opacity-80'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
                      <svg className="w-4 h-4" viewBox="0 0 21 21">
                        <rect x="1" y="1" width="9" height="9" fill="#f25022" />
                        <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
                        <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
                        <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
                      </svg>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/30">
                      ONLINE &bull; 18ms
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white">Microsoft Azure &amp; OpenAI</h3>
                  <p className="text-[11px] text-zinc-400 mt-1 mb-3">
                    Infraestructura de identidad corporativa Entra ID, Microsoft Graph y Bing Rewards.
                  </p>
                  <div className="space-y-1.5 text-[11px] font-mono text-zinc-300">
                    <div className="flex justify-between py-1 border-b border-zinc-800/60">
                      <span className="text-zinc-500">Servidores:</span>
                      <span className="text-white">Azure East US Cluster</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-zinc-800/60">
                      <span className="text-zinc-500">Motor IA:</span>
                      <span className="text-cyan-400">Azure OpenAI GPT-4o</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-zinc-800/60">
                      <span className="text-zinc-500">Identidad:</span>
                      <span className="text-zinc-400">Microsoft Entra ID</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-zinc-500">Ecosistema:</span>
                      <span className="text-zinc-400">Bing Rewards API</span>
                    </div>
                  </div>
                </div>

                {/* 3. Facebook Business & Meta */}
                <div
                  className={`p-4 rounded-2xl border transition-all ${
                    currentProvider === 'facebook'
                      ? 'bg-zinc-900 border-blue-600/60 shadow-[0_0_20px_rgba(24,119,242,0.15)]'
                      : 'bg-zinc-900/40 border-zinc-800 opacity-80'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-8 h-8 rounded-xl bg-blue-600/10 border border-blue-600/30 flex items-center justify-center text-[#1877f2]">
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-blue-400 bg-blue-950/80 px-2 py-0.5 rounded border border-blue-600/30">
                      ONLINE &bull; 16ms
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white">Facebook Business &amp; Meta</h3>
                  <p className="text-[11px] text-zinc-400 mt-1 mb-3">
                    Integración con Meta Marketing API, Graph API, WhatsApp Business y difusión social.
                  </p>
                  <div className="space-y-1.5 text-[11px] font-mono text-zinc-300">
                    <div className="flex justify-between py-1 border-b border-zinc-800/60">
                      <span className="text-zinc-500">Servidores:</span>
                      <span className="text-white">Meta Graph Edge Node</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-zinc-800/60">
                      <span className="text-zinc-500">Motor IA:</span>
                      <span className="text-blue-400">Meta Llama 3 Core</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-zinc-800/60">
                      <span className="text-zinc-500">Marketing API:</span>
                      <span className="text-zinc-400">v19.0 Graph</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-zinc-500">WhatsApp:</span>
                      <span className="text-zinc-400">Cloud Business API</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ROUTING & LOAD BALANCING */}
          {activeTab === 'routing' && (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800">
                <h4 className="text-sm font-bold text-white flex items-center gap-2 mb-2">
                  <Sliders className="w-4 h-4 text-emerald-400" />
                  Balanceo Automático por Identidad de Usuario (Identity-Bound Routing)
                </h4>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Cuando un usuario inicia sesión con <strong>Google</strong>, sus peticiones y procesamiento de IA se dirigen automáticamente a la infraestructura de Google Cloud (Gemini API &amp; BigQuery). Cuando inicia sesión con <strong>Microsoft</strong>, se dirigen a los servidores de Microsoft Azure (Azure OpenAI &amp; Microsoft Graph). Y con <strong>Facebook Business</strong>, se enrutan a la infraestructura de Meta (Graph API &amp; Marketing).
                </p>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-black/60 border border-zinc-800">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase block">Carga Google</span>
                    <span className="text-lg font-bold text-emerald-400 font-mono">34%</span>
                    <span className="text-[10px] text-zinc-400 block">Distribución Óptima</span>
                  </div>
                  <div className="p-3 rounded-xl bg-black/60 border border-zinc-800">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase block">Carga Microsoft</span>
                    <span className="text-lg font-bold text-cyan-400 font-mono">38%</span>
                    <span className="text-[10px] text-zinc-400 block">Distribución Óptima</span>
                  </div>
                  <div className="p-3 rounded-xl bg-black/60 border border-zinc-800">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase block">Carga Meta</span>
                    <span className="text-lg font-bold text-blue-400 font-mono">28%</span>
                    <span className="text-[10px] text-zinc-400 block">Distribución Óptima</span>
                  </div>
                </div>
              </div>

              {/* Selector manual para testing */}
              <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800">
                <span className="text-xs font-semibold text-zinc-300 block mb-2">
                  Simular / Probar Enrutamiento Manual a Clúster:
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setSelectedSimulatedProvider('google')}
                    className={`py-2 px-3 rounded-xl text-xs font-mono font-bold border transition-all ${
                      selectedSimulatedProvider === 'google'
                        ? 'bg-blue-600 text-white border-blue-400'
                        : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                    }`}
                  >
                    Google Cloud
                  </button>
                  <button
                    onClick={() => setSelectedSimulatedProvider('microsoft')}
                    className={`py-2 px-3 rounded-xl text-xs font-mono font-bold border transition-all ${
                      selectedSimulatedProvider === 'microsoft'
                        ? 'bg-cyan-600 text-white border-cyan-400'
                        : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                    }`}
                  >
                    Microsoft Azure
                  </button>
                  <button
                    onClick={() => setSelectedSimulatedProvider('facebook')}
                    className={`py-2 px-3 rounded-xl text-xs font-mono font-bold border transition-all ${
                      selectedSimulatedProvider === 'facebook'
                        ? 'bg-[#1877f2] text-white border-blue-400'
                        : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                    }`}
                  >
                    Facebook Business
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: DEVELOPER CREDENTIALS & TRAMITES */}
          {activeTab === 'credentials' && (
            <div className="space-y-4">
              {/* Google Setup Guide */}
              <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    1. Google Cloud &amp; Gemini (Ya Configurado)
                  </h4>
                  <span className="text-[10px] font-mono text-emerald-400">Activo</span>
                </div>
                <p className="text-[11px] text-zinc-400">
                  Autenticación OAuth 2.0 y Gemini API integrados en Firebase Authentication y Cloud Run con dominio autorizado.
                </p>
              </div>

              {/* Microsoft Azure Setup Guide */}
              <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-500" />
                    2. Microsoft Azure Entra ID (Gratis, sin costo)
                  </h4>
                  <a
                    href="https://portal.azure.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] text-cyan-400 hover:underline flex items-center gap-1"
                  >
                    portal.azure.com <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Entra a <strong>portal.azure.com</strong> &rarr; <em>Microsoft Entra ID</em> &rarr; <em>Registros de aplicaciones</em> &rarr; Nuevo registro (tipo cuentas organizativas y personales) &rarr; Obtén tu <strong>Application ID</strong> y <strong>Client Secret</strong> y pégalos en Firebase Authentication &gt; Sign-in method &gt; Microsoft.
                </p>
              </div>

              {/* Meta / Facebook Business Guide */}
              <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#1877f2]" />
                    3. Facebook Business / Meta for Developers (Gratis)
                  </h4>
                  <a
                    href="https://developers.facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] text-blue-400 hover:underline flex items-center gap-1"
                  >
                    developers.facebook.com <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  1. Entra a <strong>developers.facebook.com</strong> con tu cuenta de Facebook o Meta Business.<br />
                  2. Haz clic en <strong>Crear app</strong> y elige el tipo <em>Empresa / Negocio (Business)</em> o <em>Consumidor</em>.<br />
                  3. Agrega el producto <strong>Facebook Login</strong>.<br />
                  4. En <strong>Configuración básica</strong> copia tu <strong>App ID</strong> y <strong>App Secret (Clave secreta)</strong>.<br />
                  5. En Firebase Console &gt; Authentication &gt; Sign-in method &gt; <strong>Facebook</strong>, pega ambos valores.<br />
                  6. En Facebook Login &gt; Configuración &gt; <strong>URI de redireccionamiento de OAuth válidos</strong> pega la URL de redirección generada por Firebase.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-zinc-900/80 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
          <span className="font-mono text-[11px]">
            Nodo: <span className="text-emerald-400 font-bold">IAgentbotcaza-mesh-01</span>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-semibold transition-colors cursor-pointer text-xs"
          >
            Cerrar Configuración
          </button>
        </div>
      </div>
    </div>
  );
};
