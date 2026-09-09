import { Request, Response, NextFunction } from 'express';

export type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';

export interface StructuredLog {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, any>;
}

export const logger = {
  info: (message: string, context?: Record<string, any>) => log('INFO', message, context),
  warn: (message: string, context?: Record<string, any>) => log('WARN', message, context),
  error: (message: string, context?: Record<string, any>) => log('ERROR', message, context),
  debug: (message: string, context?: Record<string, any>) => log('DEBUG', message, context),
};

function log(level: LogLevel, message: string, context?: Record<string, any>) {
  const entry: StructuredLog = {
    timestamp: new Date().toISOString(),
    level,
    message,
    context,
  };
  const line = `[${entry.timestamp}] [${entry.level}] ${entry.message} ${context ? JSON.stringify(context) : ''}`;
  if (level === 'ERROR') {
    console.error(line);
  } else if (level === 'WARN') {
    console.warn(line);
  } else {
    console.log(line);
  }
}

/**
 * Basic in-memory rate limiter per IP address for API endpoints
 * Window: 60 seconds, default limit: 120 requests per minute
 */
export function createRateLimiter(windowMs: number = 60000, maxRequests: number = 120) {
  const requests = new Map<string, { count: number; resetTime: number }>();

  // Cleanup old entries every 5 minutes
  setInterval(() => {
    const now = Date.now();
    for (const [ip, record] of requests.entries()) {
      if (now > record.resetTime) {
        requests.delete(ip);
      }
    }
  }, 300000);

  return (req: Request, res: Response, next: NextFunction) => {
    const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.ip || 'unknown-ip';
    const now = Date.now();
    const record = requests.get(ip);

    if (!record || now > record.resetTime) {
      requests.set(ip, { count: 1, resetTime: now + windowMs });
      res.setHeader('X-RateLimit-Limit', maxRequests);
      res.setHeader('X-RateLimit-Remaining', maxRequests - 1);
      return next();
    }

    if (record.count >= maxRequests) {
      logger.warn('Rate limit exceeded', { ip, path: req.path });
      res.setHeader('Retry-After', Math.ceil((record.resetTime - now) / 1000));
      return res.status(429).json({
        success: false,
        error: 'Too Many Requests',
        message: 'Has excedido el límite de solicitudes por minuto. Por favor, intenta de nuevo en unos segundos.',
      });
    }

    record.count++;
    res.setHeader('X-RateLimit-Limit', maxRequests);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, maxRequests - record.count));
    next();
  };
}

/**
 * Production Security Headers Middleware
 */
export function securityHeadersMiddleware(req: Request, res: Response, next: NextFunction) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Allow Telegram Mini Apps, previews, and embedding
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  next();
}
