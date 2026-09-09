import { describe, it, expect, vi } from 'vitest';
import { createRateLimiter, securityHeadersMiddleware } from '../lib/serverSecurity';

describe('Server Security & Middleware', () => {
  it('should set security and CORS headers', () => {
    const req: any = { method: 'GET' };
    const headers: Record<string, string> = {};
    const res: any = {
      setHeader: (key: string, value: string) => {
        headers[key] = value;
      },
      sendStatus: vi.fn(),
    };
    const next = vi.fn();

    securityHeadersMiddleware(req, res, next);

    expect(headers['X-Content-Type-Options']).toBe('nosniff');
    expect(headers['X-XSS-Protection']).toBe('1; mode=block');
    expect(headers['Access-Control-Allow-Origin']).toBe('*');
    expect(next).toHaveBeenCalled();
  });

  it('should enforce rate limits on excessive requests', () => {
    const limiter = createRateLimiter(60000, 2); // 2 requests per minute limit
    const req: any = { ip: '127.0.0.1', headers: {}, path: '/api/test' };
    const headers: Record<string, any> = {};
    let statusCode = 200;
    let jsonBody: any = null;

    const res: any = {
      setHeader: (key: string, val: any) => {
        headers[key] = val;
      },
      status: (code: number) => {
        statusCode = code;
        return {
          json: (b: any) => {
            jsonBody = b;
          },
        };
      },
    };

    const next = vi.fn();

    // 1st request -> Allowed
    limiter(req, res, next);
    expect(next).toHaveBeenCalledTimes(1);

    // 2nd request -> Allowed
    limiter(req, res, next);
    expect(next).toHaveBeenCalledTimes(2);

    // 3rd request -> Rate limited (429)
    limiter(req, res, next);
    expect(statusCode).toBe(429);
    expect(jsonBody?.error).toBe('Too Many Requests');
  });
});
