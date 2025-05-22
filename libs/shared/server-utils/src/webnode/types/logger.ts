import type { Logger as PinoLogger } from 'pino';

export type ConsoleLogger = Pick<Console, 'info' | 'error' | 'warn' | 'debug'>;
export type ApplicationLogger = ConsoleLogger | PinoLogger;
