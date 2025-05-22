import { z } from 'zod';
import { webnodeOptionsWithDefaultsSchema } from '../schemas';

export type WebNodeOptionsWithDefaults = z.infer<
  typeof webnodeOptionsWithDefaultsSchema
>;
