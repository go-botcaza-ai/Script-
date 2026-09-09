import { describe, it, expect } from 'vitest';
import { validateEnvironment } from '../lib/envValidation';

describe('Environment Variables Validation', () => {
  it('should use default values for optional core services if not provided', () => {
    const result = validateEnvironment({
      NODE_ENV: 'development',
      PORT: '3000',
    });

    expect(result.details.aptosNodeUrl).toBe('https://fullnode.mainnet.aptoslabs.com/v1');
    expect(result.details.adsensePublisherId).toBe('pub-9493850506792206');
    expect(result.details.ga4MeasurementId).toBe('G-24Q6GBQN75');
    expect(result.details.appUrl).toBe('https://go.botcaza.ai');
  });

  it('should report missing GEMINI_API_KEY in production mode', () => {
    const result = validateEnvironment({
      NODE_ENV: 'production',
      PORT: '3000',
      GEMINI_API_KEY: '',
    });

    expect(result.isProductionReady).toBe(false);
    expect(result.missingRequired).toContain('GEMINI_API_KEY');
  });

  it('should report production ready when required keys are set', () => {
    const result = validateEnvironment({
      NODE_ENV: 'production',
      PORT: '3000',
      GEMINI_API_KEY: 'AIzaSyTestKeyValidProduction1234567890',
    });

    expect(result.isProductionReady).toBe(true);
    expect(result.missingRequired.length).toBe(0);
  });

  it('should accurately detect optional service activations', () => {
    const result = validateEnvironment({
      NODE_ENV: 'production',
      PORT: '3000',
      GEMINI_API_KEY: 'test-gemini-key',
      TELEGRAM_BOT_TOKEN: '123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11',
      META_ACCESS_TOKEN: 'EAAG...',
      META_PHONE_NUMBER_ID: '1029384756',
    });

    expect(result.configuredServices.telegram).toBe(true);
    expect(result.configuredServices.metaWhatsapp).toBe(true);
    expect(result.configuredServices.gemini).toBe(true);
  });
});
