import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore';
import { firebaseConfig } from './firebaseConfig';

// Initialize Firebase App and Firestore
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app);

export interface BotcazaWalletRecord {
  id?: string;
  address: string;
  ownerEmail: string;
  balanceAPT: number;
  balanceUSD: number;
  lastSyncedAt: any;
  network: string;
  repositoryRef: string;
}

export interface GatewayPaymentTransaction {
  id?: string;
  txHash: string;
  itemTitle: string;
  itemId: string;
  amountUSD: number;
  amountAPT: number;
  buyerEmail: string;
  buyerAddress?: string;
  paymentMethod: 'botcaza_wallet' | 'aptos_onchain' | 'stripe' | 'paypal';
  status: 'CONFIRMED' | 'PENDING' | 'FAILED';
  accessKey: string;
  accessDuration: string;
  timestamp: any;
  explorerUrl?: string;
}

/**
 * Consulta el saldo real en la blockchain de Aptos Mainnet mediante nuestro endpoint fullnode
 */
export async function getRealAptosWalletBalance(address: string, network = 'mainnet'): Promise<{
  success: boolean;
  address: string;
  aptBalance: number;
  aptBalanceOctas: string;
  sequenceNumber: string;
  authenticationKey: string;
  resourcesCount: number;
  error?: string;
}> {
  try {
    const cleanAddr = address.trim();
    const res = await fetch(`/api/aptos/account/${encodeURIComponent(cleanAddr)}?network=${network}`);
    const data = await res.json();

    if (!res.ok || !data.success) {
      return {
        success: false,
        address: cleanAddr,
        aptBalance: 0,
        aptBalanceOctas: '0',
        sequenceNumber: '0',
        authenticationKey: '',
        resourcesCount: 0,
        error: data.error || 'No se encontró la cuenta en Aptos Mainnet',
      };
    }

    return {
      success: true,
      address: cleanAddr,
      aptBalance: data.aptBalance || 0,
      aptBalanceOctas: data.aptBalanceOctas || '0',
      sequenceNumber: data.account?.sequence_number || '0',
      authenticationKey: data.account?.authentication_key || '',
      resourcesCount: data.resourcesCount || 0,
    };
  } catch (err: any) {
    return {
      success: false,
      address,
      aptBalance: 0,
      aptBalanceOctas: '0',
      sequenceNumber: '0',
      authenticationKey: '',
      resourcesCount: 0,
      error: err.message || 'Error de red al consultar el nodo de Aptos',
    };
  }
}

/**
 * Registra o sincroniza una wallet en la colección 'wallets' de Firestore
 */
export async function syncWalletToFirestore(walletData: {
  address: string;
  ownerEmail: string;
  balanceAPT: number;
  network?: string;
}): Promise<void> {
  try {
    const walletDocId = walletData.ownerEmail.replace(/[^a-zA-Z0-9]/g, '_');
    const walletRef = doc(db, 'wallets', walletDocId);

    await setDoc(
      walletRef,
      {
        address: walletData.address,
        ownerEmail: walletData.ownerEmail,
        balanceAPT: walletData.balanceAPT,
        balanceUSD: Number((walletData.balanceAPT * 9.5).toFixed(2)), // Approx conversion
        lastSyncedAt: serverTimestamp(),
        network: walletData.network || 'mainnet',
        repositoryRef: 'https://github.com/go-botcaza-ai/Wallet-coins-trade-exchange-money',
      },
      { merge: true }
    );
  } catch (err) {
    console.warn('[Firestore] Error sincronizando wallet:', err);
  }
}

/**
 * Guarda una transacción real en Firestore en la colección 'transactions'
 */
export async function recordGatewayPaymentInFirestore(
  payment: Omit<GatewayPaymentTransaction, 'id' | 'timestamp'>
): Promise<string> {
  try {
    const txId = 'TX-' + Math.random().toString(36).substring(2, 9).toUpperCase() + '-' + Date.now().toString(36).toUpperCase();
    const txRef = doc(db, 'transactions', txId);

    const fullRecord = {
      ...payment,
      id: txId,
      timestamp: serverTimestamp(),
      createdAtIso: new Date().toISOString(),
      repository: 'https://github.com/go-botcaza-ai/Wallet-coins-trade-exchange-money',
    };

    await setDoc(txRef, fullRecord);

    // Also record in 'purchases' collection for immediate token verification
    const purchaseRef = doc(db, 'purchases', payment.accessKey);
    await setDoc(purchaseRef, {
      accessKey: payment.accessKey,
      itemId: payment.itemId,
      itemTitle: payment.itemTitle,
      buyerEmail: payment.buyerEmail,
      amountUSD: payment.amountUSD,
      status: 'ACTIVE',
      createdAtIso: new Date().toISOString(),
    });

    return txId;
  } catch (err) {
    console.warn('[Firestore] Error grabando transacción en Firestore:', err);
    return 'LOCAL-' + Date.now();
  }
}

/**
 * Obtiene transacciones recientes de la pasarela desde Firestore
 */
export async function getRecentGatewayTransactions(limitCount = 10): Promise<GatewayPaymentTransaction[]> {
  try {
    const q = query(collection(db, 'transactions'), orderBy('timestamp', 'desc'), limit(limitCount));
    const querySnapshot = await getDocs(q);

    const list: GatewayPaymentTransaction[] = [];
    querySnapshot.forEach((docSnap) => {
      list.push(docSnap.data() as GatewayPaymentTransaction);
    });

    return list;
  } catch (err) {
    console.warn('[Firestore] Transacciones fallback locales:', err);
    return [];
  }
}
