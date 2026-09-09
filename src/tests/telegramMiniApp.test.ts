import { describe, it, expect } from 'vitest';
import { isInsideTelegram, getTelegramUserData } from '../lib/telegramWebApp';

describe('Telegram Mini App Helpers', () => {
  it('should return false when window.Telegram is not available', () => {
    expect(isInsideTelegram()).toBe(false);
    expect(getTelegramUserData()).toBe(null);
  });

  it('should detect when running inside Telegram environment', () => {
    (global as any).window = {
      Telegram: {
        WebApp: {
          initData: 'query_id=AAHd&user=%7B%22id%22%3A123456%7D',
          initDataUnsafe: {
            user: {
              id: 123456,
              first_name: 'Botcaza',
              username: 'botcaza_user',
            },
          },
          platform: 'tdesktop',
        },
      },
    };

    expect(isInsideTelegram()).toBe(true);
    const user = getTelegramUserData();
    expect(user?.id).toBe(123456);
    expect(user?.username).toBe('botcaza_user');

    // Clean up
    delete (global as any).window;
  });
});
