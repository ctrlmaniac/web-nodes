import type { Application } from 'express';
import type { CorsOptions } from 'cors';
import cors from 'cors';
import { WebNodeService } from './abstract-service';
import type { CorsOption } from '../types';

/**
 * Service to configure and apply CORS middleware to the Express application.
 */
export class CorsService extends WebNodeService {
  private _baseDomain: string;
  private _memoizedOptions: CorsOptions | false | undefined;

  /**
   * @param app The Express Application instance (DI container).
   * @param _corsOption The CORS configuration option from WebNodeOptions.
   * Can be `false` to disable CORS, a `CorsOptions` object for custom config,
   * or `undefined` to use default options based on `baseDomain`.
   */
  constructor(app: Application, private readonly _corsOption: CorsOption) {
    super(app);

    const baseDomain = app.get('baseDomain') as string | undefined;

    if (!baseDomain && this.environment !== 'development') {
      const msg =
        'Missing "baseDomain" in production environment. ' +
        'Set it in the WebNode constructor or via BASE_DOMAIN env variable. ' +
        'CORS configuration will fail without it.';
      this.logger.error(msg);
      throw new Error(msg);
    }

    this._baseDomain = this._normalizeBaseDomain(baseDomain);
  }

  /**
   * Normalizes a domain string to its base form (e.g., "example.com" from "www.example.com" or "https://sub.example.com").
   * This function extracts the main domain and top-level domain, removing any subdomains or protocols.
   */
  private _normalizeBaseDomain(baseDomain: string | undefined): string {
    if (!baseDomain) return 'localhost'; // fallback for development

    // Remove protocol (http://, https://) and optional 'www.'
    let normalized = baseDomain.replace(/^(https?:\/\/)?(www\.)?/, '');

    const parts = normalized.split('.');

    if (parts.length > 2) {
      normalized = parts.slice(-2).join('.');
    } else if (parts.length === 1 && parts[0] === 'localhost') {
      normalized = 'localhost';
    }

    return normalized;
  }

  /**
   * Builds the CORS options, either from a user-defined config or from defaults based on baseDomain.
   */
  private _buildCorsOptions(): CorsOptions | false {
    if (this._memoizedOptions !== undefined) {
      return this._memoizedOptions;
    }

    // Case 1: Explicitly disabled
    if (this._corsOption === false) {
      this._memoizedOptions = false;
      return false;
    }

    // Case 2: Custom config overrides default
    if (this._corsOption) {
      this._memoizedOptions = this._corsOption;
      return this._corsOption;
    }

    // Case 3: No config — generate default options
    const escapedBaseDomain = this._baseDomain.replace(/\./g, '\\.');
    const baseDomainPattern = new RegExp(
      `^(https?:\\/\\/)?([^.]+\\.)*${escapedBaseDomain}(:\\d+)?$`
    );

    const allowedOrigins: (string | RegExp)[] = [
      `http://${this._baseDomain}`,
      `https://${this._baseDomain}`,
      baseDomainPattern,
    ];

    if (this.environment === 'development') {
      allowedOrigins.unshift(
        'http://localhost',
        'http://127.0.0.1',
        'https://localhost',
        'https://127.0.0.1',
        /^http:\/\/localhost:\d+$/,
        /^http:\/\/127\.0\.0\.1:\d+$/,
        /^https:\/\/localhost:\d+$/,
        /^https:\/\/127\.0\.0\.1:\d+$/
      );
    }

    const options: CorsOptions = {
      origin: (
        origin: string | undefined,
        callback: (err: Error | null, allow?: boolean) => void
      ) => {
        if (
          !origin ||
          allowedOrigins.includes(origin) ||
          allowedOrigins.some(
            (entry) => entry instanceof RegExp && entry.test(origin)
          )
        ) {
          callback(null, true);
        } else {
          this.logger.warn(`CORS: Origin not allowed - ${origin}`);
          callback(new Error('Not allowed by CORS policy'));
        }
      },
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
      allowedHeaders: 'Content-Type, Authorization',
    };

    this._memoizedOptions = options;
    return options;
  }

  /**
   * Applies the CORS middleware to the Express application.
   */
  setup(): void {
    const corsOptions = this._buildCorsOptions();

    if (corsOptions === false) return;

    this.app.use(cors(corsOptions));
    this.logger.info('CORS middleware applied successfully.');
  }
}
