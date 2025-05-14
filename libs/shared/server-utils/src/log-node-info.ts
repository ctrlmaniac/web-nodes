import type { Application } from 'express';
import type { Logger } from 'pino';
import { getNodeInfo } from './get-node-info.js';

export function logNodeInfo(app: Application): void {
  const logger = app.get('LOGGER') as Logger;
  const { ENVIRONMENT, NAME, HOSTNAME } = getNodeInfo(app);

  logger.info(`🚀 ${NAME} node started`);
  logger.info(`🌐 URL: ${HOSTNAME}`);
  logger.info(`🔧 Mode: ${ENVIRONMENT}`);
}
