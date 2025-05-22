import type { ApplicationLogger, ConsoleLogger, NodeEnv } from '../types';
import pino, {
  type Logger as PinoLogger,
  type LoggerOptions as PinoLoggerOptions,
} from 'pino';
import { WebNodeService } from './abstract-service';
import type { Application } from 'express';

export class LoggerService extends WebNodeService {
  /**
   * @param app The Express Application instance (DI container)
   * @param _loggerOptions logger options overrides
   */
  constructor(
    app: Application,
    private readonly _loggerOption:
      | false
      | Partial<Record<NodeEnv, PinoLoggerOptions>>
      | undefined
  ) {
    super(app);
  }

  /**
   * Creates a Pino logger or a Console-like logger
   * @returns the logger to be used in the webnode
   */
  private _build(): ApplicationLogger {
    const env = this._environment;

    if (this._loggerOption === false) {
      return {
        info: console.info,
        error: console.error,
        warn: console.warn,
        debug: console.debug,
      } as ConsoleLogger;
    }

    const pinoOptions = this._loggerOption?.[env] ?? {};

    const pinoLogger = pino(pinoOptions) as PinoLogger;

    return pinoLogger;
  }

  /**
   * Set the Logger to the Express application settings
   * @returns the bootstrapped logger
   */
  setup(): ApplicationLogger {
    const logger = this._build();

    this.setAppSetting('logger', logger);

    return logger;
  }
}
