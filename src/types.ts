export interface ContentItem {
  id: string;
  title: string;
  description: string;
  category: 'video' | 'course' | 'event' | 'masterclass' | 'podcast';
  categoryLabel: string;
  price: number;
  duration: string;
  rating: number;
  reviewsCount: number;
  instructor: {
    name: string;
    role: string;
    avatar: string;
  };
  thumbnail: string;
  previewVideoUrl: string; // trailer/preview
  fullVideoUrl: string; // protected stream
  fullVideoType: 'youtube' | 'mp4';
  features: string[];
  accessDuration: string; // e.g., 'Acceso ilimitado', 'Acceso por 48 horas'
  releaseYear: string;
  resolution: string;
  tags: string[];
  isFeatured?: boolean;
}

export interface PurchaseRecord {
  id: string;
  contentId: string;
  contentTitle: string;
  amount: number;
  currency: string;
  paymentGateway: 'stripe' | 'paypal' | 'crypto' | 'card';
  buyerEmail: string;
  buyerName: string;
  purchaseDate: string;
  accessKey: string;
  status: 'completed' | 'pending';
  receiptSentViaGmail: boolean;
  gmailMessageId?: string;
}

export interface AccessTokenState {
  userEmail: string | null;
  userName: string | null;
  userPhoto: string | null;
  accessToken: string | null;
  isAuthenticated: boolean;
}

export interface AdminStats {
  totalRevenue: number;
  totalPurchases: number;
  totalViews: number;
  activePayPerViewItems: number;
}

export interface AptosLedgerInfo {
  chain_id: number;
  epoch: string;
  ledger_version: string;
  oldest_ledger_version: string;
  ledger_timestamp: string;
  node_role: string;
  oldest_block_height: string;
  block_height: string;
  git_hash?: string;
}

export interface AptosTransaction {
  version: string;
  hash: string;
  gas_used: string;
  success: boolean;
  vm_status: string;
  sender?: string;
  sequence_number?: string;
  max_gas_amount?: string;
  gas_unit_price?: string;
  expiration_timestamp_secs?: string;
  payload?: any;
  type: string;
  timestamp?: string;
}

export interface AptosAccountData {
  address: string;
  account: {
    sequence_number: string;
    authentication_key: string;
  };
  aptBalanceOctas: string;
  aptBalance: number;
  resourcesCount: number;
  resources: Array<{
    type: string;
    data: any;
  }>;
}

export interface GoogleDataAgentResponse {
  summary: string;
  intent: string;
  toolUsed: string;
  keyMetrics?: Array<{
    label: string;
    value: string;
    change?: string;
    isGood?: boolean;
  }>;
  bigQuerySql?: string;
  dataBreakdown?: {
    title: string;
    headers: string[];
    rows: string[][];
  };
  rawBlockchainData?: any;
  suggestedNextQueries?: string[];
}

