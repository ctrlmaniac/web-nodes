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
  app.set('HOSTNAME', options.hostname ?? 'localhost');
  app.set('SECURE', options.secure ?? false);
  app.set('PORT', options.port ?? 3000);

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
