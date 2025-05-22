import express, { type Application } from 'express';
import type { Server } from 'http';
import { AbstractWebNode } from './abstract-webnode';
import {
  LoggerService,
  HttpLoggerService,
  CorsService,
  CompressionService,
  BodyParserService,
  MiddlewaresService,
  RoutesService,
  RoutersService,
} from './services';
import type { ApplicationLogger, WebNodeOptions } from './types';

export class WebNode extends AbstractWebNode {
  private _app: Application;
  private _server?: Server;
  private _shutdownInProgress = false;

  private _logger: ApplicationLogger;

  private _compressionService: CompressionService;
  private _corsService: CorsService;
  private _bodyParserService: BodyParserService;
  private _httpLoggerService: HttpLoggerService;
  private _middlewaresService: MiddlewaresService;
  private _routesService: RoutesService;
  private _routersService: RoutersService;

  public ready: Promise<void>;

  constructor(options: WebNodeOptions) {
    super(options);

    this._app = express();

    // Set Express application settings
    this._app.set('env', this.options.environment);
    this._app.set('webnode', this.options.id);
    this._app.set('port', this.options.port);
    this._app.set('secure', this.options.secure);
    this._app.set('baseDomain', this.options.baseDomain);

    // Initialize services with options
    this._logger = new LoggerService(this._app, this.options.logger).setup();

    // Configure graceful shutdown on signals
    process.once('SIGINT', () => this.gracefulShutdown());
    process.once('SIGTERM', () => this.gracefulShutdown());

    // Kick off the async bootstrap process on construction
    this.ready = this.bootstrap();

    // Services
    this._compressionService = new CompressionService(
      this._app,
      this.options.compression
    );
    this._corsService = new CorsService(this._app, this.options.cors);
    this._bodyParserService = new BodyParserService(
      this.app,
      this.options.bodyParser
    );
    this._httpLoggerService = new HttpLoggerService(
      this._app,
      this.options.httpLogger
    );
    this._middlewaresService = new MiddlewaresService(
      this._app,
      this.options.middlewares
    );
    this._routesService = new RoutesService(this._app, this.options.routes);
    this._routersService = new RoutersService(this._app, this.options.routers);
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

  /** Setup middleware, routes, routers */
  public async bootstrap(): Promise<void> {
    const { options, logger } = this;

    // Setip standard middlewares
    this._compressionService.setup();
    this._corsService.setup();
    this._bodyParserService.setup();

    // Setup http logger
    this._httpLoggerService.setup();

    // Setup custom middlewares if any
    this._middlewaresService.setup();

    // Setup bare routes if any
    this._routesService.setup();

    // Setup routers if any
    this._routersService.setup();

    logger.info(`WebNode "${options.id}" bootstrapped successfully.`);
  }

  /** Start the HTTP server */
  public async serve(): Promise<void> {
    await this.ready;

    const port = this._options.port ?? 3000;
    this._server = await startServer(this);

    this.logger.info(
      `🚀 WebNode "${this._options.id}" listening on port ${port}`
    );
  }

  /** Stop the HTTP server */
  public async stop(): Promise<void> {
    if (this._shutdownInProgress) return;
    this._shutdownInProgress = true;

    if (this._server) {
      await stopServer(this);
      this._server = undefined;
      this.logger.info(`🛑 WebNode "${this._options.id}" stopped`);
    }
  }

  /** Graceful shutdown handler */
  private async gracefulShutdown(): Promise<void> {
    if (this._shutdownInProgress) return;
    this._shutdownInProgress = true;

    this.logger.info('Received termination signal, shutting down...');
    try {
      await this.stop();
      process.exit(0);
    } catch (err) {
      this.logger.error('Error during graceful shutdown', err);
      process.exit(1);
    }
  }
}
