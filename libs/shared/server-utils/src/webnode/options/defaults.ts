import { webnodeOptionsWithDefaultsSchema } from '../schemas';
import type { WebNodeOptions } from '../types';

export const defaultOptions: Omit<WebNodeOptions, 'id'> =
  webnodeOptionsWithDefaultsSchema.omit({ id: true }).parse({});
