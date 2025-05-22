import type { Application, RequestHandler } from 'express';
import { WebNodeService } from './abstract-service';

export class MiddlewaresService extends WebNodeService {
  /**
   * @param app          The Express Application (DI container)
   * @param middlewares  An array of RequestHandler or zero-arg factories returning one
   */
  constructor(
    app: Application,
    private readonly _middlewares:
      | Array<RequestHandler | (() => RequestHandler)>
      | undefined
  ) {
    super(app);
  }

  /**
   * Normalize each entry into a real RequestHandler, skipping invalid ones.
   */
  private _build(): RequestHandler[] | undefined {
    const built: RequestHandler[] = [];

    // Don't build middlewares
    if (!this._middlewares || this._middlewares.length === 0) return undefined;

    for (const mw of this._middlewares) {
      // If it’s a factory (zero-arg function), invoke it
      const handler =
        typeof mw === 'function' && mw.length === 0
          ? (mw as () => RequestHandler)()
          : mw;

      if (typeof handler !== 'function') {
        const name = this._getName(mw);
        throw new Error(
          `Middleware "${name}" did not produce a valid handler.`
        );
      }

      built.push(handler);
    }

    return built;
  }

  /**
   * Mounts all configured middlewares onto the Express app.
   */
  public setup(): void {
    const handlers = this._build() || [];

    // Skip mounting middlewars
    if (handlers.length === 0) return;

    for (const fn of handlers) {
      this.app.use(fn);
      this.logger.info(`Mounted middleware: ${fn.name || 'anonymous'}`);
    }
  }

  /** Helper to name either a factory or a handler function */
  private _getName(mw: RequestHandler | (() => RequestHandler)): string {
    // Factory?
    if (typeof mw === 'function' && mw.length === 0) {
      const inner = (mw as () => RequestHandler)();
      return inner?.name || mw.name || 'anonymous';
    }
    // Plain handler
    return (mw as RequestHandler).name || 'anonymous';
  }
}
