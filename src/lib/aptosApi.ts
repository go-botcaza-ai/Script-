import { AptosLedgerInfo, AptosTransaction, AptosAccountData, GoogleDataAgentResponse } from '../types';

export async function fetchLedger(network = 'mainnet'): Promise<{ data: AptosLedgerInfo }> {
  const res = await fetch(`/api/aptos/ledger?network=${network}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Failed to fetch ledger' }));
    throw new Error(err.error || 'Failed to fetch ledger');
  }
  return res.json();
}

export async function fetchTransactions(network = 'mainnet', limit = 15): Promise<{ data: AptosTransaction[] }> {
  const res = await fetch(`/api/aptos/transactions?network=${network}&limit=${limit}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Failed to fetch transactions' }));
    throw new Error(err.error || 'Failed to fetch transactions');
  }
  return res.json();
}

export async function fetchTransactionByHash(hash: string, network = 'mainnet'): Promise<{ data: AptosTransaction }> {
  const res = await fetch(`/api/aptos/transactions/by-hash/${encodeURIComponent(hash)}?network=${network}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Transaction not found' }));
    throw new Error(err.error || 'Transaction not found');
  }
  return res.json();
}

export async function fetchBlock(height: string | number, network = 'mainnet'): Promise<{ data: any }> {
  const res = await fetch(`/api/aptos/blocks/${height}?network=${network}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Block not found' }));
    throw new Error(err.error || 'Block not found');
  }
  return res.json();
}

export async function fetchAccount(address: string, network = 'mainnet'): Promise<AptosAccountData> {
  const res = await fetch(`/api/aptos/account/${encodeURIComponent(address)}?network=${network}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Account not found' }));
    throw new Error(err.error || 'Account not found');
  }
  return res.json();
}

export async function fetchGasEstimate(network = 'mainnet'): Promise<any> {
  const res = await fetch(`/api/aptos/gas-estimate?network=${network}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Gas estimate failed' }));
    throw new Error(err.error || 'Gas estimate failed');
  }
  return res.json();
}

export async function queryGoogleDataAgent(
  prompt: string,
  network = 'mainnet',
  context?: any
): Promise<{ agentResult: GoogleDataAgentResponse; liveLedger?: any }> {
  const res = await fetch('/api/aptos/agent/query', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, network, context }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Agent query failed' }));
    throw new Error(err.error || 'Google Data Agent API failed to process request');
  }
  return res.json();
}
