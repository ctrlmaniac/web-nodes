import type { Application } from 'express';
import type { Server } from 'http';
import type { Logger } from 'pino';
import { logNodeInfo } from './log-node-info';

export async function startApp(app: Application): Promise<void> {
  const PORT = Number(app.get('PORT'));
  const NAME = app.get('NAME') as string;
  const logger = app.get('LOGGER') as Logger;

  try {
    const server: Server = app.listen(PORT, () => {
      logNodeInfo(app);
    });

    server.on('error', (err: NodeJS.ErrnoException) => {
      logger.error({ err }, `❌ Error starting "${NAME}" service`);
      process.exit(1);
    });

    const shutdown = () => {
      logger.info(`🛑 Shutting down "${NAME}"...`);
      server.close(() => {
        logger.info('✅ Server closed gracefully.');
        process.exit(0);
      });
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (error) {
    logger.error({ error }, `❌ Uncaught error during startup of "${NAME}"`);
    process.exit(1);
  }
}
