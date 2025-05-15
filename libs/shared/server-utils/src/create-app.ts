import express, { type Application } from 'express';
import type { CreateAppOptions } from './types';
import { mountClient } from './mount-client';
import { getDefaultMiddleware } from './get-default-middlewares';
import { createLogger } from './logger';

export async function createApp(
  options: CreateAppOptions
): Promise<Application> {
  const app = express();

  const environment = options.environment ?? 'development';
  if (!['development', 'production'].includes(environment)) {
    throw new Error(`Invalid environment: ${environment}`);
  }
  app.set('ENVIRONMENT', options.environment ?? 'development');
  app.set('NAME', options.name);
  app.set('BASE_DOMAIN', options.baseDomain ?? 'localhost');
  app.set('PORT', options.port ?? 3000);
  app.set('SECURE', options.secure ?? false);

  const HTTPS = app.get('SECURE') === true ? 'https' : 'http';
  const HOSTNAME =
    app.get('BASE_DOMAIN') === 'localhost'
      ? `${HTTPS}://localhost:${app.get('PORT')}`
      : app.get('NODE_NAME') === 'main'
      ? `${HTTPS}://${app.get('BASE_DOMAIN')}`
      : `${HTTPS}://${app.get('NODE_NAME')}.${app.get('BASE_DOMAIN')}`;
  app.set('HOSTNAME', HOSTNAME);

  // Init logger based on ENV
  const logger = createLogger(app);
  app.set('LOGGER', logger);

  app.disable('x-powered-by');

  for (const middleware of getDefaultMiddleware(app)) {
    app.use(middleware);
  }

  // Client mount
  if (options.client) {
    await mountClient(app, options.client);
  }

  return app;
}
