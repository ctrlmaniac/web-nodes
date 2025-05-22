import express, { type Application } from 'express';
import type { Server } from 'http';
import compression from 'compression';
import morgan from 'morgan';
import cors from 'cors';
import type {
  ApplicationLogger,
  ConsoleLogger,
  NodeEnv,
  RouterValue,
  WebNodeOptions,
  WebNodeOptionsWithDefaults,
  WebNodeType,
} from './types';
import { createCorsOptions, normalizeOptions } from './options';
import { startServer, stopServer } from './server';
import { isPinoLogger, isRouterEntry } from './typeguards';
import { resolveRouter } from './utils';
import { pinoHttp } from 'pino-http';
import { DEFAULT_LOGGER_OPTIONS } from './config';
import pino from 'pino';

export class WebNode implements WebNodeType {
  private _options: WebNodeOptionsWithDefaults;
  private _app: Application;
  private _server?: Server;
  private _shutdownInProgress = false;
  private _logger: ApplicationLogger;

  public ready: Promise<void>;

  constructor(options: WebNodeOptions) {
    this._app = express();

    // Normalize and set options
    this._options = normalizeOptions(options) as WebNodeOptionsWithDefaults;

    // Set the environment value in express.Application settings
    this._app.set('env', this._options.environment);

    // Configure and set the application logger
    this._logger = this.configureLogger();
    this._app.set('logger', this._logger);

    // Configure the HTTP logger middleware
    this.configureHttpLogger();

    this.ready = this.bootstrap();

    // Setup graceful shutdown internally
    process.once('SIGINT', () => this.gracefulShutdown());
    process.once('SIGTERM', () => this.gracefulShutdown());
  }

  private configureLogger(): ApplicationLogger {
    const loggerOption = this.options.logger;
    let logger: ApplicationLogger;

    if (loggerOption === false) {
      // When logger is disabled, provide a ConsoleLogger that maps to console methods.
      logger = {
        info: console.info || console.log,
        error: console.error,
        warn: console.warn,
        debug: console.debug || console.log, // Fallback for debug
      } as ConsoleLogger; // Explicitly cast to ConsoleLogger
    } else {
      // Determine the environment and set Pino logger options
      const env = this.options.environment as NodeEnv;
      const pinoOptions = loggerOption?.[env] ?? DEFAULT_LOGGER_OPTIONS[env];
      logger = pino(pinoOptions);
    }

    return logger;
  }

  private configureHttpLogger(): void {
    const { app, options, logger } = this;
    const { httpLogger: httpLoggerOption } = options;

    // set http logger
    if (httpLoggerOption !== false) {
      const httpLoggerconfig =
        httpLoggerOption ??
        (isPinoLogger(logger) ? { logger: logger } : undefined);

      const httpLogger = pinoHttp(httpLoggerconfig);
      app.use(httpLogger);
    }
  }

  /** Configure Express Application settings */
  private configureExpress(): void {
    const { app, options } = this;
    const { id: webnode, port, secure, baseDomain } = options;

    // Disable header x-powered-by
    app.disable('x-powered-by');

    // Other settings
    app.set('webnode', webnode);
    app.set('port', port);
    app.set('secure', secure);
    app.set('baseDomain', baseDomain);
  }

  private configureParsers(): void {
    const { app, options } = this;
    // Setup parsers if allowed
    if (options.useParsers) {
      app.use(express.json({ limit: '1mb' }));
      app.use(express.urlencoded({ extended: true, limit: '1mb' }));
    }
  }

  private configureMiddlewares(): void {
    const { app, options, logger } = this;

    // Standard middleware
    app.use(compression());
    app.use(morgan('tiny'));
    app.use(cors(createCorsOptions(this)));

    // Setup custom middlewares
    if (options.middlewares?.length) {
      logger.info('Mounting custom middleware...');
      for (const middleware of options.middlewares) {
        app.use(middleware);
      }
    }
  }

  private mountRoutes(): void {
    const { app, options, logger } = this;

    // Funzione di montaggio diretto delle rotte
    if (options.routes) {
      logger.info('Mounting routes...');
      options.routes(app);
    }
  }

  /**
   * Mounts routers from the WebNode options. Supports both flat routers and path-based router entries.
   */
  private mountRouters(): void {
    const routers = this.options.routers;
    if (!routers?.length) return;

    for (const entry of routers) {
      let path = '/';
      let routerValue: RouterValue;

      if (isRouterEntry(entry)) {
        path = entry.path;
        routerValue = entry.router;
      } else {
        routerValue = entry as RouterValue; // plain Router or RouterLoader
      }

      const router = resolveRouter(routerValue);
      if (!router) {
        this.logger.warn(
          `Skipping router for path "${path}" because it is undefined.`
        );
        continue;
      }

      this.app.use(path, router);
      this.logger.info(`Mounted router on path "${path}"`);
    }
  }

  /** 🚀 Bootstrap phase, setup app, middleware, routes etc */
  public async bootstrap(): Promise<void> {
    const { options, logger } = this;

    this.configureExpress();
    this.configureMiddlewares();
    this.configureParsers();
    this.mountRoutes();
    this.mountRouters();

    logger.info(`WebNode "${options.id}" is configured and ready.`);
  }

  /** 🚀 Serve phase */
  public async serve(): Promise<void> {
    await this.ready; // assicura bootstrap completato
    this._server = await startServer(this);
  }

  /** 🛑 Stop phase */
  public async stop(): Promise<void> {
    if (this._shutdownInProgress) return;
    this._shutdownInProgress = true;

    if (this._server) {
      await stopServer(this);
      this._server = undefined;
    }
  }

  private async gracefulShutdown(): Promise<void> {
    if (this._shutdownInProgress) return;
    this._shutdownInProgress = true;

    this._logger.info('Received termination signal, shutting down...');
    try {
      await this.stop();
      process.exit(0);
    } catch (err) {
      this._logger.error('Error during graceful shutdown', err);
      process.exit(1);
    }
  }

  /** 🔌 Options */
  public get options(): WebNodeOptionsWithDefaults {
    return this._options;
  }

  /** 🖥️ Express app */
  public get app(): Application {
    return this._app;
  }

  /** 🖥️ Server instance */
  public get server(): Server | undefined {
    return this._server;
  }

  /** 📝 Logger */
  public get logger(): ApplicationLogger {
    return this._logger;
  }
}
