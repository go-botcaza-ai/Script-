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
  paymentGateway: 'stripe' | 'paypal' | 'crypto' | 'card' | 'botcaza_wallet';
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
  authProvider?: 'google' | 'microsoft' | 'facebook' | null;
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

export interface GoogleAffiliateProfile {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  publisherId: string; // e.g. pub-9493850506792206
  affiliateCode: string; // e.g. GOOG-OA-PUB-XXXXXX
  registeredAt: string;
  status: 'ACTIVE_CERTIFIED' | 'PENDING_ONBOARD';
  suiteServices: {
    googleAdSense: boolean;
    googleCloudAds: boolean;
    adsDataHub: boolean;
    topicsApiPrivacySandbox: boolean;
    aiSmartBidding: boolean;
  };
  totalRealClicks: number;
  totalRealEarningsUSD: number;
  activeCampaignTag: string;
  trackingUrl: string;
}

export interface ReferralProgram {
  id: 'terabox' | 'google-ads' | 'bing' | 'dodo' | 'spotify' | 'botcaza-wallet' | string;
  name: string;
  category: 'google_suite' | 'cloud_video' | 'search_rewards' | 'fintech_web3' | 'streaming' | 'crypto';
  categoryLabel: string;
  payoutModel: string;
  defaultReferralUrl: string;
  userReferralCode: string;
  userReferralUrl: string;
  iconName: string;
  description: string;
  features: string[];
  setupSteps: string[];
  earningsRatePerUnit: number;
  earningsUnitLabel: string;
  stats: {
    clicks: number;
    signups: number;
    shares: number;
    estimatedEarningsUSD: number;
  };
}

export interface TeraBoxVideoShareItem {
  id: string;
  title: string;
  category: 'tv_series' | 'ai_tech' | 'web3_course' | 'trading_guide';
  categoryLabel: string;
  thumbnail: string;
  duration: string;
  viewsCount: number;
  teraboxShareId: string;
  previewUrl: string;
  fullTeraboxUrl: string;
  description: string;
  estimatedEarningsPer1k: number;
}

export interface ReferralClickRecord {
  id: string;
  programId: string;
  programName: string;
  referralCode: string;
  targetUrl: string;
  platform: 'telegram' | 'whatsapp' | 'twitter' | 'web_direct' | 'other';
  timestamp: string;
  earningsGeneratedUSD: number;
}

export interface BotcoinsTradebotData {
  botUsername: string; // "Botcoins_Tradebot_Gamebot"
  botName: string; // "Botcoins Tradebot & Gamebot"
  telegramUrl: string; // "https://t.me/Botcoins_Tradebot_Gamebot"
  miniAppUrl: string; // "https://t.me/Botcoins_Tradebot_Gamebot/app"
  status: 'ONLINE' | 'STANDBY';
  botcoinsBalance: number;
  miningRatePerTap: number;
  dailyStreak: number;
  energy: number;
  maxEnergy: number;
  activeSignals: TradebotSignal[];
  gameHighScores: {
    tapSprint: number;
    aptosRunner: number;
  };
}

export interface TradebotSignal {
  id: string;
  pair: string; // e.g. "APT/USDT", "BOTCOIN/APT", "BTC/USDT"
  action: 'BUY' | 'SELL' | 'HOLD';
  entryPrice: number;
  targetPrice1: number;
  targetPrice2: number;
  stopLoss: number;
  confidence: number; // percentage, e.g. 89%
  timestamp: string;
  dex: string; // e.g. "Liquidswap", "PancakeSwap Aptos", "DODO DEX"
  aiReasoning: string;
}

