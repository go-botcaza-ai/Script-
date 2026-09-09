import { describe, it, expect } from 'vitest';

describe('Aptos Address & Units Specification', () => {
  it('should validate hex address formatting for Aptos', () => {
    const isValidAptosAddress = (addr: string) => {
      if (!addr.startsWith('0x')) return false;
      const cleanHex = addr.slice(2);
      return /^[0-9a-fA-F]+$/.test(cleanHex) && cleanHex.length >= 1 && cleanHex.length <= 64;
    };

    expect(isValidAptosAddress('0x1')).toBe(true);
    expect(isValidAptosAddress('0x16b08e5be26e13ab63adcd2d4ad5158223d6a6230f2f01f8fbdf13e4303d7c58')).toBe(true);
    expect(isValidAptosAddress('invalid_address')).toBe(false);
    expect(isValidAptosAddress('0xZZZZ')).toBe(false);
  });

  it('should accurately convert Octas to APT (1 APT = 100,000,000 Octas)', () => {
    const octasToApt = (octas: string | number) => {
      const num = typeof octas === 'string' ? parseFloat(octas) : octas;
      return num / 100000000;
    };

    expect(octasToApt('100000000')).toBe(1);
    expect(octasToApt('50000000')).toBe(0.5);
    expect(octasToApt('35000000000')).toBe(350);
  });

  it('should generate official Aptos Explorer URLs', () => {
    const getExplorerUrl = (txHashOrAddress: string, type: 'account' | 'txn', network = 'mainnet') => {
      return `https://explorer.aptoslabs.com/${type}/${txHashOrAddress}?network=${network}`;
    };

    const accountUrl = getExplorerUrl('0x1', 'account');
    expect(accountUrl).toBe('https://explorer.aptoslabs.com/account/0x1?network=mainnet');

    const txnUrl = getExplorerUrl('0xabc123', 'txn', 'testnet');
    expect(txnUrl).toBe('https://explorer.aptoslabs.com/txn/0xabc123?network=testnet');
  });
});
