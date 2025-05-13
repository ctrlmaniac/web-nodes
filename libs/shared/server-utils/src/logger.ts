import type { Logger } from 'pino';
import pino from 'pino';
import type { Application } from 'express';

export function createLogger(app: Application): Logger {
  const env = app.get('ENVIRONMENT');

  return pino({
    transport:
      env !== 'production'
        ? {
            target: 'pino-pretty',
            options: { colorize: true },
          }
        : undefined,
  });
}
