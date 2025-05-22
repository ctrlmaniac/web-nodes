import type { Logger } from 'pino';

export function isPinoLogger(logger: unknown): logger is Logger {
  return (
    typeof logger === 'object' &&
    logger !== null &&
    typeof (logger as Logger).info === 'function' &&
    typeof (logger as Logger).error === 'function' &&
    typeof (logger as Logger).debug === 'function' &&
    typeof (logger as Logger).warn === 'function' &&
    typeof (logger as Logger).fatal === 'function' && // specifica di pino
    typeof (logger as Logger).trace === 'function' &&
    typeof (logger as Logger).level === 'string'
  );
}
