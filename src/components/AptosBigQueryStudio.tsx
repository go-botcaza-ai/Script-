import React, { useState } from 'react';
import {
  Database,
  Play,
  Copy,
  Check,
  Code,
  Table,
  Sparkles,
  Layers,
  ChevronDown,
  Info,
  Terminal,
  FileSpreadsheet
} from 'lucide-react';

interface AptosBigQueryStudioProps {
  onAskAgentWithSql: (sqlPrompt: string) => void;
}

interface SqlTemplate {
  name: string;
  description: string;
  table: string;
  sql: string;
  simulatedResults: {
    headers: string[];
    rows: any[][];
    executionTimeMs: number;
    bytesProcessed: string;
  };
}

const SQL_TEMPLATES: SqlTemplate[] = [
  {
    name: 'Top 10 Transacciones con Mayor Consumo de Gas',
    description: 'Encuentra las transacciones más pesadas ejecutadas en Aptos para optimizar costos de ejecución Move.',
    table: 'crypto_aptos.transactions',
    sql: `SELECT
  version,
  sender,
  gas_used,
  gas_unit_price,
  (CAST(gas_used AS INT64) * CAST(gas_unit_price AS INT64)) / 1e8 AS fee_apt,
  type,
  vm_status,
  block_timestamp
FROM
  \`bigquery-public-data.crypto_aptos.transactions\`
WHERE
  DATE(block_timestamp) >= DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY)
  AND success = TRUE
ORDER BY
  gas_used DESC
LIMIT 10;`,
    simulatedResults: {
      headers: ['version', 'sender', 'gas_used', 'fee_apt', 'type', 'vm_status'],
      rows: [
        ['198421045', '0x882fa0...9a12', '45,210', '0.0452 APT', 'user_transaction', 'Executed successfully'],
        ['198419821', '0x1c384d...410b', '38,900', '0.0389 APT', 'user_transaction', 'Executed successfully'],
        ['198418302', '0x4f128c...3319', '31,450', '0.0314 APT', 'user_transaction', 'Executed successfully'],
        ['198412910', '0x99281a...888e', '28,100', '0.0281 APT', 'user_transaction', 'Executed successfully'],
        ['198410291', '0x221890...cc42', '24,600', '0.0246 APT', 'user_transaction', 'Executed successfully']
      ],
      executionTimeMs: 420,
      bytesProcessed: '3.4 GB'
    }
  },
  {
    name: 'Tasa de Éxito y Volumen de Transacciones por Día',
    description: 'Mide la fiabilidad y salud de la red calculando el porcentaje de transacciones exitosas.',
    table: 'crypto_aptos.transactions',
    sql: `SELECT
  DATE(block_timestamp) AS date,
  COUNT(1) AS total_txs,
  COUNTIF(success = TRUE) AS successful_txs,
  COUNTIF(success = FALSE) AS failed_txs,
  ROUND(100.0 * COUNTIF(success = TRUE) / COUNT(1), 2) AS success_rate_pct,
  ROUND(AVG(gas_used), 0) AS avg_gas_used
FROM
  \`bigquery-public-data.crypto_aptos.transactions\`
WHERE
  DATE(block_timestamp) >= DATE_SUB(CURRENT_DATE(), INTERVAL 14 DAY)
GROUP BY
  date
ORDER BY
  date DESC;`,
    simulatedResults: {
      headers: ['date', 'total_txs', 'successful_txs', 'failed_txs', 'success_rate_pct', 'avg_gas_used'],
      rows: [
        ['2026-03-07', '1,428,910', '1,419,230', '9,680', '99.32%', '1,240'],
        ['2026-03-06', '1,510,240', '1,501,110', '9,130', '99.40%', '1,180'],
        ['2026-03-05', '1,380,450', '1,372,990', '7,460', '99.46%', '1,215'],
        ['2026-03-04', '1,620,180', '1,608,200', '11,980', '99.26%', '1,302']
      ],
      executionTimeMs: 650,
      bytesProcessed: '11.8 GB'
    }
  },
  {
    name: 'Transferencias Masivas de APT (Whale Watcher)',
    description: 'Rastreo de eventos CoinStore Transferencias superiores a 5,000 APT en Aptos.',
    table: 'crypto_aptos.events',
    sql: `SELECT
  version,
  sequence_number,
  type,
  JSON_VALUE(data, '$.amount') AS amount_octas,
  CAST(JSON_VALUE(data, '$.amount') AS INT64) / 1e8 AS amount_apt,
  block_timestamp
FROM
  \`bigquery-public-data.crypto_aptos.events\`
WHERE
  type LIKE '%0x1::coin::DepositEvent%'
  AND CAST(JSON_VALUE(data, '$.amount') AS INT64) >= 500000000000 -- >= 5,000 APT
  AND DATE(block_timestamp) >= DATE_SUB(CURRENT_DATE(), INTERVAL 3 DAY)
ORDER BY
  amount_apt DESC
LIMIT 5;`,
    simulatedResults: {
      headers: ['version', 'sequence_number', 'amount_apt', 'type'],
      rows: [
        ['198399120', '4910', '45,000.00 APT', '0x1::coin::DepositEvent'],
        ['198381200', '124', '28,500.00 APT', '0x1::coin::DepositEvent'],
        ['198350100', '881', '15,000.00 APT', '0x1::coin::DepositEvent'],
        ['198341900', '342', '10,000.00 APT', '0x1::coin::DepositEvent']
      ],
      executionTimeMs: 510,
      bytesProcessed: '5.2 GB'
    }
  },
  {
    name: 'Módulos Move de Smart Contracts Más Invocados',
    description: 'Descubre qué contratos inteligentes y protocolos DeFi reciben el mayor número de llamadas.',
    table: 'crypto_aptos.transactions',
    sql: `SELECT
  JSON_VALUE(payload, '$.function') AS move_function,
  COUNT(1) AS call_count,
  ROUND(AVG(gas_used), 0) AS avg_gas
FROM
  \`bigquery-public-data.crypto_aptos.transactions\`
WHERE
  type = 'user_transaction'
  AND DATE(block_timestamp) >= DATE_SUB(CURRENT_DATE(), INTERVAL 3 DAY)
GROUP BY
  move_function
HAVING
  move_function IS NOT NULL
ORDER BY
  call_count DESC
LIMIT 8;`,
    simulatedResults: {
      headers: ['move_function', 'call_count', 'avg_gas'],
      rows: [
        ['0x1::aptos_account::transfer', '429,102', '750'],
        ['0x1::coin::transfer', '210,840', '820'],
        ['0x4::stake::reactivate_stake', '54,200', '2,140'],
        ['0x3::token::create_token_script', '31,900', '4,800'],
        ['0x1::managed_coin::mint', '18,400', '1,200']
      ],
      executionTimeMs: 780,
      bytesProcessed: '8.4 GB'
    }
  }
];

export const AptosBigQueryStudio: React.FC<AptosBigQueryStudioProps> = ({
  onAskAgentWithSql
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<SqlTemplate>(SQL_TEMPLATES[0]);
  const [customSql, setCustomSql] = useState<string>(SQL_TEMPLATES[0].sql);
  const [copied, setCopied] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [queryOutput, setQueryOutput] = useState<any>(SQL_TEMPLATES[0].simulatedResults);

  const handleSelectTemplate = (tpl: SqlTemplate) => {
    setSelectedTemplate(tpl);
    setCustomSql(tpl.sql);
    setQueryOutput(tpl.simulatedResults);
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(customSql);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRunQuery = () => {
    setIsExecuting(true);
    setTimeout(() => {
      setIsExecuting(false);
      setQueryOutput(selectedTemplate.simulatedResults);
    }, 450);
  };

  return (
    <div className="space-y-6" id="aptos-bigquery-studio-container">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900">
              <Database className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Google Cloud BigQuery · Aptos Crypto Dataset
              </h2>
              <span className="text-xs font-mono text-slate-500">
                bigquery-public-data.crypto_aptos
              </span>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-3xl mt-1">
            Google Web3 indexa continuamente la blockchain de Aptos en BigQuery. Usa este estudio para ejecutar consultas SQL de alto rendimiento o pedirle al Google Data Agent que genere análisis a medida.
          </p>
        </div>

        <button
          id="ask-agent-from-sql-btn"
          onClick={() =>
            onAskAgentWithSql(
              `Optimiza y explica esta consulta SQL de BigQuery para Aptos:\n\n${customSql}`
            )
          }
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-medium transition-all shadow-sm self-start md:self-auto"
        >
          <Sparkles className="w-4 h-4" />
          <span>Consultar al Agente IA</span>
        </button>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Templates Sidebar */}
        <div className="lg:col-span-1 space-y-3">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block px-1">
            Consultas SQL Predefinidas
          </span>
          {SQL_TEMPLATES.map((tpl, i) => (
            <div
              key={i}
              onClick={() => handleSelectTemplate(tpl)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                selectedTemplate.name === tpl.name
                  ? 'bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-500 shadow-sm'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-mono text-indigo-600 dark:text-indigo-400 font-medium">
                  {tpl.table}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                  SQL
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                {tpl.name}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                {tpl.description}
              </p>
            </div>
          ))}
        </div>

        {/* SQL Editor & Results */}
        <div className="lg:col-span-2 space-y-4">
          {/* Editor Header */}
          <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-lg">
            <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-mono font-medium text-slate-300">
                  BigQuery Standard SQL Editor
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  id="copy-bigquery-sql-btn"
                  onClick={handleCopySql}
                  className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 flex items-center gap-1.5 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copiado' : 'Copiar'}</span>
                </button>
                <button
                  id="run-bigquery-sql-btn"
                  onClick={handleRunQuery}
                  disabled={isExecuting}
                  className="px-4 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{isExecuting ? 'Ejecutando...' : 'Ejecutar Query'}</span>
                </button>
              </div>
            </div>

            {/* Code text area */}
            <textarea
              id="bigquery-sql-textarea"
              value={customSql}
              onChange={(e) => setCustomSql(e.target.value)}
              rows={9}
              className="w-full bg-slate-950 text-emerald-300 font-mono text-xs sm:text-sm p-4 focus:outline-none resize-y border-none"
              spellCheck={false}
            />

            {/* Execution Meta footer */}
            <div className="px-4 py-2 bg-slate-900/60 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Partición: <code className="text-indigo-300">DATE(block_timestamp)</code></span>
              {queryOutput && (
                <span>
                  Tiempo: <b className="text-slate-200">{queryOutput.executionTimeMs}ms</b> · Bytes procesados: <b className="text-slate-200">{queryOutput.bytesProcessed}</b>
                </span>
              )}
            </div>
          </div>

          {/* Results Table */}
          {queryOutput && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Table className="w-4 h-4 text-indigo-500" />
                  Resultados de BigQuery ({queryOutput.rows.length} filas)
                </h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60">
                      {queryOutput.headers.map((head: string, idx: number) => (
                        <th key={idx} className="px-3 py-2 font-mono font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider text-[11px]">
                          {head}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {queryOutput.rows.map((row: any[], rIdx: number) => (
                      <tr key={rIdx} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                        {row.map((val: any, cIdx: number) => (
                          <td key={cIdx} className="px-3 py-2.5 font-mono text-slate-700 dark:text-slate-300 text-xs">
                            {val}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
