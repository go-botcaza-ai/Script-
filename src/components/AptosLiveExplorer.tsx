import React, { useState, useEffect } from 'react';
import {
  Activity,
  Box,
  Layers,
  Search,
  Wallet,
  ArrowUpRight,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Shield,
  FileCode,
  Flame,
  Zap,
  Copy,
  Check
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { AptosLedgerInfo, AptosTransaction, AptosAccountData } from '../types';
import {
  fetchLedger,
  fetchTransactions,
  fetchAccount,
  fetchGasEstimate
} from '../lib/aptosApi';

interface AptosLiveExplorerProps {
  currentNetwork: string;
  onNetworkChange: (net: string) => void;
  onAskAgentAboutAddress?: (addr: string) => void;
}

const SAMPLE_ADDRESSES = [
  { name: '0x1 · Aptos Framework', address: '0x1' },
  { name: '0x3 · Aptos Token / Registry', address: '0x3' },
  { name: '0x4 · Aptos Staking', address: '0x4' }
];

export const AptosLiveExplorer: React.FC<AptosLiveExplorerProps> = ({
  currentNetwork,
  onNetworkChange,
  onAskAgentAboutAddress
}) => {
  const [ledger, setLedger] = useState<AptosLedgerInfo | null>(null);
  const [gasData, setGasData] = useState<any>(null);
  const [transactions, setTransactions] = useState<AptosTransaction[]>([]);
  const [loadingLedger, setLoadingLedger] = useState(false);
  const [loadingTx, setLoadingTx] = useState(false);

  // Account search state
  const [searchAddress, setSearchAddress] = useState('');
  const [accountData, setAccountData] = useState<AptosAccountData | null>(null);
  const [loadingAccount, setLoadingAccount] = useState(false);
  const [accountError, setAccountError] = useState<string | null>(null);

  // Selected Transaction Modal
  const [selectedTx, setSelectedTx] = useState<AptosTransaction | null>(null);
  const [copiedHash, setCopiedHash] = useState(false);

  // Filter
  const [txFilter, setTxFilter] = useState<'all' | 'user_transaction' | 'block_metadata_transaction'>('all');

  // Load ledger & transactions
  const loadBlockchainData = async () => {
    setLoadingLedger(true);
    setLoadingTx(true);
    try {
      const [ledgerRes, txRes, gasRes] = await Promise.all([
        fetchLedger(currentNetwork),
        fetchTransactions(currentNetwork, 20),
        fetchGasEstimate(currentNetwork).catch(() => ({ data: { gas_estimate: 100 } }))
      ]);
      setLedger(ledgerRes.data);
      setTransactions(txRes.data || []);
      setGasData(gasRes.data);
    } catch (err) {
      console.error('Failed to load Aptos data:', err);
    } finally {
      setLoadingLedger(false);
      setLoadingTx(false);
    }
  };

  useEffect(() => {
    loadBlockchainData();
  }, [currentNetwork]);

  const handleSearchAccount = async (addrToSearch?: string) => {
    const target = (addrToSearch || searchAddress).trim();
    if (!target) return;
    setLoadingAccount(true);
    setAccountError(null);
    try {
      const data = await fetchAccount(target, currentNetwork);
      setAccountData(data);
    } catch (err: any) {
      setAccountError(err.message || 'No se pudo encontrar la cuenta en Aptos');
      setAccountData(null);
    } finally {
      setLoadingAccount(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const filteredTxs = transactions.filter((tx) => {
    if (txFilter === 'all') return true;
    return tx.type === txFilter;
  });

  // Prepare chart data for Gas usage of recent transactions
  const gasChartData = transactions.slice(0, 10).map((tx, idx) => ({
    name: `v.${tx.version.slice(-4)}`,
    gas: Number(tx.gas_used) || 0,
    type: tx.type === 'user_transaction' ? 'Usuario' : 'Sistema',
    success: tx.success
  }));

  return (
    <div className="space-y-6" id="aptos-live-explorer-container">
      {/* Ledger Stats Top Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="ledger-stats-grid">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              Altura de Bloque
            </span>
            <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
              {ledger ? Number(ledger.block_height).toLocaleString() : '---'}
            </div>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1 mt-1">
              <Activity className="w-3 h-3 animate-pulse" /> Nodo Activo en {currentNetwork}
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <Box className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              Versión Ledger
            </span>
            <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
              {ledger ? Number(ledger.ledger_version).toLocaleString() : '---'}
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">
              Época actual: {ledger?.epoch || '0'}
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 flex items-center justify-center text-purple-600 dark:text-purple-400">
            <Layers className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              Gas Unit Price
            </span>
            <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
              {gasData?.gas_estimate || 100} <span className="text-xs font-normal text-slate-400">Octas</span>
            </div>
            <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium flex items-center gap-1 mt-1">
              <Flame className="w-3 h-3" /> Tarifa Óptima
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <Zap className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              Chain ID
            </span>
            <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
              {ledger?.chain_id || (currentNetwork === 'mainnet' ? 1 : 2)}
            </div>
            <button
              onClick={loadBlockchainData}
              disabled={loadingLedger}
              className="text-[11px] text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 flex items-center gap-1 mt-1 font-medium"
            >
              <RefreshCw className={`w-3 h-3 ${loadingLedger ? 'animate-spin' : ''}`} />
              Actualizar datos en vivo
            </button>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <Shield className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Account Inspector Section */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm" id="account-lookup-card">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-2">
          <Wallet className="w-5 h-5 text-indigo-500" />
          Explorador de Cuentas & Recursos Move en Aptos
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          Ingresa cualquier dirección Aptos (0x...) para consultar el balance nativo de APT, número de secuencia y contratos Move asociados.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 mb-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="account-search-input"
              type="text"
              value={searchAddress}
              onChange={(e) => setSearchAddress(e.target.value)}
              placeholder="0x1 o 0x... dirección de billetera"
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button
            id="account-search-btn"
            onClick={() => handleSearchAccount()}
            disabled={loadingAccount || !searchAddress.trim()}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loadingAccount ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            <span>Buscar Cuenta</span>
          </button>
        </div>

        {/* Quick sample chips */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="text-[11px] text-slate-400">Cuentas clave del sistema:</span>
          {SAMPLE_ADDRESSES.map((sample, idx) => (
            <button
              key={idx}
              onClick={() => {
                setSearchAddress(sample.address);
                handleSearchAccount(sample.address);
              }}
              className="text-[11px] px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono transition-colors"
            >
              {sample.name}
            </button>
          ))}
        </div>

        {accountError && (
          <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-300 text-xs">
            {accountError}
          </div>
        )}

        {accountData && (
          <div className="mt-4 p-5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-4" id="account-details-panel">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-700">
              <div>
                <span className="text-xs text-slate-400 font-medium block">Dirección Aptos:</span>
                <span className="text-sm font-mono font-bold text-slate-900 dark:text-white break-all">
                  {accountData.address}
                </span>
              </div>
              {onAskAgentAboutAddress && (
                <button
                  onClick={() => onAskAgentAboutAddress(accountData.address)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium transition-all"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Analizar con Google Data Agent</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                <span className="text-xs text-slate-500 block">Saldo APT</span>
                <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                  {accountData.aptBalance.toLocaleString(undefined, { maximumFractionDigits: 4 })} APT
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  ({Number(accountData.aptBalanceOctas).toLocaleString()} Octas)
                </span>
              </div>

              <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                <span className="text-xs text-slate-500 block">Secuencia (Nonce)</span>
                <span className="text-lg font-bold text-slate-900 dark:text-white font-mono">
                  {accountData.account.sequence_number}
                </span>
              </div>

              <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                <span className="text-xs text-slate-500 block">Recursos Move Registrados</span>
                <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400 font-mono">
                  {accountData.resourcesCount}
                </span>
              </div>
            </div>

            {/* Resources list */}
            <div>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-2">
                Estructuras & Recursos Move ({accountData.resources.length}):
              </span>
              <div className="max-h-48 overflow-y-auto space-y-1.5 pr-2">
                {accountData.resources.map((res, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono flex items-center justify-between"
                  >
                    <span className="text-indigo-600 dark:text-indigo-400 truncate max-w-md">
                      {res.type}
                    </span>
                    <span className="text-slate-400 text-[10px]">Move Struct</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Gas Analytics Chart */}
      {gasChartData.length > 0 && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm" id="gas-chart-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Flame className="w-5 h-5 text-amber-500" />
                Gas Consumido en Transacciones Recientes
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Distribución de unidades de gas utilizadas por versión de transacción en Aptos.
              </p>
            </div>
          </div>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gasChartData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="name" stroke="#888888" fontSize={11} />
                <YAxis stroke="#888888" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    color: '#f8fafc',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="gas" fill="#6366f1" radius={[4, 4, 0, 0]} name="Gas Utilizado" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Recent Transactions Feed */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm" id="transactions-feed-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-500" />
              Transacciones en Vivo en Aptos
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Flujo en tiempo real extraído directamente de los nodos RPC de Aptos.
            </p>
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl self-start">
            <button
              onClick={() => setTxFilter('all')}
              className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
                txFilter === 'all'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => setTxFilter('user_transaction')}
              className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
                txFilter === 'user_transaction'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Usuarios
            </button>
            <button
              onClick={() => setTxFilter('block_metadata_transaction')}
              className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
                txFilter === 'block_metadata_transaction'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Metadatos Bloque
            </button>
          </div>
        </div>

        {loadingTx ? (
          <div className="py-12 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
            <RefreshCw className="w-6 h-6 animate-spin text-indigo-500" />
            <span className="text-xs">Cargando transacciones de la blockchain...</span>
          </div>
        ) : filteredTxs.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-sm">
            No se encontraron transacciones con el filtro seleccionado.
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800 overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="text-slate-500 font-semibold text-xs uppercase tracking-wider pb-2">
                  <th className="py-2.5 pr-4">Versión</th>
                  <th className="py-2.5 px-4">Hash</th>
                  <th className="py-2.5 px-4">Tipo</th>
                  <th className="py-2.5 px-4">Gas Usado</th>
                  <th className="py-2.5 px-4">Estado</th>
                  <th className="py-2.5 pl-4 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredTxs.map((tx) => (
                  <tr
                    key={tx.version}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3 pr-4 font-mono font-bold text-slate-900 dark:text-white">
                      #{tx.version}
                    </td>
                    <td className="py-3 px-4 font-mono text-xs text-indigo-600 dark:text-indigo-400">
                      {tx.hash ? `${tx.hash.slice(0, 10)}...${tx.hash.slice(-6)}` : '---'}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {tx.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-xs text-slate-600 dark:text-slate-300">
                      {Number(tx.gas_used).toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      {tx.success ? (
                        <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-xs font-medium">
                          <CheckCircle className="w-3.5 h-3.5" /> Éxito
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-red-600 dark:text-red-400 text-xs font-medium">
                          <XCircle className="w-3.5 h-3.5" /> Fallida
                        </span>
                      )}
                    </td>
                    <td className="py-3 pl-4 text-right">
                      <button
                        onClick={() => setSelectedTx(tx)}
                        className="px-2.5 py-1 rounded bg-slate-100 hover:bg-indigo-50 dark:bg-slate-800 dark:hover:bg-indigo-950/50 text-indigo-600 dark:text-indigo-300 text-xs font-medium transition-colors"
                      >
                        Ver Detalles
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Transaction Details Modal */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Box className="w-5 h-5 text-indigo-500" />
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  Transacción Aptos #{selectedTx.version}
                </h4>
              </div>
              <button
                onClick={() => setSelectedTx(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm">
              <div>
                <span className="text-xs text-slate-500 block mb-1">Hash de la Transacción:</span>
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 font-mono text-xs break-all">
                  <span className="text-slate-800 dark:text-slate-200">{selectedTx.hash}</span>
                  <button
                    onClick={() => copyToClipboard(selectedTx.hash)}
                    className="ml-2 text-indigo-600 hover:text-indigo-700"
                  >
                    {copiedHash ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                  <span className="text-xs text-slate-500 block">Tipo:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedTx.type}</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                  <span className="text-xs text-slate-500 block">Estado de la VM:</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">{selectedTx.vm_status}</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                  <span className="text-xs text-slate-500 block">Gas Usado:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono">
                    {Number(selectedTx.gas_used).toLocaleString()}
                  </span>
                </div>
                {selectedTx.sender && (
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                    <span className="text-xs text-slate-500 block">Remitente:</span>
                    <span className="font-mono text-xs text-indigo-600 dark:text-indigo-400 truncate block">
                      {selectedTx.sender}
                    </span>
                  </div>
                )}
              </div>

              {selectedTx.payload && (
                <div>
                  <span className="text-xs text-slate-500 block mb-1">Payload Move:</span>
                  <pre className="p-3 rounded-lg bg-slate-900 text-slate-200 text-xs font-mono overflow-x-auto max-h-44">
                    {JSON.stringify(selectedTx.payload, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedTx(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium hover:bg-slate-200 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
