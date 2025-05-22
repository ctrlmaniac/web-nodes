import type { Router, Application } from 'express';
import {
  type RouterDefinition,
  type RouterLoader,
  type RouterValue,
  type RouterEntry,
} from '../types';
import { WebNodeService } from './abstract-service';

/**
 * Routers service
 * mount routers
 *
 * @example
 * ```typescript
 * await new RoutersService(this.app, this.options.routers).setup();
 * ```
 */
export class RoutersService extends WebNodeService {
  constructor(
    app: Application,
    private readonly _definitions: RouterDefinition[] | undefined
  ) {
    super(app);
  }

  /**
   * Convert each RouterDefinition into a concrete { path, router }.
   * Throws if any loader returns undefined or if the definition is malformed.
   */
  private async _build(): Promise<Array<RouterEntry>> {
    if (!this._definitions?.length) {
      return [];
    }

    const out: Array<RouterEntry> = [];

    for (const def of this._definitions) {
      let path = '/';
      let loaderOrRouter: RouterValue;

      // Distinguish between { path, router } entries vs bare routers
      if (
        def !== null &&
        typeof def === 'object' &&
        'path' in def &&
        'router' in def
      ) {
        const entry = def as RouterEntry;
        path = entry.path;
        loaderOrRouter = entry.router;
      } else {
        loaderOrRouter = def as RouterValue;
      }

      // Resolve: could be a direct Router or a (sync/async) loader
      const router =
        typeof loaderOrRouter === 'function'
          ? await this._invokeLoader(loaderOrRouter as RouterLoader)
          : loaderOrRouter;

      if (!router || typeof router.use !== 'function') {
        // Express Router has `.use` method; if missing, we consider it invalid
        throw new Error(
          `Invalid router for path "${path}": did not resolve to an Express Router`
        );
      }

      out.push({ path, router });
    }

    return out;
  }

  /**
   * Safely invoke a RouterLoader, handling both sync and async.
   */
  private async _invokeLoader(loader: RouterLoader): Promise<Router> {
    const maybe = loader();
    const result = maybe instanceof Promise ? await maybe : maybe;

    if (!result) {
      throw new Error(
        'RouterLoader returned undefined—ensure it returns a valid Express Router.'
      );
    }

    return result;
  }

  /**
   * Public API: build + mount all routers, logging each success.
   * On any build error, this will throw and prevent app startup.
   */
  public async setup(): Promise<void> {
    const routes = await this._build();

    for (const { path, router } of routes) {
      this.app.use(path, router);
      this.logger.info(`Mounted router on path "${path}"`);
    }
  }
}
