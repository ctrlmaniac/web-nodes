import '@dotenvx/dotenvx/config';
import { createApp, startApp } from '@larapida/shared-server-utils';

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
  });

  await startApp(app);
}

main().catch((err) => {
  console.error('💥 Unhandled startup error:', err);
  process.exit(1);
});
