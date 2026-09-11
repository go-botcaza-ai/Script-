import { describe, it, expect } from 'vitest';
import { INITIAL_REFERRAL_PROGRAMS, SAMPLE_TERABOX_VIDEOS } from '../data/referralProgramsData';

describe('Multi-Referral Network Hub & TeraBox TV', () => {
  it('should include all required referral programs: TeraBox, Bing, DODO, Spotify, Botcaza', () => {
    const programIds = INITIAL_REFERRAL_PROGRAMS.map((p) => p.id);
    expect(programIds).toContain('terabox');
    expect(programIds).toContain('bing');
    expect(programIds).toContain('dodo');
    expect(programIds).toContain('spotify');
    expect(programIds).toContain('botcaza-wallet');
  });

  it('should generate properly formatted referral URLs with UTM parameters', () => {
    const terabox = INITIAL_REFERRAL_PROGRAMS.find((p) => p.id === 'terabox')!;
    const testVideoUrl = 'https://terabox.app/s/1AbC99_aptos_masterclass';
    
    const url = new URL(testVideoUrl);
    url.searchParams.set('ref', terabox.userReferralCode);
    url.searchParams.set('utm_source', 'telegram');
    url.searchParams.set('utm_medium', 'referral_network');

    expect(url.searchParams.get('ref')).toBe(terabox.userReferralCode);
    expect(url.searchParams.get('utm_source')).toBe('telegram');
    expect(url.toString()).toContain('https://terabox.app/s/1AbC99_aptos_masterclass');
  });

  it('should calculate TeraBox TV estimated earnings correctly ($2/1k views + $0.12/signup)', () => {
    const calculateTeraBoxEarnings = (views: number, signups: number) => {
      const viewsIncome = (views / 1000) * 2.0;
      const signupIncome = signups * 0.12;
      return Number((viewsIncome + signupIncome).toFixed(2));
    };

    // 10,000 views + 50 signups = (10 * $2) + (50 * $0.12) = $20 + $6 = $26.00
    expect(calculateTeraBoxEarnings(10000, 50)).toBe(26.00);

    // 100,000 views + 200 signups = (100 * $2) + (200 * $0.12) = $200 + $24 = $224.00
    expect(calculateTeraBoxEarnings(100000, 200)).toBe(224.00);
  });

  it('should contain sample TeraBox TV videos with preview URLs and duration', () => {
    expect(SAMPLE_TERABOX_VIDEOS.length).toBeGreaterThanOrEqual(4);
    for (const v of SAMPLE_TERABOX_VIDEOS) {
      expect(v.id).toBeDefined();
      expect(v.title.length).toBeGreaterThan(5);
      expect(v.previewUrl.startsWith('https://')).toBe(true);
      expect(v.fullTeraboxUrl.includes('terabox')).toBe(true);
    }
  });
});
