import { ReferralProgram, TeraBoxVideoShareItem } from '../types';

export const INITIAL_REFERRAL_PROGRAMS: ReferralProgram[] = [
  {
    id: 'terabox',
    name: 'TeraBox TV & Video Cloud',
    category: 'cloud_video',
    categoryLabel: 'Video & Almacenamiento',
    payoutModel: '$1.30 – $3.00 USD por cada 1,000 reproducciones + $0.12 USD por nuevo registro',
    defaultReferralUrl: 'https://www.terabox.com/webmaster',
    userReferralCode: 'TERABOX_BOTCAZA_VIP',
    userReferralUrl: 'https://terabox.app/s/1botcaza_vip_tv',
    iconName: 'Tv',
    description: 'Monetiza compartiendo videos de la nueva sección TeraBox TV, películas, cursos y archivos pesados con el programa oficial TeraBox Webmaster.',
    features: [
      'Gana dinero por cada 1,000 reproducciones de videos compartidos.',
      'Bono de hasta $0.12 USD por cada usuario que instale la app con tu enlace.',
      '1,024 GB (1 TB) de almacenamiento gratis en la nube para subir tus videos.',
      'Retiros automáticos vía PayPal, Payoneer o Transferencia Bancaria.'
    ],
    setupSteps: [
      'Regístrate gratis en el portal oficial TeraBox Webmaster Center.',
      'Copia tu código o link de referido desde tu panel de TeraBox.',
      'Pega tu código abajo; todos los videos de TeraBox TV se compartirán con tu atribución.'
    ],
    earningsRatePerUnit: 0.002, // $2 por cada 1k views = $0.002 por click/view
    earningsUnitLabel: 'USD por vista/clic',
    stats: {
      clicks: 1420,
      signups: 84,
      shares: 156,
      estimatedEarningsUSD: 18.24
    }
  },
  {
    id: 'bing',
    name: 'Microsoft Bing Rewards & Copilot',
    category: 'search_rewards',
    categoryLabel: 'Búsquedas & Puntos',
    payoutModel: 'Puntos canjeables por tarjetas de regalo (Amazon, Xbox, Spotify) y compras',
    defaultReferralUrl: 'https://rewards.bing.com/',
    userReferralCode: 'MS_REWARDS_NEURAFORGE',
    userReferralUrl: 'https://rewards.bing.com/refer?ref=neuraforge_ai',
    iconName: 'Search',
    description: 'Acumula puntos por cada usuario que realice búsquedas patrocinadas en Bing y use Microsoft Copilot con tu enlace de referidos.',
    features: [
      'Gana hasta 500 puntos Microsoft Rewards por cada amigo activo invitado.',
      'Canje directo por tarjetas de regalo digitales de Amazon, Spotify y Steam.',
      'Búsquedas potenciadas con inteligencia artificial de OpenAI / GPT.',
      'Indexación prioritaria en Bing Webmaster Tools para tus sitios web.'
    ],
    setupSteps: [
      'Inicia sesión con tu cuenta de Microsoft en rewards.bing.com.',
      'Entra a la sección "Recomendar a un amigo" y copia tu enlace.',
      'Configura tu código aquí para generar búsquedas patrocinadas con tu enlace.'
    ],
    earningsRatePerUnit: 0.005, // Equivalente estimado en USD por punto
    earningsUnitLabel: 'USD equiv. por búsqueda',
    stats: {
      clicks: 860,
      signups: 39,
      shares: 92,
      estimatedEarningsUSD: 12.80
    }
  },
  {
    id: 'dodo',
    name: 'DODO DEX & Dodo Payments',
    category: 'fintech_web3',
    categoryLabel: 'Fintech & Web3 DEX',
    payoutModel: 'Comisiones directas del 10% al 20% en tarifas de swap y procesamiento de pagos',
    defaultReferralUrl: 'https://dodoex.io/',
    userReferralCode: 'DODO_WEB3_BOTCAZA',
    userReferralUrl: 'https://dodoex.io/swap?r=botcaza_ai',
    iconName: 'Zap',
    description: 'Protocolo descentralizado de intercambio y pasarela de pagos Web3. Recibe comisiones automáticas en criptomonedas por cada swap.',
    features: [
      '10% - 20% de comisión continua sobre todas las tarifas de transacción de tus referidos.',
      'Soporte multi-cadena: Aptos, Ethereum, Polygon, Arbitrum y BNB Chain.',
      'Liquidación instantánea a tu billetera Web3 (no requiere KYC bancario).',
      'Integración con pasarelas de pago Web3 y comercio electrónico.'
    ],
    setupSteps: [
      'Conecta tu wallet (Petra, Pontem, MetaMask) en DODO DEX.',
      'Entra al panel de "Referral Program" y crea tu enlace de afiliado.',
      'Guárdalo aquí para monetizar cada intercambio o pasarela de cobro.'
    ],
    earningsRatePerUnit: 0.05,
    earningsUnitLabel: 'USD promedio por swap',
    stats: {
      clicks: 530,
      signups: 22,
      shares: 64,
      estimatedEarningsUSD: 24.50
    }
  },
  {
    id: 'spotify',
    name: 'Spotify for Podcasters & Music',
    category: 'streaming',
    categoryLabel: 'Audio & Streaming',
    payoutModel: 'Suscripciones de creador, patrocinios automatizados y regalías por streaming',
    defaultReferralUrl: 'https://podcasters.spotify.com/',
    userReferralCode: 'SPOTIFY_NEURAFORGE_POD',
    userReferralUrl: 'https://open.spotify.com/show/botcaza_onchain_ai',
    iconName: 'Music',
    description: 'Monetiza tu audiencia de audio distribuyendo podcasts de análisis cripto, tutoriales y playlists curadas con atribución de creador.',
    features: [
      'Gana ingresos por cada suscriptor a tus podcasts exclusivos de análisis on-chain.',
      'Inserción automática de anuncios dinámicos con ingresos en dólares.',
      'Compartir episodios y playlists con seguimiento de reproducciones.',
      'Acceso al programa de Afiliados de Spotify Premium en regiones admitidas.'
    ],
    setupSteps: [
      'Accede a podcasters.spotify.com con tu cuenta de Spotify.',
      'Copia el enlace público de tu podcast o tu código de creador.',
      'Pégalo abajo para generar enlaces con atribución directa.'
    ],
    earningsRatePerUnit: 0.015,
    earningsUnitLabel: 'USD por reproducción monetizada',
    stats: {
      clicks: 940,
      signups: 45,
      shares: 110,
      estimatedEarningsUSD: 16.40
    }
  },
  {
    id: 'botcaza-wallet',
    name: 'Botcaza Aptos Wallet Referral',
    category: 'crypto',
    categoryLabel: 'Blockchain & Pay-Per-View',
    payoutModel: '10% de comisión directa en APT por cada compra de análisis o desbloqueo Pay-Per-View',
    defaultReferralUrl: 'https://go.botcaza.ai/?ref=botcaza',
    userReferralCode: 'BOTCAZA_APTOS_MOVE',
    userReferralUrl: 'https://go.botcaza.ai/?tab=wallet-gateway&ref=botcaza_official',
    iconName: 'Wallet',
    description: 'Programa nativo de Neuraforge & Botcaza. Invita a traders y analistas a usar la pasarela on-chain de Aptos y recibe recompensas en APT.',
    features: [
      '10% de cada compra en Pay-Per-View depositado directamente en tu wallet.',
      'Registro en Firestore en tiempo real con confirmación on-chain en Aptos.',
      'Totalmente compatible con la Telegram Mini App y Botcaza Wallet.',
      'Sin monto mínimo de retiro; liquidación inmediata.'
    ],
    setupSteps: [
      'Copia tu dirección de Aptos o código de usuario de Botcaza Wallet.',
      'Compártelo con tu enlace personalizado generado en esta plataforma.',
      'Monitorea tus ingresos en tiempo real en la pestaña de transacciones.'
    ],
    earningsRatePerUnit: 0.25,
    earningsUnitLabel: 'USD equiv. en APT por desbloqueo',
    stats: {
      clicks: 1680,
      signups: 112,
      shares: 240,
      estimatedEarningsUSD: 42.00
    }
  }
];

export const SAMPLE_TERABOX_VIDEOS: TeraBoxVideoShareItem[] = [
  {
    id: 'tb-vid-1',
    title: 'Aptos Move Blockchain: Arquitectura y Smart Contracts desde Cero',
    category: 'web3_course',
    categoryLabel: 'Masterclass Web3',
    thumbnail: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&auto=format&fit=crop&q=80',
    duration: '42:15 min',
    viewsCount: 14280,
    teraboxShareId: '1AbC99_aptos_masterclass',
    previewUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    fullTeraboxUrl: 'https://terabox.app/s/1AbC99_aptos_masterclass',
    description: 'Curso completo explicando el modelo de recursos del lenguaje Move, cómo compilar contratos en Aptos y auditorías de seguridad.',
    estimatedEarningsPer1k: 2.20
  },
  {
    id: 'tb-vid-2',
    title: 'Neuraforge AI: Análisis On-Chain de Ballenas con Google BigQuery',
    category: 'ai_tech',
    categoryLabel: 'Tecnología & IA',
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
    duration: '28:40 min',
    viewsCount: 9850,
    teraboxShareId: '1XyZ88_bigquery_ai_whales',
    previewUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    fullTeraboxUrl: 'https://terabox.app/s/1XyZ88_bigquery_ai_whales',
    description: 'Demostración paso a paso conectando el dataset público de Aptos en BigQuery con Gemini AI para detectar movimientos millonarios.',
    estimatedEarningsPer1k: 2.50
  },
  {
    id: 'tb-vid-3',
    title: 'TeraBox TV Series: El Futuro del Trading Descentralizado y DeFi',
    category: 'tv_series',
    categoryLabel: 'TeraBox TV Series',
    thumbnail: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=600&auto=format&fit=crop&q=80',
    duration: '35:10 min',
    viewsCount: 22400,
    teraboxShareId: '1TbTvSeries_defi_future_ep1',
    previewUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    fullTeraboxUrl: 'https://terabox.app/s/1TbTvSeries_defi_future_ep1',
    description: 'Episodio 1 de la serie documental de TeraBox TV cubriendo la evolución de las finanzas descentralizadas, AMMs y liquidez.',
    estimatedEarningsPer1k: 1.80
  },
  {
    id: 'tb-vid-4',
    title: 'Guía de Arbitraje Cripto & Bots con DODO DEX y Liquidación Rápida',
    category: 'trading_guide',
    categoryLabel: 'Estrategia Trading',
    thumbnail: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&auto=format&fit=crop&q=80',
    duration: '19:50 min',
    viewsCount: 7600,
    teraboxShareId: '1ArbTrade_dodo_botcaza',
    previewUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    fullTeraboxUrl: 'https://terabox.app/s/1ArbTrade_dodo_botcaza',
    description: 'Metodología para identificar discrepancias de precios en pools de liquidez y ejecutar operaciones con slippage mínimo.',
    estimatedEarningsPer1k: 2.10
  }
];
