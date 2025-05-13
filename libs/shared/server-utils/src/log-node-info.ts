import type { Application } from 'express';
import type { Logger } from 'pino';
import { getNodeInfo } from './get-node-info.js';

export function logNodeInfo(app: Application): void {
  const logger = app.get('LOGGER') as Logger;
  const { ENVIRONMENT, NAME, HOSTNAME, SECURE, PORT } = getNodeInfo(app);

  const protocol = SECURE ? 'https' : 'http';
  const isLocal = !HOSTNAME || HOSTNAME === 'localhost';
  const domain = isLocal ? `${HOSTNAME}:${PORT}` : HOSTNAME;
  const fullUrl = `${protocol}://${domain}`;

  logger.info(`🚀 ${NAME} node started`);
  logger.info(`🌐 URL: ${fullUrl}`);
  logger.info(`🔧 Mode: ${ENVIRONMENT}`);
}
