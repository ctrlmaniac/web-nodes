import type { Application } from 'express';
import type { NodeEnv, ApplicationLogger } from '../types';

export abstract class WebNodeService {
  protected _app: Application;
  protected _environment: NodeEnv;
  protected _logger: ApplicationLogger;

  /**
   * The constructor for the base WebNodeService.
   * It takes the application's DI container ('app') as an argument,
   * and uses it to resolve common dependencies like environment and logger.
   *
   * @param app The instance of the WebNode application (which serves as the DI container).
   * @param options WebNode options
   */
  constructor(app: Application) {
    this._app = app;

    // Resolve environment: if 'env' is not found, default to 'development'
    this._environment = (this.app.get('env') as NodeEnv) ?? 'development';

    // Resolve logger
    this._logger = this.app.get('logger') as ApplicationLogger;
  }

  /** 🖥️ Express app */
  protected get app(): Application {
    return this._app;
  }

  /** Environment */
  protected get environment(): NodeEnv {
    return this._environment;
  }

  /** 📝 Logger */
  protected get logger(): ApplicationLogger {
    return this._logger;
  }

  /** Helper to set Express Application settings */
  protected setAppSetting<K extends string, V>(key: K, value: V): void {
    this._app.set(key, value);
  }
}
