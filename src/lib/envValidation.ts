/**
 * Environment Validation and Production Readiness Checker
 * Valida variables de entorno críticas y opcionales para producción.
 */

export interface EnvValidationResult {
  isProductionReady: boolean;
  environment: string;
  port: number;
  missingRequired: string[];
  warnings: string[];
  configuredServices: {
    gemini: boolean;
    aptos: boolean;
    telegram: boolean;
    metaWhatsapp: boolean;
    metaCapi: boolean;
    adsense: boolean;
    analytics: boolean;
  };
  details: {
    aptosNodeUrl: string;
    appUrl: string;
    adsensePublisherId: string;
    ga4MeasurementId: string;
  };
}

export function validateEnvironment(env: Record<string, string | undefined> = process.env): EnvValidationResult {
  const missingRequired: string[] = [];
  const warnings: string[] = [];

  const nodeEnv = env.NODE_ENV || 'development';
  const port = parseInt(env.PORT || '3000', 10);

  // 1. Critical Variables
  const geminiKey = env.GEMINI_API_KEY?.trim();
  if (!geminiKey) {
    // In dev or CI, we warn; in strict production without secrets this limits AI Agent
    if (nodeEnv === 'production') {
      missingRequired.push('GEMINI_API_KEY');
    } else {
      warnings.push('GEMINI_API_KEY no está configurada. El agente de IA responderá con diagnósticos locales.');
    }
  }

  // 2. Core Defaults
  const aptosNodeUrl = env.APTOS_NODE_URL?.trim() || 'https://fullnode.mainnet.aptoslabs.com/v1';
  const appUrl = env.APP_URL?.trim() || 'https://go.botcaza.ai';
  const adsensePublisherId = env.ADSENSE_PUBLISHER_ID?.trim() || 'pub-9493850506792206';
  const ga4MeasurementId = env.GA4_MEASUREMENT_ID?.trim() || 'G-24Q6GBQN75';

  // 3. Optional Service Checks
  const telegramToken = env.TELEGRAM_BOT_TOKEN?.trim();
  if (!telegramToken) {
    warnings.push('TELEGRAM_BOT_TOKEN no configurado: El webhook de Telegram responderá en modo informativo/simulado.');
  }

  const metaToken = env.META_ACCESS_TOKEN?.trim();
  const metaPhoneId = env.META_PHONE_NUMBER_ID?.trim();
  if (!metaToken || !metaPhoneId) {
    warnings.push('META_ACCESS_TOKEN o META_PHONE_NUMBER_ID no configurados: WhatsApp Cloud API funcionará en modo de prueba.');
  }

  const metaPixelId = env.META_PIXEL_ID?.trim();
  if (!metaPixelId) {
    warnings.push('META_PIXEL_ID no configurado: Meta CAPI operará en modo de prueba de servidor.');
  }

  const configuredServices = {
    gemini: Boolean(geminiKey && geminiKey !== 'MY_GEMINI_API_KEY'),
    aptos: Boolean(aptosNodeUrl),
    telegram: Boolean(telegramToken),
    metaWhatsapp: Boolean(metaToken && metaPhoneId),
    metaCapi: Boolean(metaPixelId && metaToken),
    adsense: Boolean(adsensePublisherId),
    analytics: Boolean(ga4MeasurementId),
  };

  const isProductionReady = missingRequired.length === 0;

  return {
    isProductionReady,
    environment: nodeEnv,
    port,
    missingRequired,
    warnings,
    configuredServices,
    details: {
      aptosNodeUrl,
      appUrl,
      adsensePublisherId,
      ga4MeasurementId,
    },
  };
}
