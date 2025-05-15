import '@dotenvx/dotenvx/config';
import { createApp, startApp } from '@larapida/shared-server-utils';
import { prisma } from './prisma';

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
    customMiddlewares(app) {
      app.use(prisma);
    },
  });

  await startApp(app);
}

main().catch((err) => {
  console.error('💥 Unhandled startup error:', err);
  process.exit(1);
});
