import type { Application } from 'express';
import compression, { type CompressionOptions } from 'compression';
import { WebNodeService } from './abstract-service';
import type { CompressionOption } from '../types';

/**
 * Service to configure and apply compression middleware to the Express application.
 */
export class CompressionService extends WebNodeService {
  private _memoizedOptions: CompressionOptions | false | undefined;

  /**
   * @param app The Express Application instance (DI container).
   * @param _compressionOption The compression config: `false` disables it, a `CompressionOptions` object overrides defaults, or `undefined` uses inferred defaults.
   */
  constructor(
    app: Application,
    private readonly _compressionOption: CompressionOption
  ) {
    super(app);
  }

  /**
   * Builds the final compression options:
   * - If explicitly `false`, compression is disabled.
   * - If a `CompressionOptions` object is provided, it is used as-is.
   * - Otherwise, uses sensible defaults.
   */
  private _buildCompressionOptions(): CompressionOptions | false {
    if (this._memoizedOptions !== undefined) {
      return this._memoizedOptions;
    }

    // Case 1: Disabled
    if (this._compressionOption === false) {
      this._memoizedOptions = false;
      return false;
    }

    // Case 2: User provided options
    if (this._compressionOption) {
      this._memoizedOptions = this._compressionOption;
      return this._compressionOption;
    }

    // Case 3: Default options
    const options: CompressionOptions = {
      threshold: 1024, // Compress only if body is over 1kb
    };

    this._memoizedOptions = options;
    return options;
  }

  /**
   * Applies the compression middleware to the Express app, or skips if disabled.
   */
  setup(): void {
    const compressionOptions = this._buildCompressionOptions();

    if (compressionOptions === false) return;

    this.app.use(compression(compressionOptions));
    this.logger.info('Compression middleware applied.');
  }
}
