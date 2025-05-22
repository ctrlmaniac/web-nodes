// src/webnode/services/ParserSetupService.ts
import express, { type RequestHandler, type Application } from 'express';
import { WebNodeService } from './abstract-service';

interface BodyParserOptions {
  jsonLimit: string;
  urlEncodedLimit: string;
  extended: boolean;
}

export class BodyParserService extends WebNodeService {
  private readonly _opts: false | Partial<BodyParserOptions> | undefined;

  /**
   * @param app  The Express application (DI container)
   * @param bodyParsers  Either `false` (disable) or an options object
   */
  constructor(
    app: Application,
    bodyParsers: false | Partial<BodyParserOptions> | undefined
  ) {
    super(app);
    this._opts = bodyParsers;
  }

  /** Build the parser middleware; throws if config is invalid */
  private _build(): RequestHandler[] | undefined {
    // Disable body parsers
    if (this._opts === false) return undefined;

    const jsonMw = express.json({ limit: this._opts?.jsonLimit ?? '100kb' });
    const urlMw = express.urlencoded({
      limit: this._opts?.urlEncodedLimit ?? '100kb',
      extended: this._opts?.extended ?? true,
    });

    if (typeof jsonMw !== 'function' || typeof urlMw !== 'function') {
      throw new Error('Failed to create body parser middleware.');
    }

    return [jsonMw, urlMw];
  }

  /** Mounts the JSON + URL‑encoded body parsers (or throws if disabled) */
  public setup(): void {
    const handlers = this._build();

    if (!handlers) return;

    handlers.forEach((fn) => this.app.use(fn));
    this.logger.info('Body parsers configured');
  }
}
