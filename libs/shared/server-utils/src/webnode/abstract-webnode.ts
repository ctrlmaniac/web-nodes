import { envSchema, webnodeOptionsWithDefaultsSchema } from './schemas';
import type { WebNodeOptions, WebNodeOptionsWithDefaults } from './types';

/**
 * Abstract base for WebNode to support DI and composition.
 */
export abstract class AbstractWebNode {
  private _options: WebNodeOptionsWithDefaults;

  constructor(options: WebNodeOptions) {
    this._options = this._normalizeOptions(
      options
    ) as WebNodeOptionsWithDefaults;
  }

  abstract bootstrap(): Promise<void>;
  abstract serve(): Promise<void>;
  abstract stop(): Promise<void>;

  /**
   * Load options defined in the process environment (e.g. .env files)
   * @returns an object containing the parsed envs
   */
  protected _loadEnvOptions() {
    const env = envSchema.parse(process.env);

    return {
      port: env.PORT,
      secure: env.SECURE,
      environment: env.NODE_ENV,
      baseDomain: env.BASE_DOMAIN,
    };
  }

  /**
   * Normalze, merge (defaults, envs and inputs) and parse options
   * @param inputOptions the options passed through the WebNode constructor
   * @returns parsed options
   */
  protected _normalizeOptions(
    inputOptions: WebNodeOptions
  ): WebNodeOptionsWithDefaults {
    // Loads options defined in process environment
    const envOptions = this._loadEnvOptions();

    // Generate default options from options schema with defaults defined
    const defaultOptions: Omit<WebNodeOptions, 'id'> =
      webnodeOptionsWithDefaultsSchema.omit({ id: true }).parse({});

    // Merge priority: default < env < input
    const merged = {
      ...defaultOptions,
      ...envOptions,
      ...inputOptions,
    };

    // Parse merged options
    return webnodeOptionsWithDefaultsSchema.parse(merged);
  }

  /** 🔌 Options */
  protected get options(): WebNodeOptionsWithDefaults {
    return this._options;
  }
}
