import '@dotenvx/dotenvx/config';
import { createApp, startApp } from '@larapida/shared-server-utils';
import { prisma } from './prisma';
import { httpErrorHandler } from '@larapida/api-service-utils';
import { endpoints } from '@larapida/api-service-endpoints';

async function main() {
  const app = await createApp({
    name: 'api',
    environment:
      (process.env.NODE_ENV as 'development' | 'production' | undefined) ||
      'development',
    baseDomain: process.env.BASE_DOMAIN,
    secure:
      process.env.SECURE !== undefined
        ? process.env.SECURE === 'true'
        : process.env.NODE_ENV === 'production',
    port: Number(process.env.PORT) || 3100,
    middlewares: [prisma],
    errorHandlers: [httpErrorHandler],
    routers: [endpoints],
  });

  await startApp(app);
}

main().catch((err) => {
  console.error('💥 Errore di avvio non gestito:', err);
  process.exit(1);
});
