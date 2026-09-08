import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  Database,
  Cpu,
  RefreshCw,
  Copy,
  Check,
  ArrowRight,
  TrendingUp,
  Layers,
  Terminal,
  Activity,
  Code2,
  AlertCircle
} from 'lucide-react';
import { GoogleDataAgentResponse } from '../types';
import { queryGoogleDataAgent } from '../lib/aptosApi';

interface AptosDataAgentPanelProps {
  currentNetwork: string;
  onNetworkChange: (net: string) => void;
  onSelectAccount?: (addr: string) => void;
}

const PRESET_QUERIES = [
  {
    title: 'Métricas y TPS de Aptos',
    prompt: '¿Cuál es el estado actual de la red Aptos, altura de bloque, versión del ledger y TPS estimado?',
    category: 'Red & Rendimiento'
  },
  {
    title: 'Inspeccionar Cuenta 0x1 (Core Framework)',
    prompt: 'Consultar el saldo de APT, secuencia y recursos registrados en la cuenta 0x1 del Aptos Framework',
    category: 'Cuentas & Balances'
  },
  {
    title: 'Top Consumidores de Gas en BigQuery',
    prompt: 'Genera una consulta SQL de Google BigQuery para encontrar las 10 transacciones con mayor consumo de gas en bigquery-public-data.crypto_aptos',
    category: 'BigQuery SQL'
  },
  {
    title: 'Transacciones y Tasa de Éxito',
    prompt: 'Analizar las transacciones recientes en Aptos, tasa de éxito (success) y promedio de gas_used',
    category: 'Transacciones'
  },
  {
    title: 'Módulos Move y Tokenómica',
    prompt: 'Explica cómo funciona el módulo 0x1::aptos_coin::AptosCoin y la gestión de recursos de Move en Aptos',
    category: 'Move Contracts'
  }
];

export const AptosDataAgentPanel: React.FC<AptosDataAgentPanelProps> = ({
  currentNetwork,
  onNetworkChange,
  onSelectAccount
}) => {
  const [promptInput, setPromptInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState<string | null>(null);
  const [result, setResult] = useState<GoogleDataAgentResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);
  const [showRawJson, setShowRawJson] = useState(false);

  const handleExecuteQuery = async (queryText?: string) => {
    const textToRun = queryText || promptInput;
    if (!textToRun.trim() || loading) return;

    setLoading(true);
    setError(null);
    setActiveStep('Interpretando consulta con Google Data Agent...');

    try {
      setTimeout(() => {
        setActiveStep('Consultando nodos RPC y datasets de Aptos...');
      }, 700);

      const res = await queryGoogleDataAgent(textToRun, currentNetwork);
      setResult(res.agentResult);
    } catch (err: any) {
      setError(err.message || 'Error al procesar la consulta con el agente');
    } finally {
      setLoading(false);
      setActiveStep(null);
    }
  };

  const handleCopySql = (sql: string) => {
    navigator.clipboard.writeText(sql);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  const handleCopyJson = (data: any) => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  return (
    <div className="space-y-6" id="aptos-data-agent-container">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-800/40 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden" id="agent-hero-banner">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
              Google Data Agent API · Gemini 3.8 Flash
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Agente Inteligente de Datos Aptos
            </h2>
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl mt-1">
              Consulta transacciones, saldos, recursos Move y genera sentencias SQL para el dataset público de BigQuery <code className="text-indigo-300 bg-indigo-950/80 px-1.5 py-0.5 rounded text-xs">bigquery-public-data.crypto_aptos</code> en lenguaje natural.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700/60 p-1.5 rounded-xl self-start md:self-auto">
            <span className="text-xs text-slate-400 px-2 font-medium">Red:</span>
            {(['mainnet', 'testnet', 'devnet'] as const).map((net) => (
              <button
                key={net}
                id={`network-btn-${net}`}
                onClick={() => onNetworkChange(net)}
                className={`px-3 py-1 text-xs font-medium rounded-lg transition-all capitalize ${
                  currentNetwork === net
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {net}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Query Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm" id="agent-query-bar">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleExecuteQuery();
          }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <div className="relative flex-1">
            <input
              id="agent-prompt-input"
              type="text"
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              placeholder="Ej: ¿Cuál es el saldo y recursos de 0x1? o Genera una query BigQuery de Aptos..."
              className="w-full pl-4 pr-10 py-3 text-sm sm:text-base rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
            {promptInput && (
              <button
                type="button"
                onClick={() => setPromptInput('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs px-1.5 py-0.5"
              >
                ✕
              </button>
            )}
          </div>
          <button
            id="agent-submit-btn"
            type="submit"
            disabled={loading || !promptInput.trim()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm transition-all shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Consultando...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Preguntar al Agente</span>
              </>
            )}
          </button>
        </form>

        {/* Preset Suggestions */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-indigo-500" /> Consultas sugeridas por el Google Data Agent:
          </p>
          <div className="flex flex-wrap gap-2">
            {PRESET_QUERIES.map((preset, idx) => (
              <button
                key={idx}
                id={`preset-query-btn-${idx}`}
                onClick={() => {
                  setPromptInput(preset.prompt);
                  handleExecuteQuery(preset.prompt);
                }}
                disabled={loading}
                className="text-left text-xs px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/50 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:border-indigo-200 dark:hover:border-indigo-800 text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-1.5"
              >
                <span className="font-medium text-indigo-600 dark:text-indigo-400">[{preset.category}]</span>
                <span>{preset.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Loading Banner */}
      {loading && (
        <div className="p-6 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200/60 dark:border-indigo-900/50 flex items-center justify-center gap-3 text-indigo-900 dark:text-indigo-200 animate-pulse" id="agent-loading-state">
          <RefreshCw className="w-5 h-5 animate-spin text-indigo-600 dark:text-indigo-400" />
          <div className="text-sm font-medium">
            {activeStep || 'Google Data Agent analizando la blockchain de Aptos...'}
          </div>
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-700 dark:text-red-300 text-sm flex items-center gap-3" id="agent-error-state">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-500" />
          <span>{error}</span>
        </div>
      )}

      {/* Result Section */}
      {result && !loading && (
        <div className="space-y-6" id="agent-result-container">
          {/* Executive Summary Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Respuesta del Agente ({result.toolUsed || 'Aptos RPC & BigQuery'})
                </span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                Intent: {result.intent}
              </span>
            </div>

            <p className="text-slate-800 dark:text-slate-200 text-base leading-relaxed font-normal">
              {result.summary}
            </p>

            {/* Key Metrics Badges */}
            {result.keyMetrics && result.keyMetrics.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-6">
                {result.keyMetrics.map((metric, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex flex-col"
                  >
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate">
                      {metric.label}
                    </span>
                    <span className="text-lg font-bold text-slate-900 dark:text-white mt-0.5 truncate">
                      {metric.value}
                    </span>
                    {metric.change && (
                      <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1">
                        {metric.change}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Data Breakdown Table if provided */}
          {result.dataBreakdown && result.dataBreakdown.rows?.length > 0 && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm overflow-hidden" id="agent-data-table-card">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-500" />
                {result.dataBreakdown.title || 'Desglose de Datos'}
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                      {result.dataBreakdown.headers.map((h, i) => (
                        <th key={i} className="px-4 py-2.5 font-semibold text-slate-600 dark:text-slate-300">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {result.dataBreakdown.rows.map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
                        {row.map((cell, cIdx) => (
                          <td key={cIdx} className="px-4 py-2.5 text-slate-700 dark:text-slate-300 font-mono text-xs break-all">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* BigQuery SQL Card */}
          {result.bigQuerySql && (
            <div className="bg-slate-950 text-slate-100 border border-slate-800 rounded-2xl p-5 shadow-sm" id="agent-sql-card">
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-indigo-400" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Google BigQuery SQL · <code className="text-indigo-300">crypto_aptos</code>
                  </span>
                </div>
                <button
                  id="copy-sql-btn"
                  onClick={() => handleCopySql(result.bigQuerySql!)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 transition-all"
                >
                  {copiedSql ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copiado</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar SQL</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="text-xs font-mono bg-slate-900/90 p-3.5 rounded-xl overflow-x-auto text-emerald-300 border border-slate-800">
                {result.bigQuerySql}
              </pre>
              <p className="text-[11px] text-slate-400 mt-2">
                Tip: Esta consulta está optimizada para la partición por fechas del dataset público de Aptos en Google Cloud BigQuery.
              </p>
            </div>
          )}

          {/* Raw JSON Accordion */}
          {result.rawBlockchainData && (
            <div className="border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 overflow-hidden" id="agent-raw-json-card">
              <div className="px-5 py-3 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
                <button
                  id="toggle-raw-json-btn"
                  onClick={() => setShowRawJson(!showRawJson)}
                  className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2"
                >
                  <Code2 className="w-4 h-4 text-indigo-500" />
                  <span>{showRawJson ? 'Ocultar' : 'Ver'} Datos Crudos de Aptos Fullnode (JSON)</span>
                </button>
                {showRawJson && (
                  <button
                    onClick={() => handleCopyJson(result.rawBlockchainData)}
                    className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 inline-flex items-center gap-1"
                  >
                    {copiedJson ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    <span>Copiar</span>
                  </button>
                )}
              </div>
              {showRawJson && (
                <pre className="p-4 text-xs font-mono bg-slate-900 text-slate-200 overflow-x-auto max-h-96">
                  {JSON.stringify(result.rawBlockchainData, null, 2)}
                </pre>
              )}
            </div>
          )}

          {/* Next Suggested Queries */}
          {result.suggestedNextQueries && result.suggestedNextQueries.length > 0 && (
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800" id="agent-suggested-queries">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-2">
                Preguntas de seguimiento sugeridas:
              </span>
              <div className="flex flex-wrap gap-2">
                {result.suggestedNextQueries.map((sQuery, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setPromptInput(sQuery);
                      handleExecuteQuery(sQuery);
                    }}
                    className="text-xs px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-600 text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition-all shadow-2xs"
                  >
                    <span>{sQuery}</span>
                    <ArrowRight className="w-3 h-3 text-indigo-500" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
