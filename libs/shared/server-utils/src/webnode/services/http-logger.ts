// src/webnode/services/HttpLoggerService.ts
import type { Application, RequestHandler } from 'express';
import pinoHttp, { type Options as PinoHttpOptions } from 'pino-http';
import type { Logger as PinoLogger } from 'pino';
import { WebNodeService } from './abstract-service';

export class HttpLoggerService extends WebNodeService {
  /**
   * @param app               The Express Application instance (DI container)
   * @param _httpLoggerOption  `false` to disable, `PinoHttpOptions` to customize, or `undefined` to use defaults
   */
  constructor(
    app: Application,
    private readonly _httpLoggerOption: false | PinoHttpOptions | undefined
  ) {
    super(app);
  }

  /**
   * Builds the pino‑http middleware or returns `undefined` if disabled.
   */
  private _build(): RequestHandler | undefined {
    // Explicitly disabled
    if (this._httpLoggerOption === false) return undefined;

    const defaultOpts: PinoHttpOptions = {
      logger: HttpLoggerService.isPinoLogger(this.logger)
        ? (this.logger as PinoLogger)
        : undefined,
    };

    return pinoHttp({
      ...defaultOpts,
      ...(this._httpLoggerOption ?? {}),
    });
  }

  /**
   * Attaches the HTTP logger middleware to the Express app (if any).
   * @returns The middleware that was mounted, or `undefined` if none.
   */
  public setup(): void {
    const middleware = this._build();

    if (!middleware) return;

    this.app.use(middleware);
    this.logger.info('HTTP logger middleware mounted');
  }

  /**
   * Rough runtime check for Pino logger shape.
   */
  private static isPinoLogger(x: unknown): x is PinoLogger {
    return (
      typeof x === 'object' &&
      x !== null &&
      'info' in x &&
      typeof (x as PinoLogger).info === 'function' &&
      'error' in x &&
      typeof (x as PinoLogger).error === 'function' &&
      'warn' in x &&
      typeof (x as PinoLogger).warn === 'function' &&
      'debug' in x &&
      typeof (x as PinoLogger).debug === 'function' &&
      'fatal' in x &&
      typeof (x as PinoLogger).fatal === 'function' &&
      'trace' in x &&
      typeof (x as PinoLogger).trace === 'function' &&
      'level' in x &&
      typeof (x as PinoLogger).level === 'string'
    );
  }
}
