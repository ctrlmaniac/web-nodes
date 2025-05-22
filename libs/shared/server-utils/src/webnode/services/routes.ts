// src/webnode/services/RoutesMountService.ts
import type { Application } from 'express';
import type { RouteRegistrar } from '../types';
import { WebNodeService } from './abstract-service';

/**
 * Mount routes with the help of a route registrar
 * @see WebNode options
 * @example
 * ```typescript
 * new RoutesMountService(this.app, this.options.routes).setup();
 * ```
 */
export class RoutesService extends WebNodeService {
  constructor(
    app: Application,
    private readonly _routeRegistrar: RouteRegistrar | undefined
  ) {
    super(app);
  }

  /**
   * Validates and returns the RouteRegistrar callback.
   * Throws if no registrar was provided or it’s not a function.
   */
  private _build(): RouteRegistrar {
    if (!this._routeRegistrar) {
      throw new Error('No route registrar provided in configuration.');
    }
    if (typeof this._routeRegistrar !== 'function') {
      throw new Error('route registrar must be a function.');
    }
    return this._routeRegistrar;
  }

  /**
   * Mounts your “bare” routes onto the Express app.
   * Any error in the registrar will bubble up and abort startup.
   */
  public setup(): void {
    const registrar = this._build();

    registrar(this.app);
    this.logger.info('Routes mounted successfully.');
  }
}
