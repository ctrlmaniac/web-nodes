import { validPortRange } from '../constants';
import { webnodeOptionsWithDefaultsSchema } from '../schemas';
import type { WebNodeOptions } from '../types';
import type { WebNodeOptionsWithDefaults } from '../types/webnode-options-with-defaults';
import { defaultOptions } from './defaults';
import { loadEnvOptions } from './load-env-options';

/**
 * Normalizza e valida le opzioni finali di WebNode
 * Le priorità sono: defaultOptions < envOptions < inputOptions
 */
export function normalizeOptions(
  inputOptions: WebNodeOptions
): WebNodeOptionsWithDefaults {
  if (!inputOptions.id) {
    throw new Error(
      'The "id" option is required and must be specified explicitly.'
    );
  }

  // Carica opzioni da env
  const envOptions = loadEnvOptions();

  // Merge con priorità: default < env < input
  const merged = {
    ...defaultOptions,
    ...envOptions,
    ...inputOptions,
  };

  // Validazione port custom (3000-65535)
  if (merged.port === undefined) {
    merged.port = 3000;
  }
  if (
    typeof merged.port !== 'number' ||
    !Number.isInteger(merged.port) ||
    merged.port < validPortRange.min ||
    merged.port > validPortRange.max
  ) {
    throw new Error(
      `Invalid port ${merged.port}. Valid port range is ${validPortRange.min} to ${validPortRange.max}.`
    );
  }

  // Validazione finale
  return webnodeOptionsWithDefaultsSchema.parse(merged);
}
